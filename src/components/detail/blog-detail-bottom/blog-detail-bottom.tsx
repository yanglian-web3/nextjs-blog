"use client"

import IconMsg from "../../icons/icon-msg";
import "./blog-detail-bottom.css"
import {useState} from "react";
import SlideDrawer from "../../slide-drawer/slide-drawer";
import UserHeadImage from "../../head-user/user-head-image";
import Login from "../../auth/login/login";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/index";
import CommentInputSend from "../detail-comment/comment-input-send";
import CommentList from "../detail-comment/comment-list";

interface BlogDetailBottomProps {
    commentCount?: string
    author?: {
        name?: string
        avatar?: string
        account?: string
    },
    success?: () => void
}

export default function BlogDetailBottom({commentCount = "0", author = {}}: BlogDetailBottomProps) {

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false)
    const { userInfo } = useSelector((state: RootState) => state.user)
    const [refreshNum, setRefreshNum]  = useState(0)

    /**
     * 评论成功
     */
    const success = () => {
        setRefreshNum(refreshNum + 1)
    }
    /**
     * 打开评论
     */
    const openComment = () => {
        if(!userInfo || !userInfo.id){
            setLoginOpen(true)
            return
        }
        setRefreshNum(refreshNum + 1)
        setDrawerOpen(true)
    }
    return <>
        <div className="blog-detail-bottom-container flex justify-center fixed bottom-0 left-0 w-screen index-10">
            <div className={"blog-detail-bottom-inner-container bg-white flex justify-between items-center px-10 py-4 border-t border-gray-100"}>
                <div className="blog-detail-bottom-left flex items-center">
                    <UserHeadImage name={author?.name} src={author?.avatar}/>
                    <strong className={"user-name text-xl ml-2"}>{author?.name}</strong>
                </div>
                <div className={"blog-detail-bottom-right flex justify-end items-center"}>
                    <div className={"blog-detail-item flex items-center cursor-pointer"} onClick={openComment}>
                        <IconMsg width={24} height={24} color={"#666666"}/>
                        <span className={"ml-2 text-gray-500"}>{ commentCount}</span>
                    </div>
                    <div className={"blog-detail-item flex items-center"} onClick={openComment}>
                        <button className="theme-bg text-white py-1 px-4 rounded-full cursor-pointer text-sm">写评论</button>
                    </div>
                </div>
            </div>
        </div>
        <SlideDrawer title={
            <>
                <span>评论</span>
                <span className={"ml-2 text-gray-500"}>{ commentCount}</span>
            </>
        } open={drawerOpen} onOpenChange={(open) => setDrawerOpen(open)}>
            <div className={"detail-comment-container p-2"}>
                <div className="comment-send-container flex mb-7">
                    <UserHeadImage name={userInfo?.name} src={userInfo?.avatar} size={"sm"}/>
                    <div className={"ml-4 flex-1 flex"}>
                        <CommentInputSend success={success}/>
                    </div>
                </div>
                <CommentList refreshNum={refreshNum}/>
            </div>
        </SlideDrawer>
        <Login open={loginOpen} updateOpen={setLoginOpen}/>
    </>
}