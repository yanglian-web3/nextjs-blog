// components/blog-editor.tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import {useEffect, useState} from 'react'
import { useDispatch} from "react-redux";
import { AppDispatch } from "../../store/index";
import { updateContent } from "../../store/blog-edit-slice";

const lowlight = createLowlight(common)

export default function BlogEditor() {
    const dispatch = useDispatch<AppDispatch>()

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
            dispatch(updateContent(html))
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

    return  <EditorContent
        editor={editor}
        className="min-h-[500px] p-6  focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1"
    />
}