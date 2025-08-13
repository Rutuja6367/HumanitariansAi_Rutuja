'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface BlogPost {
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

const BUCKET = 'blog-images'

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [newBlog, setNewBlog] = useState<BlogPost>({
    title: '',
    slug: '',
    content: '',
    category: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    image: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Fetch blogs
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

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewBlog((prev) => ({
      ...prev,
      [name]: value,
      slug: name === 'title' ? generateSlug(value) : prev.slug,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
  }

  const uploadImageAndGetUrl = async (file: File, slug: string): Promise<string | null> => {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `blogs/${slug}-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      setErrorMsg(uploadError.message)
      return null
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return data?.publicUrl ?? null
  }

  const handleSubmit = async () => {
    setErrorMsg(null)
    const { title, slug, content, category, author, date, excerpt } = newBlog

    if (!title || !slug || !content || !category || !author) {
      setErrorMsg('Please fill in all required fields (title, slug, content, category, author).')
      return
    }

    setSubmitting(true)

    let imageUrl: string | undefined
    if (file) {
      const url = await uploadImageAndGetUrl(file, slug)
      if (!url) {
        setSubmitting(false)
        return
      }
      imageUrl = url
    } else if (newBlog.image) {
      imageUrl = newBlog.image
    }

    const payload = {
      title,
      slug,
      content,
      category,
      author,
      date: date || new Date().toISOString().split('T')[0],
      ...(excerpt ? { excerpt } : {}),
      ...(imageUrl ? { image: imageUrl } : {}),
    }

    const { data, error } = await supabase.from('blogs').insert([payload]).select()

    setSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    if (data && data[0]) {
      setBlogPosts((prev) => [data[0] as BlogPost, ...prev])
      setNewBlog({
        title: '',
        slug: '',
        content: '',
        category: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        excerpt: '',
        image: '',
      })
      setFile(null)
    }
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    const confirm = window.confirm('Delete this blog post? This cannot be undone.')
    if (!confirm) return

    setDeletingId(id)
    setErrorMsg(null)

    // Optimistic UI
    const prev = blogPosts
    setBlogPosts((cur) => cur.filter((p) => p.id !== id))

    const { error } = await supabase.from('blogs').delete().eq('id', id)

    setDeletingId(null)

    if (error) {
      setErrorMsg(error.message)
      // rollback
      setBlogPosts(prev)
    }
  }

  const isSubmittingDisabled = useMemo(
    () => submitting || !newBlog.title || !newBlog.slug || !newBlog.content || !newBlog.category || !newBlog.author,
    [submitting, newBlog]
  )

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-2">Blogs</h1>
      <p className="text-sm text-gray-500">Create, list, and remove posts. Images are stored in Supabase Storage, and the URL is saved in the table.</p>

      {errorMsg && (
        <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <div className="space-y-4 border p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
        <Input name="title" placeholder="Title *" value={newBlog.title} onChange={handleChange} />
        {/* Slug is auto-generated from title but editable if needed */}
        <Input name="slug" placeholder="Slug *" value={newBlog.slug} onChange={handleChange} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input name="author" placeholder="Author *" value={newBlog.author} onChange={handleChange} />
          <Input name="category" placeholder="Category *" value={newBlog.category} onChange={handleChange} />
        </div>
        <Input name="excerpt" placeholder="Excerpt (optional)" value={newBlog.excerpt} onChange={handleChange} />
        {/* Either upload a file or paste a URL below */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0 file:text-sm file:font-semibold
                     file:bg-gray-200 file:text-gray-900 hover:file:bg-gray-300
                     dark:file:bg-gray-700 dark:file:text-gray-100 dark:hover:file:bg-gray-600"
        />
        <Input
          name="image"
          placeholder="Or paste an image URL"
          value={newBlog.image}
          onChange={handleChange}
        />
        <textarea
          name="content"
          placeholder="Content *"
          value={newBlog.content}
          onChange={handleChange}
          className="w-full p-2 border rounded h-32 resize-y"
        />
        <div className="flex gap-3">
          <Button disabled={isSubmittingDisabled} onClick={handleSubmit}>
            {submitting ? 'Saving…' : 'Add Blog'}
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : (
        <div className="space-y-6">
          {blogPosts.map((post) => (
            <div key={post.id} className="border p-4 rounded shadow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <p className="text-gray-600 text-sm mb-2">
                    {post.author} • {post.category} • {post.date} • <span className="text-gray-500">/{post.slug}</span>
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
                  className="w-full h-auto object-cover rounded mb-2"
                />
              )}

              {post.excerpt && <p className="mb-2">{post.excerpt}</p>}
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BlogPage
