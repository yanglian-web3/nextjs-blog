import {useState} from "react";
import {useLoading} from "../../../context/loading-context";
import BlogAlert, { AlertConfig, AlertType } from "../../blog-alert/blog-alert";



export default function CommentInputSend(){
    const [value, setValue] = useState("");
    const { showLoading, hideLoading } = useLoading()
    const [alertOpen, setAlertOpen] = useState(false)
    const [showDialogFooter, setShowDialogFooter] = useState(true)
    const [alertConfig, setAlertConfig] = useState<AlertConfig>({
        title: "",
        message: "",
        type: 'warning' as AlertType
    })


    /**
     * 发送评论
     */
    const sendComment = () => {
        console.log("value=", value)
        if (!validateForm()) return
        showLoading()
        fetch('/api/comment/send', {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify({ content: value })
        }).then(res => res.json())
            .then(data => {
                if(data.code === 200){
                    // 保存草稿逻辑
                    setShowDialogFooter(false)
                    showAlert("保存成功", "info", "保存成功")
                    setTimeout(() => {
                        hideAlert()
                        // 刷新列表
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
        if (!value.trim()) {
            showAlert("内容不能为空", "warning", "缺少内容")
            return false
        }
        return true
    }

    return <>
        <div className={"comment-input-send-container flex-1 relative"}>
            <div className={"comment-input-container pb-7"}>
                    <textarea className={"comment-input bg-gray-100 w-full py-2 px-4"}
                              placeholder={"请输入评论"}
                              value={value}
                              maxLength={1000}
                              rows={4}
                              onInput={(e) => setValue(e.currentTarget.value)}/>

            </div>
            <div className={"comment-send-btn-info-container flex justify-between items-center absolute left-0 bottom-0 w-full p-2 bg-gray-100 px-4"}>
                <div className={"comment-send-info-container flex items-center"}>
                    <span className={"text-gray-500"}>{value.length}/1000</span>
                </div>
                <button className={"theme-bg text-white py-1 px-4 rounded-full cursor-pointer text-sm"}
                        onClick={sendComment}
                >发送</button>
            </div>
        </div>
        <BlogAlert open={alertOpen} updateOpen={setAlertOpen} alertConfig={alertConfig} showDialogFooter={showDialogFooter}/>
    </>
}