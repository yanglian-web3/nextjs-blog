"use client"

import BlogMyListItem from "./blog-my-list-item";
import {BlogItemType} from "../../../types/blog";
import {useEffect, useRef, useState} from "react";
import Pagination from "../../pagination/pagination";
import {PaginationOptions} from "../../../types/pagination";
import NoData from "../../no-data/no-data";
import {getBlogListByAccount} from "../../../utils/blog";
import {useLoading} from "../../../context/loading-context";
import {getCookie} from "../../../utils/util";

interface BlogMyListContentProps {
    initList: BlogItemType[],
    initPage: Partial<PaginationOptions>,
    draft: number,
    published: number
}

const defaultPage = {
    current: 1,
    pageSize: 10,
    pageCount: 5,
    total: 0,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 30, 40]
}
export default function BlogMyListContent({ initList, initPage, draft, published}: BlogMyListContentProps) {
    const { showLoading, hideLoading } = useLoading()
    const [blogList, setBlogList] = useState(initList || [])
    const [currentStatus, setCurrentStatus] = useState(-1)
    const [blogListTitleWidth, setBlogListTitleWidth] = useState(1200)
    const [renderPagination, setRenderPagination] = useState<Partial<PaginationOptions>>({
       ...defaultPage,
        ...initPage
    })

    const blogContentContainer = useRef<HTMLDivElement | null>(null);

    /**
     * 统计按钮切换
     * @param type
     */
    const countChange  = (type: number) => {
        setCurrentStatus(type)
        setRenderPagination({
            ...defaultPage
        })
        console.log("after set rendder pagination renderPagination=", renderPagination)
        console.log("after set rendder pagination renderPagination=", {...renderPagination})
        console.log("after set rendder pagination defaultPage=", {...defaultPage})
        getBlogList(type, { ...defaultPage })
    }
    /**
     * 获取博客列表
     */
    const getBlogList = (type: number, paginationInfo: Partial<PaginationOptions>) => {
        showLoading()
        const account = getCookie("user_account") || ""
        getBlogListByAccount({
            account,
            pagination:{current: paginationInfo.current, pageSize: paginationInfo.pageSize},
            searchParams:{status: type === -1 ? undefined : type}
        }).then((myBlogResult) => {
            setRenderPagination(myBlogResult.pagination)
            setBlogList(myBlogResult.list)
        }).finally(() => {
            hideLoading()
        })

    }
    /**
     * 翻页改变
     * @param paginationInfo
     */
    const paginationChange = (paginationInfo) => {
        // 翻页时，清空选中数据
        console.log("paginationChange paginationInfo=",paginationInfo)
        setRenderPagination(paginationInfo)
        getBlogList(currentStatus, paginationInfo)
    }

    useEffect(() => {
        console.log("blogContentContainer width=", blogContentContainer.current?.clientWidth)
        setBlogListTitleWidth(blogContentContainer.current?.clientWidth || 1200)
    }, [blogList.length])

    // console.log("blogList=", blogList)
    return (
        <>
            <div className="blog-count-container flex items-center m-auto">
                <div className="blog-status-item flex items-center mr-4 cursor-pointer" onClick={() => countChange(-1)}>
                    <span className={ `blog-status-item-text ${currentStatus === -1 ? "font-bold text-gray-900" : "text-gray-500"}`}>全部({published +  draft})</span>
                </div>
                <div className="blog-status-item flex items-center mr-4 cursor-pointer" onClick={() => countChange(0)}>
                    <span className={`blog-status-item-text ${currentStatus === 0 ? "font-bold text-gray-900" : "text-gray-500"}`}>已发布({published})</span>
                </div>
                <div className="blog-status-item flex items-center mr-4 cursor-pointer" onClick={() => countChange(1)}>
                    <span className={`blog-status-item-text ${currentStatus === 1 ? "font-bold text-gray-900" : "text-gray-500"}`}>草稿({draft})</span>
                </div>
            </div>
            <div className="w-max-1200 relative m-auto">
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