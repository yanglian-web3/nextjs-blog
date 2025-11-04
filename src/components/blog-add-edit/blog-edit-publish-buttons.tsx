"use client"

import { useState } from "react"
import "./blog-edit-publish-buttons.css"
import { useSelector } from "react-redux"
import { RootState } from "../../store/index"
import {useLoading} from "../../context/loading-context";
import {useRouter} from "next/navigation";
import {blogFetch} from "../../utils/blog-fetch";
import BlogAlert from "../blog-alert/blog-alert";

type AlertType = 'warning' | 'error' | 'info'

export default function BlogEditPublishButtons() {
    const router = useRouter()
    const { title, content } = useSelector((state: RootState) => state.blogEdit)
    const [alertOpen, setAlertOpen] = useState(false)
    const [footer, setShowDialogFooter] = useState(true)
    const [alertConfig, setAlertConfig] = useState({
        title: "",
        message: "",
        type: 'warning' as AlertType
    })

    const { showLoading, hideLoading } = useLoading()
    /**
     * 显示警告弹窗
     * @param message
     * @param type
     * @param title
     */
    const showAlert = (message: string, type: AlertType = 'warning', title: string = '提示') => {
        setAlertConfig({ title, message, type })
        setAlertOpen(true)
    }
    /**
     * 隐藏警告弹窗
     */
    const hideAlert = () => {
        setAlertOpen(false)
    }
    /**
     * 校验
     */
    const validateForm = () => {
        if (!title.trim()) {
            showAlert("文章标题不能为空", "warning", "缺少标题")
            return false
        }
        // console.log("content=", content)
        if (!content.trim() || content === '<p></p>') {
            showAlert("文章内容不能为空", "warning", "缺少内容")
            return false
        }
        return true
    }

    /**
     * 保存
     * @param status
     */
    const handleSave = (status:number) => {
        if (!validateForm()) return
        showLoading()
        blogFetch('/api/blog/add-edit', {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify({ title, content, status })
        })
            .then(data => {
                if(data.code === 200){
                    // 保存草稿逻辑
                    console.log('保存:', { title, content })
                    setShowDialogFooter(false)
                    showAlert("保存成功", "info", "保存成功")
                    setTimeout(() => {
                        hideAlert()
                        // 跳转到个人主页
                        router.push(`/my-blog-list`)
                    }, 2000)
                } else {
                    showAlert("保存失败，请重试", "error", "保存失败")
                }
            })
            .catch( (error) => {
                console.error(error)
                showAlert("保存失败，请重试", "error", "保存失败")
            })
            .finally(() => {
                hideLoading()
            })
    }


    return (
        <>
            <div className="blog-edit-publish-buttons-container flex justify-end items-center px-10 fixed w-screen bottom-0 bg-white border-t py-4 shadow-lg">
                <button
                    onClick={() => handleSave(0)}
                    className="blog-edit-button blog-edit-drag-button px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mr-4 text-gray-700"
                >
                    保存草稿
                </button>
                <button
                    onClick={() => handleSave(1)}
                    className="blog-edit-button blog-edit-publish-button px-6 py-2 text-white rounded-lg transition-colors bg-blue-500 hover:bg-blue-600 font-medium"
                >
                    保存并发布
                </button>
            </div>

            {/* 警告弹窗 */}
            <BlogAlert  open={alertOpen} updateOpen={setAlertOpen} config={alertConfig} footer={footer}/>
        </>
    )
}