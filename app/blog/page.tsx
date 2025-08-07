'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface BlogPost {
  id?: number
  title: string
  content: string
  category: string
  author: string
  date: string
  image?: string
}

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [newBlog, setNewBlog] = useState<BlogPost>({
    title: '',
    content: '',
    category: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
  })
  const [loading, setLoading] = useState(false)

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('date', { ascending: false })

      if (error) console.error('Fetch error:', error)
      else setBlogPosts(data as BlogPost[])
      setLoading(false)
    }

    fetchBlogs()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewBlog((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!newBlog.title || !newBlog.content || !newBlog.category || !newBlog.author) {
      alert('Please fill in all required fields.')
      return
    }

    const { data, error } = await supabase
      .from('blogs')
      .insert([{ ...newBlog }])
      .select()

    if (error) {
      console.error('Insert error:', error)
    } else {
      setBlogPosts((prev) => [data[0], ...prev])
      setNewBlog({
        title: '',
        content: '',
        category: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        image: '',
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Blogs</h1>

      <div className="space-y-4 border p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
        <Input name="title" placeholder="Title" value={newBlog.title} onChange={handleChange} />
        <Input name="author" placeholder="Author" value={newBlog.author} onChange={handleChange} />
        <Input name="category" placeholder="Category" value={newBlog.category} onChange={handleChange} />
        <Input name="image" placeholder="Image URL (optional)" value={newBlog.image} onChange={handleChange} />
        <textarea
          name="content"
          placeholder="Content"
          value={newBlog.content}
          onChange={handleChange}
          className="w-full p-2 border rounded h-32 resize-y"
        />
        <Button onClick={handleSubmit}>Add Blog</Button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : (
        <div className="space-y-6">
          {blogPosts.map((post) => (
            <div key={post.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600 text-sm mb-2">
                {post.author} • {post.category} • {post.date}
              </p>
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto object-cover rounded mb-2"
                />
              )}
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BlogPage








// "use client"

// import { useEffect, useState } from "react"
// import BlogCard from "@/components/BlogCard/BlogCard"
// import Link from "next/link"

// interface BlogPost {
//   id: number
//   title: string
//   slug: string
//   excerpt: string
//   content: string
//   category: string
//   author: string
//   date: string
//   image: string
// }

// export default function BlogPage() {
//   const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])

//   const [newBlog, setNewBlog] = useState({
//     title: "",
//     content: "",
//     category: "",
//     author: "",
//     date: new Date().toISOString().split("T")[0],
//     image: ""
//   })

//   useEffect(() => {
//     fetch("/api/blogs")
//       .then((res) => res.json())
//       .then((data) => setBlogPosts(data))
//   }, [])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setNewBlog({ ...newBlog, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     const blogToAdd: BlogPost = {
//       id: Date.now(),
//       title: newBlog.title,
//       slug: newBlog.title.toLowerCase().replace(/\s+/g, "-"),
//       excerpt: newBlog.content.length > 100 ? newBlog.content.slice(0, 100) + "..." : newBlog.content,
//       content: newBlog.content,
//       category: newBlog.category,
//       author: newBlog.author,
//       date: newBlog.date,
//       image: newBlog.image || "/placeholder.svg?height=300&width=400"
//     }

//     const res = await fetch("/api/blogs", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(blogToAdd)
//     })

//     if (res.ok) {
//       setBlogPosts((prev) => [...prev, blogToAdd])
//       setNewBlog({
//         title: "",
//         content: "",
//         category: "",
//         author: "",
//         date: new Date().toISOString().split("T")[0],
//         image: ""
//       })
//     }
//   }

//   const renderSection = (
//     title: string,
//     filterFn: (post: BlogPost, index: number, array: BlogPost[]) => boolean
//   ) => (
//     <div className="mb-16">
//       <h2 className="text-3xl font-bold mb-8">{title}</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {blogPosts.filter(filterFn).map((post, idx) => (
//           <BlogCard key={post.id} post={post} />
//         ))}
//       </div>
//     </div>
//   )

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-4xl font-bold mb-4">Blog</h1>
//         <p className="text-lg mb-12 max-w-3xl">
//           Insights, updates, and stories about our work and the impact of AI for social good.
//         </p>

//         {/* Add Blog Form */}
//         <form onSubmit={handleSubmit} className="bg-gray-100 p-6 mb-12 rounded-md shadow-md space-y-4">
//           <input name="title" value={newBlog.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border" required />
//           <textarea name="content" value={newBlog.content} onChange={handleChange} placeholder="Full Content" className="w-full p-2 border" required />
//           <input name="category" value={newBlog.category} onChange={handleChange} placeholder="Category (education/healthcare/social)" className="w-full p-2 border" required />
//           <input name="author" value={newBlog.author} onChange={handleChange} placeholder="Author" className="w-full p-2 border" required />
//           <input name="image" value={newBlog.image} onChange={handleChange} placeholder="Image URL (optional)" className="w-full p-2 border" />
//           <button type="submit" className="bg-black text-white px-4 py-2 rounded">Add Blog</button>
//         </form>

//         {renderSection("Latest Articles", (_p, i, arr) => i >= arr.length - 3)}
//         {renderSection("Education", (p) => p.category.toLowerCase() === "education")}
//         {renderSection("Healthcare", (p) => p.category.toLowerCase() === "healthcare")}
//         {renderSection("Social Good", (p) => p.category.toLowerCase() === "social")}

//         <div className="text-center mt-12">
//           <p className="text-lg mb-6">Subscribe to our newsletter to stay updated with our latest articles and news.</p>
//           <Link href="/contact" className="bg-black text-white px-6 py-3 rounded-md font-medium inline-block">
//             Subscribe
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }
