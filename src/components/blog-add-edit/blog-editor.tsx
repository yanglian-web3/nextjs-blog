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
import { useEditorContext } from '../../context/editor-context'

import "./blog-editor.css"


const lowlight = createLowlight(common)

export default function BlogEditor() {
    const dispatch = useDispatch<AppDispatch>()
    const { setEditor } = useEditorContext()
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
        // 编辑器创建完成时的回调
        onCreate: ({ editor }) => {
            console.log('编辑器已创建:', editor)
            setEditor(editor)
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            dispatch(updateContent(html))
        },
        // 编辑器销毁时的回调（可选）
        onDestroy: () => {
            console.log('编辑器已销毁')
            setEditor(null)
        },
        immediatelyRender: false, // 明确设置为 false
    }, [isClient]) // 依赖 isClient
    console.log("editor=", editor)
    console.log("isClient=", isClient)
    if (!isClient || !editor) {
        return  <div className="editor-empty-container flex-1 flex items-center justify-center">
            <div className="text-gray-500">加载编辑器中...</div>
        </div>
    }


    return  <EditorContent
        editor={editor}
        className="editor-content bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1"
    />
}