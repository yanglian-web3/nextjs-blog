"use client"

import {UserInfo} from "../../../types/user";
import IconMsg from "../../icons/icon-msg";
import {BlogCountInfo} from "../../../types/blog";
import "./blog-detail-bottom.css"

export default function BlogDetailBottom({userInfo, blogCountInfo}: {userInfo: UserInfo, blogCountInfo: BlogCountInfo}) {
    return <div className="blog-detail-bottom-container flex justify-center fixed bottom-0 left-0 w-screen index-10">
        <div className={"blog-detail-bottom-inner-container bg-white flex justify-between items-center px-10 py-4 border-t border-gray-100"}>
            <div className="blog-detail-bottom-left flex items-center">
                <div className="user-head-container cursor-pointer">
                    <img className={"user-head-img"} src={userInfo.headImg ||  ""} alt=""/>
                </div>
                <strong className={"user-name text-xl ml-2"}>{userInfo.name}</strong>
            </div>
            <div className={"blog-detail-bottom-right flex justify-end items-center"}>
                <div className={"blog-detail flex items-center cursor-pointer"}>
                    <IconMsg width={24} height={24} color={"#666666"}/>
                    <span className={"ml-2 text-gray-500"}>{ blogCountInfo.commentCount}</span>
                </div>
            </div>
        </div>
    </div>
}