'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// ---- TIPTAP ----
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Gapcursor from '@tiptap/extension-gapcursor'
import Dropcursor from '@tiptap/extension-dropcursor'

type BlogPost = {
  id?: number
  title: string
  slug: string
  content: string
  category: string
  author: string
  date: string
  excerpt?: string
  image?: string
}

const COVER_BUCKET = 'blog-images'
const MEDIA_BUCKET = 'blog-media'

// Dropdown options (you can move these to DB later)
const CATEGORY_OPTIONS = ['education', 'healthcare', 'social', 'technology', 'research']
const AUTHOR_OPTIONS = ['Jane Smith', 'Alex Johnson', 'Taylor Lee']

// ---- helpers ----
const generateSlug = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // form fields
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [author, setAuthor] = useState(AUTHOR_OPTIONS[0] || '')
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0] || '')
  const [excerpt, setExcerpt] = useState('')
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverUrl, setCoverUrl] = useState<string>('')

  // update slug on title change
  useEffect(() => setSlug(generateSlug(title)), [title])

  // fetch posts
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      setErrorMsg(null)
      const { data, error } = await supabase.from('blogs').select('*').order('date', { ascending: false })
      if (error) setErrorMsg(error.message)
      else setBlogPosts((data || []) as BlogPost[])
      setLoading(false)
    }
    fetchBlogs()
  }, [])

  // ---- TIPTAP editor setup ----
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({
        openOnClick: true,
        autolink: true,
        protocols: ['http', 'https', 'mailto', 'tel'],
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Write here. You can also add images & video.' }),
      Gapcursor,
      Dropcursor,
    ],
    content: '',
    autofocus: false,
    editorProps: {
      // Make the *ProseMirror root* own the size/border so clicks anywhere focus it
      attributes: {
        class:
          'ProseMirror prose max-w-none p-3 min-h-[220px] border rounded bg-white focus:outline-none',
      },
    },
  })

  // ---- Supabase upload ----
  async function uploadToBucket(bucket: string, file: File, prefix: string) {
    const ext = (file.name.split('.').pop() || 'dat').toLowerCase()
    const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: false })
    if (error) throw error
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data?.publicUrl as string
  }

  // ---- Toolbar actions ----
  const insertImage = async () => {
    if (!editor) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const url = await uploadToBucket(MEDIA_BUCKET, file, `blogs/${slug || 'post'}/images`)
        editor.chain().focus().setImage({ src: url, alt: 'image' }).run()
      } catch (e: any) {
        setErrorMsg(e.message ?? 'Upload failed')
      }
    }
    input.click()
  }

  const insertVideo = async () => {
    if (!editor) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'video/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const url = await uploadToBucket(MEDIA_BUCKET, file, `blogs/${slug || 'post'}/videos`)
        // embed a responsive HTML5 video
        editor
          .chain()
          .focus()
          .insertContent(`<div class="my-3"><video src="${url}" controls style="max-width:100%;height:auto;"></video></div>`)
          .run()
      } catch (e: any) {
        setErrorMsg(e.message ?? 'Upload failed')
      }
    }
    input.click()
  }

  // ---- Submit ----
  const isDisabled = submitting || !title || !slug || !author || !category || !editor?.getHTML()

  const handleSubmit = async () => {
    if (isDisabled || !editor) return
    setErrorMsg(null)
    setSubmitting(true)

    // cover url
    let finalCover: string | undefined = coverUrl || undefined
    try {
      if (coverFile) {
        finalCover = await uploadToBucket(COVER_BUCKET, coverFile, `blogs/${slug || 'post'}/cover`)
      }
    } catch (e: any) {
      setSubmitting(false)
      setErrorMsg(e.message ?? 'Cover upload failed')
      return
    }

    const payload: Omit<BlogPost, 'id'> = {
      title,
      slug,
      author,
      category,
      content: editor.getHTML(), // persisted HTML
      date: date || new Date().toISOString().split('T')[0],
      ...(excerpt ? { excerpt } : {}),
      ...(finalCover ? { image: finalCover } : {}),
    }

    const { data, error } = await supabase.from('blogs').insert([payload]).select()
    setSubmitting(false)
    if (error) {
      setErrorMsg(error.message)
      return
    }
    if (data && data[0]) {
      setBlogPosts((prev) => [data[0] as BlogPost, ...prev])
      // reset
      setTitle('')
      setSlug('')
      setAuthor(AUTHOR_OPTIONS[0] || '')
      setCategory(CATEGORY_OPTIONS[0] || '')
      setExcerpt('')
      setDate(new Date().toISOString().split('T')[0])
      setCoverFile(null)
      setCoverUrl('')
      editor.commands.clearContent()
    }
  }

  // ---- Delete ----
  const handleDelete = async (id?: number) => {
    if (!id) return
    if (!confirm('Delete this blog post?')) return
    setDeletingId(id)
    const prev = blogPosts
    setBlogPosts((cur) => cur.filter((p) => p.id !== id))
    const { error } = await supabase.from('blogs').delete().eq('id', id)
    setDeletingId(null)
    if (error) {
      setErrorMsg(error.message)
      setBlogPosts(prev)
    }
  }

  // ---- Toolbar UI (LinkedIn-y) ----
  const Toolbar = () => {
    if (!editor) return null
    return (
      <div className="flex flex-wrap items-center gap-2 border rounded-md px-3 py-2 bg-white">
        <select
          className="border rounded px-2 py-1"
          onChange={(e) => {
            const v = e.target.value
            if (v === 'p') editor.chain().focus().setParagraph().run()
            else editor.chain().focus().setHeading({ level: Number(v) as 1 | 2 | 3 }).run()
          }}
          defaultValue="p"
        >
          <option value="p">Style</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>

        <button className="btn" onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
        <button className="btn" onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
        <button className="btn" onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
        <button className="btn" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</button>
        <button className="btn" onClick={() => editor.chain().focus().toggleBulletList().run()}>•</button>
        <button className="btn" onClick={() => editor.chain().focus().toggleBlockquote().run()}>&ldquo;</button>
        <button className="btn" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{`{ }`}</button>

        <button className="btn" onClick={() => editor.chain().focus().setTextAlign('left').run()}>⟸</button>
        <button className="btn" onClick={() => editor.chain().focus().setTextAlign('center').run()}>⇔</button>
        <button className="btn" onClick={() => editor.chain().focus().setTextAlign('right').run()}>⟹</button>

        <button className="btn" onClick={() => {
          const url = prompt('Enter URL')
          if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        }}>🔗</button>

        <button className="btn" onClick={insertImage}>🖼️</button>
        <button className="btn" onClick={insertVideo}>🎬</button>

        <button className="btn" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>⟲</button>

        <style jsx>{`
          .btn {
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 4px 8px;
            background: #fff;
          }
          .btn:hover { background: #f3f4f6 }
        `}</style>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Write a Blog</h1>

      {errorMsg && (
        <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Composer */}
      <div className="rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-800 p-4 space-y-4">
        {/* Cover media (image/video like LinkedIn) */}
        <div className="w-full border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div className="font-medium mb-2">Add a cover image or video to your article.</div>
          <div className="flex flex-wrap gap-3 items-center">
            <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
            <Input placeholder="Or paste a cover image URL" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} />
          </div>
        </div>

        {/* Title */}
        <Input className="text-xl" placeholder="Title *" value={title} onChange={(e) => setTitle(e.target.value)} />

        {/* Meta: author/category/date (dropdowns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select value={author} onChange={(e) => setAuthor(e.target.value)} className="border rounded p-2 bg-white dark:bg-gray-900">
            {AUTHOR_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded p-2 bg-white dark:bg-gray-900">
            {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        {/* Excerpt */}
        <Input placeholder="Excerpt (optional)" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />

        {/* Toolbar + Editor (LinkedIn-like) */}
        <Toolbar />

        {/* Editor — ProseMirror owns the border/height so clicks anywhere focus it */}
        <EditorContent editor={editor} />

        {/* Slug (editable) */}
        <Input placeholder="Slug *" value={slug} onChange={(e) => setSlug(e.target.value)} />

        <div className="flex gap-3">
          <Button disabled={isDisabled} onClick={handleSubmit}>
            {submitting ? 'Publishing…' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* List of posts */}
      <h2 className="text-2xl font-semibold">Posts</h2>
      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="space-y-6">
          {blogPosts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    {post.author} • {post.category} • {post.date} • /{post.slug}
                  </p>
                </div>
                <Button variant="destructive" onClick={() => handleDelete(post.id)} disabled={deletingId === post.id}>
                  {deletingId === post.id ? 'Removing…' : 'Remove'}
                </Button>
              </div>
              {post.image && <img src={post.image} alt={post.title} className="w-full h-auto object-cover rounded mt-3" />}
              {/* Render HTML from Tiptap */}
              <div className="prose dark:prose-invert max-w-none mt-4" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          ))}
        </div>
      )}

      {/* Optional fallback styles if Tailwind Typography isn't loaded */}
      <style jsx global>{`
        .ProseMirror { cursor: text; }
        .ProseMirror:focus { outline: none; }
        /* Fallback heading sizes (will be overridden by Tailwind Typography if present) */
        .ProseMirror h1 { font-size: 1.875rem; line-height: 2.25rem; font-weight: 700; }
        .ProseMirror h2 { font-size: 1.5rem; line-height: 2rem; font-weight: 700; }
        .ProseMirror h3 { font-size: 1.25rem; line-height: 1.75rem; font-weight: 600; }
      `}</style>
    </div>
  )
}










// 'use client'

// import React, { useEffect, useState, useMemo } from 'react'
// import { supabase } from '@/lib/supabaseClient'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'

// interface BlogPost {
//   id?: number
//   title: string
//   slug: string
//   content: string
//   category: string
//   author: string
//   date: string
//   excerpt?: string
//   image?: string
// }

// const BUCKET = 'blog-images'

// const BlogPage = () => {
//   const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
//   const [newBlog, setNewBlog] = useState<BlogPost>({
//     title: '',
//     slug: '',
//     content: '',
//     category: '',
//     author: '',
//     date: new Date().toISOString().split('T')[0],
//     excerpt: '',
//     image: '',
//   })
//   const [loading, setLoading] = useState(false)
//   const [submitting, setSubmitting] = useState(false)
//   const [file, setFile] = useState<File | null>(null)
//   const [errorMsg, setErrorMsg] = useState<string | null>(null)
//   const [deletingId, setDeletingId] = useState<number | null>(null)

//   // Fetch blogs
//   useEffect(() => {
//     const fetchBlogs = async () => {
//       setLoading(true)
//       setErrorMsg(null)
//       const { data, error } = await supabase
//         .from('blogs')
//         .select('*')
//         .order('date', { ascending: false })

//       if (error) setErrorMsg(error.message)
//       else setBlogPosts((data || []) as BlogPost[])
//       setLoading(false)
//     }
//     fetchBlogs()
//   }, [])

//   const generateSlug = (title: string) =>
//     title
//       .toLowerCase()
//       .trim()
//       .replace(/[^\w\s-]/g, '')
//       .replace(/\s+/g, '-')

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setNewBlog((prev) => ({
//       ...prev,
//       [name]: value,
//       slug: name === 'title' ? generateSlug(value) : prev.slug,
//     }))
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const f = e.target.files?.[0] ?? null
//     setFile(f)
//   }

//   const uploadImageAndGetUrl = async (file: File, slug: string): Promise<string | null> => {
//     const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
//     const path = `blogs/${slug}-${Date.now()}.${ext}`

//     const { error: uploadError } = await supabase.storage
//       .from(BUCKET)
//       .upload(path, file, { cacheControl: '3600', upsert: false })

//     if (uploadError) {
//       setErrorMsg(uploadError.message)
//       return null
//     }

//     const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
//     return data?.publicUrl ?? null
//   }

//   const handleSubmit = async () => {
//     setErrorMsg(null)
//     const { title, slug, content, category, author, date, excerpt } = newBlog

//     if (!title || !slug || !content || !category || !author) {
//       setErrorMsg('Please fill in all required fields (title, slug, content, category, author).')
//       return
//     }

//     setSubmitting(true)

//     let imageUrl: string | undefined
//     if (file) {
//       const url = await uploadImageAndGetUrl(file, slug)
//       if (!url) {
//         setSubmitting(false)
//         return
//       }
//       imageUrl = url
//     } else if (newBlog.image) {
//       imageUrl = newBlog.image
//     }

//     const payload = {
//       title,
//       slug,
//       content,
//       category,
//       author,
//       date: date || new Date().toISOString().split('T')[0],
//       ...(excerpt ? { excerpt } : {}),
//       ...(imageUrl ? { image: imageUrl } : {}),
//     }

//     const { data, error } = await supabase.from('blogs').insert([payload]).select()

//     setSubmitting(false)

//     if (error) {
//       setErrorMsg(error.message)
//       return
//     }

//     if (data && data[0]) {
//       setBlogPosts((prev) => [data[0] as BlogPost, ...prev])
//       setNewBlog({
//         title: '',
//         slug: '',
//         content: '',
//         category: '',
//         author: '',
//         date: new Date().toISOString().split('T')[0],
//         excerpt: '',
//         image: '',
//       })
//       setFile(null)
//     }
//   }

//   const handleDelete = async (id?: number) => {
//     if (!id) return
//     const confirm = window.confirm('Delete this blog post? This cannot be undone.')
//     if (!confirm) return

//     setDeletingId(id)
//     setErrorMsg(null)

//     // Optimistic UI
//     const prev = blogPosts
//     setBlogPosts((cur) => cur.filter((p) => p.id !== id))

//     const { error } = await supabase.from('blogs').delete().eq('id', id)

//     setDeletingId(null)

//     if (error) {
//       setErrorMsg(error.message)
//       // rollback
//       setBlogPosts(prev)
//     }
//   }

//   const isSubmittingDisabled = useMemo(
//     () => submitting || !newBlog.title || !newBlog.slug || !newBlog.content || !newBlog.category || !newBlog.author,
//     [submitting, newBlog]
//   )

//   return (
//     <div className="max-w-4xl mx-auto p-4 space-y-8">
//       <h1 className="text-3xl font-bold mb-2">Blogs</h1>
//       <p className="text-sm text-gray-500">Create, list, and remove posts. Images are stored in Supabase Storage, and the URL is saved in the table.</p>

//       {errorMsg && (
//         <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
//           {errorMsg}
//         </div>
//       )}

//       <div className="space-y-4 border p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
//         <Input name="title" placeholder="Title *" value={newBlog.title} onChange={handleChange} />
//         {/* Slug is auto-generated from title but editable if needed */}
//         <Input name="slug" placeholder="Slug *" value={newBlog.slug} onChange={handleChange} />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <Input name="author" placeholder="Author *" value={newBlog.author} onChange={handleChange} />
//           <Input name="category" placeholder="Category *" value={newBlog.category} onChange={handleChange} />
//         </div>
//         <Input name="excerpt" placeholder="Excerpt (optional)" value={newBlog.excerpt} onChange={handleChange} />
//         {/* Either upload a file or paste a URL below */}
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setFile(e.target.files?.[0] ?? null)}
//           className="block w-full text-sm file:mr-4 file:py-2 file:px-4
//                      file:rounded file:border-0 file:text-sm file:font-semibold
//                      file:bg-gray-200 file:text-gray-900 hover:file:bg-gray-300
//                      dark:file:bg-gray-700 dark:file:text-gray-100 dark:hover:file:bg-gray-600"
//         />
//         <Input
//           name="image"
//           placeholder="Or paste an image URL"
//           value={newBlog.image}
//           onChange={handleChange}
//         />
//         <textarea
//           name="content"
//           placeholder="Content *"
//           value={newBlog.content}
//           onChange={handleChange}
//           className="w-full p-2 border rounded h-32 resize-y"
//         />
//         <div className="flex gap-3">
//           <Button disabled={isSubmittingDisabled} onClick={handleSubmit}>
//             {submitting ? 'Saving…' : 'Add Blog'}
//           </Button>
//         </div>
//       </div>

//       {loading ? (
//         <p className="text-center text-gray-500">Loading blogs...</p>
//       ) : (
//         <div className="space-y-6">
//           {blogPosts.map((post) => (
//             <div key={post.id} className="border p-4 rounded shadow">
//               <div className="flex items-start justify-between gap-4">
//                 <div>
//                   <h2 className="text-xl font-semibold">{post.title}</h2>
//                   <p className="text-gray-600 text-sm mb-2">
//                     {post.author} • {post.category} • {post.date} • <span className="text-gray-500">/{post.slug}</span>
//                   </p>
//                 </div>
//                 <Button
//                   variant="destructive"
//                   onClick={() => handleDelete(post.id)}
//                   disabled={deletingId === post.id}
//                 >
//                   {deletingId === post.id ? 'Removing…' : 'Remove'}
//                 </Button>
//               </div>

//               {post.image && (
//                 <img
//                   src={post.image}
//                   alt={post.title}
//                   className="w-full h-auto object-cover rounded mb-2"
//                 />
//               )}

//               {post.excerpt && <p className="mb-2">{post.excerpt}</p>}
//               <p>{post.content}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default BlogPage
