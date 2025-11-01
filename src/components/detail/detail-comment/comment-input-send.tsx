import {useState} from "react";
import {useLoading} from "../../../context/loading-context";
import BlogAlert, { AlertConfig, AlertType } from "../../blog-alert/blog-alert";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/index";
import { useParams } from "next/navigation";
import {blogFetch} from "../../../utils/blog-fetch";
import {humpToUnderline} from "../../../utils/util";
import {CommentContentItem} from "../../../types/comment";

interface CommentInputSendProps {
    parentUsername?:string,
    parentUserAccount?:string,
    parentId?:string,
    success: () => void
}

export default function CommentInputSend({parentUsername, parentUserAccount, parentId, success}: CommentInputSendProps){
    const { userInfo } = useSelector((state: RootState) => state.user)
    const { id } = useParams()

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
        const { avatar, name, account } = userInfo
        const sendData = {
            articleId: id,
            parentId,
            avatar,
            username: name,
            userAccount:account,
            content: value,
            parentUsername,
            parentUserAccount,
        }
        console.log("Object.keys(data)=", Object.keys(sendData))
        blogFetch('/api/comment/send', {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(Object.keys(sendData).reduce((result,current) => {
                // console.log("current=", current)
                console.log("humpToUnderline[current]=", humpToUnderline(current))
                result[humpToUnderline(current)] = sendData[current]
                return result
            }, {} as CommentContentItem))
        })
            .then(data => {
                if(data.code === 200){
                    // 保存草稿逻辑
                    setShowDialogFooter(false)
                    showAlert("保存成功", "info", "保存成功")
                    setValue( "")
                    setTimeout(() => {
                        hideAlert()
                        // 刷新列表
                        success && success()
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
                    <textarea className={"comment-input bg-gray-100 w-full py-2 px-4 text-gray-500"}
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