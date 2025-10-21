"use client"

import {UserInfo} from "../../../types/user";
import IconMsg from "../../icons/icon-msg";
import {BlogCountInfo} from "../../../types/blog";
import "./blog-detail-bottom.css"
import DetailComment from "../detail-comment/detail-comment";
import {useState} from "react";
import SlideDrawer from "../../slide-drawer/slide-drawer";

export default function BlogDetailBottom({userInfo, blogCountInfo}: {userInfo: UserInfo, blogCountInfo: BlogCountInfo}) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    /**
     * 打开评论
     */
    const openComment = () => {
        setDrawerOpen(true)
    }

    return <>
        <div className="blog-detail-bottom-container flex justify-center fixed bottom-0 left-0 w-screen index-10">
            <div className={"blog-detail-bottom-inner-container bg-white flex justify-between items-center px-10 py-4 border-t border-gray-100"}>
                <div className="blog-detail-bottom-left flex items-center">
                    <div className="user-head-container cursor-pointer">
                        <img className={"user-head-img"} src={userInfo.avatar ||  ""} alt=""/>
                    </div>
                    <strong className={"user-name text-xl ml-2"}>{userInfo.name}</strong>
                </div>
                <div className={"blog-detail-bottom-right flex justify-end items-center"}>
                    <div className={"blog-detail-item flex items-center cursor-pointer"} onClick={openComment}>
                        <IconMsg width={24} height={24} color={"#666666"}/>
                        <span className={"ml-2 text-gray-500"}>{ blogCountInfo.commentCount}</span>
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
                <span className={"ml-2 text-gray-500"}>{ blogCountInfo.commentCount}</span>
            </>
        } open={drawerOpen} onOpenChange={(open) => setDrawerOpen(open)}>
            <DetailComment userInfo={userInfo}/>
        </SlideDrawer>

    </>
}