"use client"

import BlogMyListItem from "./blog-my-list-item";
import {BlogItemType} from "../../../types/blog";
import {useEffect, useRef, useState} from "react";
import Pagination from "../../pagination/pagination";
import {PaginationOptions} from "../../../types/pagination";
import IconNoData from "../../icons/icon-no-data";
import NoData from "../../no-data/no-data";

export default function BlogMyListContent({ initList}: { initList: BlogItemType[]}) {

    const [blogList, setBlogList] = useState(initList)
    const [draft, setDraft] = useState(blogList.filter((item) => item.status === 2).length)
    const [published, setPublished] = useState(blogList.filter((item) => item.status === 1).length)
    const [currentStatus, setCurrentStatus] = useState(0)
    const [blogListTitleWidth, setBlogListTitleWidth] = useState(1200)
    const renderPagination:Partial<PaginationOptions> = {
        current: 1,
        pageSize: 10,
        pageCount: 5,
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 30, 40]
    }

    const blogContentContainer = useRef<HTMLDivElement | null>(null);
    /**
     * 统计按钮切换
     * @param type
     */
    const countChange  = (type: number) => {
        setCurrentStatus(type)
        getBlogList(type)
    }
    /**
     * 获取博客列表
     */
    const getBlogList = (type: number) => {
        setBlogList(initList)
    }
    /**
     * 翻页改变
     * @param paginationInfo
     */
    const paginationChange = (paginationInfo) => {
        // 翻页时，清空选中数据
        setBlogList([])
    }

    useEffect(() => {
        console.log("blogContentContainer width=", blogContentContainer.current?.clientWidth)
        setBlogListTitleWidth(blogContentContainer.current?.clientWidth || 1200)
    }, [blogList.length])

    return (
        <>
            <div className="blog-count-container flex items-center m-auto">
                <div className="blog-status-item flex items-center mr-4 cursor-pointer" onClick={() => countChange(0)}>
                    <span className={ `blog-status-item-text ${currentStatus === 0 ? "font-bold text-gray-900" : "text-gray-500"}`}>全部({published +  draft})</span>
                </div>
                <div className="blog-status-item flex items-center mr-4 cursor-pointer" onClick={() => countChange(1)}>
                    <span className={`blog-status-item-text ${currentStatus === 1 ? "font-bold text-gray-900" : "text-gray-500"}`}>已发布({published})</span>
                </div>
                <div className="blog-status-item flex items-center mr-4 cursor-pointer" onClick={() => countChange(2)}>
                    <span className={`blog-status-item-text ${currentStatus === 2 ? "font-bold text-gray-900" : "text-gray-500"}`}>草稿({draft})</span>
                </div>
            </div>
            <div className="blog-content-out-container relative m-auto">
                <div className="blog-list-title-container flex justify-between items-center border-b border-gray-100 px-4" style={{width: blogListTitleWidth + 'px'}}>
                    <span>文章</span>
                    <div className="blog-list-title-right flex justify-end items-center">
                        <span className="blog-list-title-right-item w-24 flex justify-center">评论</span>
                        <span className="blog-list-title-right-item w-40 flex justify-end">操作</span>
                    </div>
                </div>
                <div className="blog-content-container overflow-auto overscroll-contain m-auto px-4 py-6" ref={blogContentContainer}>

                    {
                        blogList.length ? blogList.map((item) => {
                            return <BlogMyListItem item={item} key={item.id}/>
                        }) : <NoData/>
                    }
                </div>
            </div>
            <div className="pagination-out-container flex justify-end">
                <Pagination  options={renderPagination} onChange={(paginationInfo:PaginationOptions) => paginationChange(paginationInfo)}/>
            </div>

        </>
    )
}