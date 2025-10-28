"use client"

import BlogHomeListItem from "./blog-home-list-item";
import {BlogHomeItemType} from "../../../types/blog";
import {useEffect, useRef, useState} from "react";
import IconRefresh from "../../icons/icon-refresh";
import {useLoading} from "../../../context/loading-context";
import {getBlogListRandom} from "../../../utils/blog";
import NoData from "../../no-data/no-data";

export default function BlogHomeListContent({ initList}: { initList: BlogHomeItemType[]}) {

    const [blogList, setBlogList] = useState(initList)
    const { showLoading, hideLoading } = useLoading()
    const blogContentContainer = useRef<HTMLDivElement | null>(null);

    /**
     * 获取博客列表
     */
    const getBlogList = () => {
        showLoading()
        getBlogListRandom().then(data => {
            setBlogList(data)
        }).finally(() => {
            hideLoading()
        })
    }
    useEffect(() => {
        setBlogList(initList)
    },[])

    return (
        <>
            <div className="blog-home-title-container w-max-1200 flex justify-between items-center m-auto px-4">
                <h2 className={"text-xl font-bold"}>博客精选</h2>
                <button className="flex justify-center items-center cursor-pointer" onClick={getBlogList}>
                    <IconRefresh width={16} height={16} color={"#999999"}/>
                    <span className={"ml-1"}>换一换</span>
                </button>
            </div>
            <div className="w-max-1200 relative m-auto">
                <div className="blog-home-content-container overflow-auto overscroll-contain m-auto px-4 py-6" ref={blogContentContainer}>

                    {
                        blogList.length ? blogList.map((item) => {
                            return <BlogHomeListItem item={item} key={item.id}/>
                        }) : <NoData/>
                    }
                </div>
            </div>
        </>
    )
}