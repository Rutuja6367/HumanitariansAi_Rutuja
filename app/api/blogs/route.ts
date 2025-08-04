import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const blogFilePath = path.join(process.cwd(), 'data', 'blogPosts.json')

export async function GET() {
  try {
    const file = fs.readFileSync(blogFilePath, 'utf-8')
    const blogs = JSON.parse(file)
    return NextResponse.json(blogs)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load blogs' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const newBlog = await req.json()
    const file = fs.readFileSync(blogFilePath, 'utf-8')
    const blogs = JSON.parse(file)

    blogs.push(newBlog)
    fs.writeFileSync(blogFilePath, JSON.stringify(blogs, null, 2))

    return NextResponse.json({ message: 'Blog saved successfully' }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save blog' }, { status: 500 })
  }
}
