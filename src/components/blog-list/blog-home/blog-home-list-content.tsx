"use client"

import BlogHomeListItem from "./blog-home-list-item";
import {BlogHomeItemType} from "../../../types/blog";
import {useEffect, useRef, useState} from "react";
import IconRefresh from "../../icons/icon-refresh";
import PageLoading from "../../page-loading/page-loading";

export default function BlogHomeListContent({ initList}: { initList: BlogHomeItemType[]}) {

    const [blogList, setBlogList] = useState(initList)
    const [loading, setLoading] = useState(false)
    const [blogListTitleWidth, setBlogListTitleWidth] = useState(1200)

    const blogContentContainer = useRef<HTMLDivElement | null>(null);

    /**
     * 获取博客列表
     */
    const getBlogList = () => {
        setLoading(true)
        setBlogList(initList)
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    useEffect(() => {
        getBlogList()
    },[])
    useEffect(() => {
        console.log("blogContentContainer width=", blogContentContainer.current?.clientWidth)
        setBlogListTitleWidth(blogContentContainer.current?.clientWidth || 1200)
    }, [blogList.length])

    return (
        <>
            <div className="blog-home-title-container w-max-1200 flex justify-between items-center m-auto px-4">
                <h2 className={"text-xl font-bold"}>博客精选</h2>
                <button className="flex justify-center items-center cursor-pointer" onClick={getBlogList}>
                    <IconRefresh width={16} height={16} color={"#999999"}/>
                    <span className={"ml-1"}>刷新</span>
                </button>
            </div>
            <PageLoading loading={loading}>
                <div className="w-max-1200 relative m-auto">
                    <div className="blog-home-content-container overflow-auto overscroll-contain m-auto px-4 py-6" ref={blogContentContainer}>

                        {
                            blogList.map((item) => {
                                return <BlogHomeListItem item={item} key={item.id}/>
                            })
                        }
                    </div>
                </div>
            </PageLoading>

        </>
    )
}