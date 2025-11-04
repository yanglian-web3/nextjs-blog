import {CommentContentItem} from "../../../types/comment";
import "./comment-list-item.css"
import IconMsg from "../../icons/icon-msg";
import CommentInputSend from "./comment-input-send";
import React, {useState} from "react";
import UserHeadImage from "../../head-user/user-head-image";
import { useSelector } from "react-redux";
import BlogAlert from "../../blog-alert/blog-alert";
import {blogFetch} from "../../../utils/blog-fetch";
import IconLoading from "../../icons/icon-loading";
import {RootState} from "../../../store/index";

interface CommentListItemProps {
    info: CommentContentItem,
    isSub?: boolean,
    success: (reset?:boolean) => void
    parentId?: string
}

export default function CommentListItem({ info, success, parentId, isSub = false}: CommentListItemProps){
    const { userInfo: {auth_user_id} } = useSelector((state: RootState) => state.user)
    const { id, avatar, content, username, postTime, loginUserDigg, parentUsername, userAccount, userId } = info
    const [replay, setReplay] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false)
    const [footerType, setFooterType] = useState<"confirm" | "toast">("confirm") // 弹窗类型，confirm或者toast
    const [confirmLoading, setConfirmLoading] = useState(false); // 确认删除加载中
    const [alertConfig, setAlertConfig] = useState({
        title: "",
        message: "",
        type: 'warning'
    })

    /**
     * 获取信息顶部
     */
    const getInfoTopLeft = () =>{
        if(isSub){
            return <>
                <span className={"user-name text-sm text-gray-400"}>{username}</span>
                {
                    !loginUserDigg && <span className={"text-sm theme-color ml-1 theme-bg-opacity5"}>作者</span>
                }
                <span className={"user-name text-sm text-gray-400 mx-2"}>回复</span>
                <span className={"user-name text-sm text-gray-400"}>{parentUsername} {postTime}</span>
            </>
        }
        return <span className={"user-name text-sm text-gray-400 whitespace-nowrap"}>{username} {postTime}</span>
    }
    /**
     * 子评论完成
     */
    const subCommentsSuccess = () => {
        console.log("子评论完成================")
        if(success){
            success()
        }
        setReplay(false)
    }

    /**
     * 显示错误
     * @param message
     */
    const showError = (message:string) => {
        setAlertConfig({
            title: "删除失败",
            message: message,
            type: 'error'
        })
        setFooterType("toast")
        setAlertOpen(true)
        setTimeout(() => {
            setAlertOpen(false)
        }, 2000)
    }

    /**
     * 确认删除
     */
    const confirmDelete = () => {
        setConfirmLoading(true)
        blogFetch(`/api/comment/delete/${id}`, {
            credentials: 'include',
            method: 'DELETE',
        }).then((result) => {
            const {code, message} = result
            if(code === 200){
                console.log("删除成功")
                success(true)
                setAlertOpen(false)
            } else {
                showError(message)
            }
        }).catch(error => {
            showError(error)
        })
            .finally(() => {
                setConfirmLoading(false)
            })
    }
    /**
     * 删除评论
     */
    const deleteComment = () => {
        console.log("删除")
        setAlertConfig({
            title: "确认删除？",
            message: "删除后无法恢复，谨慎操作！",
            type: 'warning'
        })
        setFooterType("confirm")
        setAlertOpen(true)
    }

    /**
     * 获取底部
     */
    const getFooter = () => {
        if(footerType === "confirm"){
            return <div className={"flex justify-end items-center"}>
                <button className={`w-20 h-10 text-white rounded-lg transition-colors bg-gray-400 cursor-pointer`} onClick={() => setAlertOpen(false)}>
                    取消
                </button>
                <button className={`w-20 h-10 px-0 text-white rounded-lg transition-colors theme-bg ml-4 flex justify-center items-center cursor-pointer`}
                        onClick={confirmDelete}
                        disabled={confirmLoading}
                >
                    {
                        confirmLoading ? <IconLoading color={"#fff"}/> : null
                    }
                    确定
                </button>
            </div>
        }
        return footerType !== "toast";
    }


    return <>
        <div className={`comment-list-item-container mb-5 ${isSub ? "ml-13" : ""}`} key={id}>
            <div className={"comment-list-item flex mb-5"}>
                <div className={`comment-user-head-container cursor-pointer mr-4 flex-shrink-0 `}>
                    <UserHeadImage name={username} src={avatar} size={ isSub ? "sm" : "md"}/>
                </div>
                <div className={"info-right-container w-full"}>
                    <div className={"info-top-container flex justify-between items-center w-full"}>
                        <div className={"flex-1 w-0 h-8 whitespace-nowrap overflow-ellipsis overflow-hidden"}>
                            {getInfoTopLeft()}
                        </div>
                        <div className={"info-apply-container info-drop-down-container flex items-center cursor-pointer relative flex-shrink-0 ml-5"}
                        >
                            <span className={"text-lg text-gray-400"}>···</span>
                            <div className={"absolute info-drop-menu-container right-0 bg-white rounded-md shadow-md z-10"}>
                                {
                                    auth_user_id === userId && <div className={"py-2 px-4 info-drop-menu-item"} onClick={deleteComment}>
                                        <span className={"text-sm text-gray-500 whitespace-nowrap"}>删除</span>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className={"info-apply-container flex items-center cursor-pointer flex-shrink-0 ml-4"}
                             onClick={() => setReplay(!replay)}
                        >
                            <IconMsg color="#999999" width={16} height={16}/>
                            <span className={"text-sm text-gray-400 ml-1"}>{ replay ? "收起" : "回复"}</span>
                        </div>
                    </div>
                    <div>
                        <p className={"comment-content text-sm"}>{content}</p>
                    </div>
                </div>
            </div>
        </div>
        {
            replay && <div className={"ml-13 mb-5"}>
                <CommentInputSend parentUsername={username} parentUserAccount={userAccount} parentId={ parentId || id} success={subCommentsSuccess}/>
            </div>
        }
        <BlogAlert  open={alertOpen} updateOpen={setAlertOpen} config={alertConfig}
                    footer={ getFooter()}
        />
    </>
}