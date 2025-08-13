'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabaseClient'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// IMPORTANT: react-quill is client-only; load it dynamically
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

interface BlogPost {
  id?: number
  title: string
  slug: string
  content: string // HTML from Quill
  category: string
  author: string
  date: string
  excerpt?: string
  image?: string // cover image URL
}

const COVER_BUCKET = 'blog-images'
const MEDIA_BUCKET = 'blog-media' // create this bucket in Supabase Storage too

// dropdown options (you can fetch these from DB later)
const CATEGORY_OPTIONS = ['education', 'healthcare', 'social', 'technology', 'research']
const AUTHOR_OPTIONS = ['Jane Smith', 'Alex Johnson', 'Taylor Lee']

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [author, setAuthor] = useState(AUTHOR_OPTIONS[0] || '')
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0] || '')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState<string>('') // HTML
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverUrl, setCoverUrl] = useState<string>('') // optional manual URL
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])

  const quillRef = useRef<any>(null)

  // Load posts
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      setErrorMsg(null)
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('date', { ascending: false })
      if (error) setErrorMsg(error.message)
      else setBlogPosts((data || []) as BlogPost[])
      setLoading(false)
    }
    fetchBlogs()
  }, [])

  // slug from title
  useEffect(() => {
    setSlug(
      title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
    )
  }, [title])

  // ---------- Storage helpers ----------
  const uploadToBucket = async ({
    bucket,
    file,
    prefix,
  }: {
    bucket: string
    file: File
    prefix: string
  }): Promise<string | null> => {
    const ext = (file.name.split('.').pop() || 'dat').toLowerCase()
    const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      setErrorMsg(uploadError.message)
      return null
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data?.publicUrl ?? null
  }

  // ---------- Quill toolbar & handlers ----------
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'code-block'],
          ['link', 'image', 'video'],
          [{ align: [] }],
          ['clean'],
        ],
        handlers: {
          image: async () => {
            if (!quillRef.current) return
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'
            input.onchange = async () => {
              const file = input.files?.[0]
              if (!file) return
              const url = await uploadToBucket({
                bucket: MEDIA_BUCKET,
                file,
                prefix: `blogs/${slug || 'post'}/images`,
              })
              if (!url) return
              const quill = quillRef.current.getEditor()
              const range = quill.getSelection(true)
              quill.insertEmbed(range.index, 'image', url, 'user')
              quill.setSelection(range.index + 1, 0)
            }
            input.click()
          },
          video: async () => {
            if (!quillRef.current) return
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'video/*'
            input.onchange = async () => {
              const file = input.files?.[0]
              if (!file) return
              const url = await uploadToBucket({
                bucket: MEDIA_BUCKET,
                file,
                prefix: `blogs/${slug || 'post'}/videos`,
              })
              if (!url) return
              const quill = quillRef.current.getEditor()
              const range = quill.getSelection(true)
              quill.insertEmbed(range.index, 'video', url, 'user')
              quill.setSelection(range.index + 1, 0)
            }
            input.click()
          },
        },
      },
      clipboard: { matchVisual: true },
      history: { delay: 500, maxStack: 100, userOnly: true },
    }
  }, [slug])

  // ---------- Submit ----------
  const isSubmittingDisabled =
    submitting || !title || !slug || !author || !category || !content

  const handleSubmit = async () => {
    setErrorMsg(null)
    if (isSubmittingDisabled) {
      setErrorMsg('Please fill all required fields.')
      return
    }
    setSubmitting(true)

    let finalCoverUrl: string | undefined
    if (coverFile) {
      const url = await uploadToBucket({
        bucket: COVER_BUCKET,
        file: coverFile,
        prefix: `blogs/${slug || 'post'}/cover`,
      })
      if (!url) {
        setSubmitting(false)
        return
      }
      finalCoverUrl = url
    } else if (coverUrl) {
      finalCoverUrl = coverUrl
    }

    const payload: Omit<BlogPost, 'id'> = {
      title,
      slug,
      author,
      category,
      content, // HTML with embedded media
      date: date || new Date().toISOString().split('T')[0],
      ...(excerpt ? { excerpt } : {}),
      ...(finalCoverUrl ? { image: finalCoverUrl } : {}),
    }

    const { data, error } = await supabase.from('blogs').insert([payload]).select()
    setSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }
    if (data && data[0]) {
      setBlogPosts((prev) => [data[0] as BlogPost, ...prev])
      // reset form
      setTitle('')
      setSlug('')
      setAuthor(AUTHOR_OPTIONS[0] || '')
      setCategory(CATEGORY_OPTIONS[0] || '')
      setExcerpt('')
      setContent('')
      setCoverFile(null)
      setCoverUrl('')
      setDate(new Date().toISOString().split('T')[0])
    }
  }

  // ---------- Delete ----------
  const handleDelete = async (id?: number) => {
    if (!id) return
    const yes = window.confirm('Delete this blog post?')
    if (!yes) return
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
        {/* Cover media (image) */}
        <div className="w-full border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="font-medium">Cover image</div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="mt-3">
            <Input
              placeholder="Or paste a cover image URL"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Title */}
        <Input
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl"
        />

        {/* Meta: author/category/date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border rounded p-2 bg-white dark:bg-gray-900"
          >
            {AUTHOR_OPTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded p-2 bg-white dark:bg-gray-900"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Excerpt */}
        <Input
          placeholder="Excerpt (optional)"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />

        {/* Rich editor (like LinkedIn) */}
        <div className="rounded border overflow-hidden">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            placeholder="Write here. You can also include @mentions."
          />
        </div>

        {/* Slug (editable) */}
        <Input
          placeholder="Slug *"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <div className="flex gap-3">
          <Button onClick={handleSubmit} disabled={isSubmittingDisabled}>
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
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(post.id)}
                  disabled={deletingId === post.id}
                >
                  {deletingId === post.id ? 'Removing…' : 'Remove'}
                </Button>
              </div>

              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto object-cover rounded mt-3"
                />
              )}

              {/* Render rich HTML safely; for production consider sanitizing */}
              <div
                className="prose dark:prose-invert max-w-none mt-4"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BlogPage
