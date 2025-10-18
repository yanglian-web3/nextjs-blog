// components/blog-editor.tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import {useEffect, useState} from 'react'

const lowlight = createLowlight(common)

export default function BlogEditor() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [isClient, setIsClient] = useState(false)

    // / 确保只在客户端初始化编辑器
    useEffect(() => {
        setIsClient(true)
    }, [])

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: `
      <h2>开始编写你的博客文章</h2>
      <p>在这里输入你的内容...</p>
    `,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            setContent(html)
        },
        immediatelyRender: false, // 明确设置为 false
    }, [isClient]) // 依赖 isClient

    if (!isClient || !editor) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="min-h-[500px] flex items-center justify-center">
                    <div className="text-gray-500">加载编辑器中...</div>
                </div>
            </div>
        )
    }

    if (!editor) {
        return <div>加载编辑器...</div>
    }

    const handlePublish = async () => {
        // 处理发布逻辑
        console.log('发布文章:', { title, content })
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* 文章头部 */}
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="文章标题..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-4xl font-bold border-none outline-none mb-4 placeholder-gray-400"
                />
                <textarea
                    placeholder="文章摘要..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    rows={3}
                />
            </div>

            {/* 工具栏 */}
            <div className="flex flex-wrap gap-2 p-4 border border-gray-300 rounded-t-lg bg-gray-50">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded ${
                        editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                    }`}
                >
                    <strong>B</strong>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded ${
                        editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                    }`}
                >
                    <em>I</em>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded ${
                        editor.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                    }`}
                >
                    H1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded ${
                        editor.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                    }`}
                >
                    H2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-2 rounded ${
                        editor.isActive('codeBlock') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                    }`}
                >
                    代码
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded ${
                        editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                    }`}
                >
                    列表
                </button>
            </div>

            {/* 编辑器区域 */}
            <EditorContent
                editor={editor}
                className="min-h-[500px] p-6 border border-gray-300 border-t-0 rounded-b-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            {/* 操作按钮 */}
            <div className="flex gap-4 mt-6">
                <button
                    onClick={handlePublish}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    发布文章
                </button>
                <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    保存草稿
                </button>
            </div>
        </div>
    )
}