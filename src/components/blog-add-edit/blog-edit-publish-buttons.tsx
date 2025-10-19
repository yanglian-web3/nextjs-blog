"use client"

import { useState } from "react"
import "./blog-edit-publish-buttons.css"
import { useSelector } from "react-redux"
import { RootState } from "../../store/index"
import { Dialog } from '@ark-ui/react'
import IconWarning from "../icons/icon-warning";

type AlertType = 'warning' | 'error' | 'info'

export default function BlogEditPublishButtons() {
    const { title, content } = useSelector((state: RootState) => state.blogEdit)
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertConfig, setAlertConfig] = useState({
        title: "",
        message: "",
        type: 'warning' as AlertType
    })

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
     * 校验
     */
    const validateForm = () => {
        if (!title.trim()) {
            showAlert("文章标题不能为空", "warning", "缺少标题")
            return false
        }
        if (!content.trim() || content === '<p></p>') {
            showAlert("文章内容不能为空", "warning", "缺少内容")
            return false
        }
        return true
    }
    /**
     * 保存草稿
     */
    const handleSaveDraft = () => {
        if (!validateForm()) return

        // 保存草稿逻辑
        console.log('保存草稿:', { title, content })
        showAlert("草稿保存成功", "info", "保存成功")
    }
    /**
     * 发布
     */
    const handlePublish = async () => {
        if (!validateForm()) return

        try {
            // 发布逻辑
            console.log('发布文章:', { title, content })
            showAlert("文章发布成功", "info", "发布成功")
        } catch (error) {
            showAlert("发布失败，请重试", "error", "发布失败")
        }
    }

    return (
        <>
            <div className="blog-edit-publish-buttons-container flex justify-end items-center px-10 fixed w-screen bottom-0 bg-white border-t py-4 shadow-lg">
                <button
                    onClick={handleSaveDraft}
                    className="blog-edit-button blog-edit-drag-button px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mr-4 text-gray-700"
                >
                    保存草稿
                </button>
                <button
                    onClick={handlePublish}
                    className="blog-edit-button blog-edit-publish-button px-6 py-2 text-white rounded-lg transition-colors bg-blue-500 hover:bg-blue-600 font-medium"
                >
                    发布文章
                </button>
            </div>

            {/* 警告弹窗 */}
            <Dialog.Root open={alertOpen} onOpenChange={(e) => setAlertOpen(e.open)}>
                <Dialog.Backdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
                <Dialog.Positioner className="fixed inset-0 flex items-center justify-center p-4 z-[100]">
                    <Dialog.Content className={`bg-white rounded-lg shadow-xl w-full max-w-md p-6`}>
                        <Dialog.Title className={`text-lg font-semibold mb-2`}>
                          <div className={`flex items-center gap-2`}>
                              <IconWarning/>
                              {alertConfig.title}
                          </div>
                        </Dialog.Title>
                        <Dialog.Description className={`mb-6`}>
                            {alertConfig.message}
                        </Dialog.Description>
                        <div className="flex justify-end">
                            <Dialog.CloseTrigger asChild>
                                <button className={`px-6 py-2 text-white rounded-lg transition-colors theme-bg`}>
                                    确定
                                </button>
                            </Dialog.CloseTrigger>
                        </div>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </>
    )
}