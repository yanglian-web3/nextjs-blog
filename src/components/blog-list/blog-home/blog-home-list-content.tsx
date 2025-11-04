"use client"

import BlogHomeListItem from "./blog-home-list-item";
import {BlogHomeItemType} from "../../../types/blog";
import {useEffect, useRef, useState} from "react";
import IconRefresh from "../../icons/icon-refresh";
import {useLoading} from "../../../context/loading-context";
import {getBlogListRandom} from "../../../utils/blog";
import NoData from "../../no-data/no-data";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/index";

// 在 BlogHomeListContent 组件中添加
import Head from 'next/head'

export default function BlogHomeListContent({ initList}: { initList: BlogHomeItemType[]}) {


    const { searchValue, searchRefreshNum } = useSelector((state: RootState) => state.blogSearch)
    const [blogList, setBlogList] = useState(initList)
    const { showLoading, hideLoading } = useLoading()
    const blogContentContainer = useRef<HTMLDivElement | null>(null);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "博客精选文章",
        "description": "精选的技术博客文章列表",
        "numberOfItems": blogList.length,
        "itemListElement": blogList.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "BlogPosting",
                "headline": item.title,
                "description": item.summary,
                "author": item.name,
                "url": `${process.env.NEXT_PUBLIC_SITE_URL}/detail/${item.id}`,
                "image": item.cover
            }
        }))
    }

    useEffect(() => {
        // 监听搜索标题值变化，重新请求数据
        if(searchRefreshNum){
            getBlogList()
        }
    }, [searchRefreshNum])
    /**
     * 获取博客列表
     */
    const getBlogList = () => {
        showLoading()
        getBlogListRandom(searchValue).then(data => {
            setBlogList(data)
        }).finally(() => {
            hideLoading()
        })
    }
    useEffect(() => {
        setBlogList(initList)
    },[initList])

    return <>
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <title>博客精选文章列表</title>
        </Head>
        <section aria-label="博客精选文章列表"> {/* 添加语义化section */}
            <div className="blog-home-title-container w-max-1200 flex justify-between items-center m-auto px-4">
                <h1 className={"text-xl font-bold"}>博客精选</h1>
                <button className="flex justify-center items-center cursor-pointer" onClick={getBlogList}>
                    <IconRefresh width={16} height={16} color={"#999999"}/>
                    <span className={"ml-1"}>换一换</span>
                </button>
            </div>
            <div className="w-max-1200 relative m-auto">
                <div className="blog-home-content-container overflow-auto overscroll-contain m-auto px-4 py-6" ref={blogContentContainer}>

                    {
                        blogList.length ? <ol>
                            {
                                blogList.map((item) => {
                                    return <BlogHomeListItem item={item} key={item.id}/>
                                })
                            }
                        </ol> : <NoData/>
                    }
                </div>
            </div>
        </section>
    </>
}