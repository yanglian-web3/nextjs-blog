"use client"

import AccountBlogListItem from "./account-blog-list-item";
import {BlogItemType} from "../../../types/blog";
import {useEffect, useRef, useState} from "react";
import Pagination from "../../pagination/pagination";
import {PaginationOptions} from "../../../types/pagination";
import NoData from "../../no-data/no-data";
import {getBlogListByAccount} from "../../../utils/blog";
import {useParams} from "next/navigation";
import {useLoading} from "../../../context/loading-context";

export default function AccountBlogListContent({ initList, initPage}: { initList: BlogItemType[], initPage: Partial<PaginationOptions>}) {
    const params = useParams()
    const { showLoading, hideLoading } = useLoading()
    const [blogList, setBlogList] = useState(initList)
    const [_width,setBlogListTitleWidth] = useState(1200)
    const [renderPagination, setRenderPagination] = useState<Partial<PaginationOptions>>({
        current: 1,
        pageSize: 10,
        pageCount: 5,
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 30, 40],
        ...initPage
    })

    const blogContentContainer = useRef<HTMLDivElement | null>(null);

    /**
     * 获取博客列表
     */
    const getBlogList = (paginationInfo: Partial<PaginationOptions>) => {
        showLoading()
        getBlogListByAccount({
            account: params.account as string,
            pagination:{current: paginationInfo.current, pageSize: paginationInfo.pageSize},
            searchParams:{status: 1}
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
        getBlogList(paginationInfo)
    }

    useEffect(() => {
        console.log("blogContentContainer width=", blogContentContainer.current?.clientWidth)
        setBlogListTitleWidth(blogContentContainer.current?.clientWidth || 1200)
    }, [blogList.length])
    return (
        <>
            <div className="w-max-1200 relative m-auto">
                <div className="blog-content-container overflow-auto overscroll-contain m-auto px-4 py-6" ref={blogContentContainer}>

                    {
                        blogList.length ? blogList.map((item) => {
                            return <AccountBlogListItem item={item} key={item.id}/>
                        }) : <NoData/>
                    }
                </div>
            </div>
            <div className="pagination-out-container w-max-1200 flex justify-end">
                <Pagination  options={renderPagination} onChange={(paginationInfo:PaginationOptions) => paginationChange(paginationInfo)}/>
            </div>

        </>
    )
}