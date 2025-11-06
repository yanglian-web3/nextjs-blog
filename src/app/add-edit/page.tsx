// app/add-edit/page.tsx
import { Metadata } from 'next'
import { Suspense } from 'react'
import BlogEditHead from "../../components/blog-add-edit/blog-edit-head/blog-edit-head";
import BlogEditPublishButtons from "../../components/blog-add-edit/blog-edit-publish-buttons";
import "./blog-add-edit.css"
import BlogEditor from "../../components/blog-editor/blog-editor";

export const metadata: Metadata = {
    title: '写文章 - 我的博客',
    description: '创建或编辑博客文章',
}

// 创建一个包装组件来处理搜索参数
function BlogEditorWrapper() {
    return (
        <Suspense fallback={<div>加载编辑器中...</div>}>
            <BlogEditor />
        </Suspense>
    )
}

export default async function AddEditPage() {

    return <div className="blog-add-edit-container">
        <BlogEditHead/>
        {/*中间部分*/}
        <div className="blog-edit-middle-container">
            <BlogEditorWrapper />
        </div>
        {/* 操作按钮 */}
        <BlogEditPublishButtons/>
    </div>
}