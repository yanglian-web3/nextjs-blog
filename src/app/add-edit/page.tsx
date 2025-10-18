// app/add-edit/page.tsx
import BlogEditor from '../../components/blog-add-edit/blog-editor'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: '写文章 - 我的博客',
    description: '创建或编辑博客文章',
}

export default function AddEditPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <BlogEditor />
        </div>
    )
}