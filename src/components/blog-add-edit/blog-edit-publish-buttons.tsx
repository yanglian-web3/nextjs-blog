"use client"

import "./blog-edit-publish-buttons.css"

export default function BlogEditPublishButtons(){

    const handlePublish = async () => {
        // 处理发布逻辑
        // console.log('发布文章:', { title, content })
    }

    return <div className="blog-edit-publish-buttons-container flex justify-end items-center px-20  fixed w-screen bottom-0">
        <button className="blog-edit-button blog-edit-drag-button px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            保存草稿
        </button>
        <button
            onClick={handlePublish}
            className="blog-edit-button blog-edit-publish-button px-6 py-2 text-white rounded-lg transition-colors"
        >
            发布文章
        </button>
    </div>
}