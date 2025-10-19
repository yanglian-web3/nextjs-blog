"use client"

import {useEffect, useRef} from "react";
import { useEditorInstance } from '../../hooks/use-editor-instance'
import "./blog-editor-tools.css"
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store/index";
import { updateEditorToolsHeight } from "../../store/editor-tools-slice";

export default function BlogEditorTools(){
    const dispatch = useDispatch<AppDispatch>()
    const { editor } = useEditorInstance()
    const editorToolsRef = useRef<HTMLDivElement | null>(null) // 创建一个ref对象

// 监听 ref 变化，获取高度
    useEffect(() => {
        if (editorToolsRef.current) {
            const height = editorToolsRef.current?.offsetHeight
            dispatch(updateEditorToolsHeight(height))
            console.log('编辑器工具栏高度:', height)

            // 可以在这里将高度存储到 Redux 或传递给父组件
        }
    }, [editorToolsRef.current]) // 当 ref 变化时触发
    /**
     * 加粗
     */
    const toggleBold = () => {
        if(!editor){
            return
        }
        editor.chain().focus().toggleBold().run()
    }
    /**
     * 斜体
     */
    const toggleItalic = () => {
        if(!editor){
            return
        }
        editor.chain().focus().toggleItalic().run()
    }
    /**
     * 标题字号H
     */
    const toggleHeading = (level:number) => {
        if(!editor){
            return
        }
        editor.chain().focus().toggleHeading({ level }).run()
    }
    /**
     * 代码块
     */
    const toggleCodeBlock = () => {
        if(!editor){
            return
        }
        editor.chain().focus().toggleCodeBlock().run()
    }
    /**
     * 列表
     */
    const toggleBulletList = () => {
        if(!editor){
            return
        }
        editor.chain().focus().toggleBulletList().run()
    }
    return <div className="blog-editor-tools-container flex flex-wrap gap-2 p-4 border border-gray-300 bg-gray-50"
                ref={editorToolsRef}
    >
        <button
            onClick={toggleBold}
            className={`p-2 rounded ${
                editor?.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
        >
            <strong>B</strong>
        </button>
        <button
            onClick={toggleItalic}
            className={`p-2 rounded ${
                editor?.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
        >
            <em>I</em>
        </button>
        <button
            onClick={() => toggleHeading(1)}
            className={`p-2 rounded ${
                editor?.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
        >
            H1
        </button>
        <button
            onClick={() => toggleHeading(2)}
            className={`p-2 rounded ${
                editor?.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
        >
            H2
        </button>
        <button
            onClick={toggleCodeBlock}
            className={`p-2 rounded ${
                editor?.isActive('codeBlock') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
        >
            代码
        </button>
        <button
            onClick={toggleBulletList}
            className={`p-2 rounded ${
                editor?.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
        >
            列表
        </button>
    </div>
}