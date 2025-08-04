"use client"

import { useEffect, useState } from "react"
import BlogCard from "@/components/BlogCard/BlogCard"
import Link from "next/link"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  date: string
  image: string
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])

  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    category: "",
    author: "",
    date: new Date().toISOString().split("T")[0],
    image: ""
  })

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogPosts(data))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const blogToAdd: BlogPost = {
      id: Date.now(),
      title: newBlog.title,
      slug: newBlog.title.toLowerCase().replace(/\s+/g, "-"),
      excerpt: newBlog.content.length > 100 ? newBlog.content.slice(0, 100) + "..." : newBlog.content,
      content: newBlog.content,
      category: newBlog.category,
      author: newBlog.author,
      date: newBlog.date,
      image: newBlog.image || "/placeholder.svg?height=300&width=400"
    }

    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogToAdd)
    })

    if (res.ok) {
      setBlogPosts((prev) => [...prev, blogToAdd])
      setNewBlog({
        title: "",
        content: "",
        category: "",
        author: "",
        date: new Date().toISOString().split("T")[0],
        image: ""
      })
    }
  }

  const renderSection = (
    title: string,
    filterFn: (post: BlogPost, index: number, array: BlogPost[]) => boolean
  ) => (
    <div className="mb-16">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.filter(filterFn).map((post, idx) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-lg mb-12 max-w-3xl">
          Insights, updates, and stories about our work and the impact of AI for social good.
        </p>

        {/* Add Blog Form */}
        <form onSubmit={handleSubmit} className="bg-gray-100 p-6 mb-12 rounded-md shadow-md space-y-4">
          <input name="title" value={newBlog.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border" required />
          <textarea name="content" value={newBlog.content} onChange={handleChange} placeholder="Full Content" className="w-full p-2 border" required />
          <input name="category" value={newBlog.category} onChange={handleChange} placeholder="Category (education/healthcare/social)" className="w-full p-2 border" required />
          <input name="author" value={newBlog.author} onChange={handleChange} placeholder="Author" className="w-full p-2 border" required />
          <input name="image" value={newBlog.image} onChange={handleChange} placeholder="Image URL (optional)" className="w-full p-2 border" />
          <button type="submit" className="bg-black text-white px-4 py-2 rounded">Add Blog</button>
        </form>

        {renderSection("Latest Articles", (_p, i, arr) => i >= arr.length - 3)}
        {renderSection("Education", (p) => p.category.toLowerCase() === "education")}
        {renderSection("Healthcare", (p) => p.category.toLowerCase() === "healthcare")}
        {renderSection("Social Good", (p) => p.category.toLowerCase() === "social")}

        <div className="text-center mt-12">
          <p className="text-lg mb-6">Subscribe to our newsletter to stay updated with our latest articles and news.</p>
          <Link href="/contact" className="bg-black text-white px-6 py-3 rounded-md font-medium inline-block">
            Subscribe
          </Link>
        </div>
      </div>
    </div>
  )
}
