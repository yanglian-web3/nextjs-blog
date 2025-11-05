
import BlogDetailPreview from "../../../components/detail/blog-detail-preview/blog-detail-preview";
import IconClockFill from "../../../components/icons/icon-clock-fill";
import IconViewFill from "../../../components/icons/icon-view-fill";
import "./detail-page.css"
import BlogDetailBottom from "../../../components/detail/blog-detail-bottom/blog-detail-bottom";
import {getBlogDetail, getPopularBlogIds} from "../../../utils/blog";
import BlogListHead from "../../../components/blog-list/blog-list-head/blog-list-head";
import type { Metadata } from 'next'
import Script from 'next/script'
import {BlogDetailResult} from "../../../types/blog";

interface PageParams {params:Promise<{id:string}>}

export const revalidate = 60*60*1 // 1小时

export async function generateStaticParams() {
    // 预生成热门文章的静态页面
    // 这里可以从数据库获取热门文章ID
    const popularBlogs = await getPopularBlogIds() // 你需要实现这个函数
    return popularBlogs.map((blog) => ({
        id: blog.id,
    }))
}

// 生成动态元数据
export async function generateMetadata({ params }:PageParams): Promise<Metadata> {
    const resolvedParams = await params
    const blogDataResult = await getBlogDetail(resolvedParams.id)
    const { detail, author } = blogDataResult
    const { title = "", content = "", createdAt = "", summary = "", cover = "" } = detail || {}
    const { name = "" } = author || {}

    // 从内容中提取描述（前160字符）
    const description = summary || content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'

    return {
        title: `${title} - ${name}的博客`,
        description,
        keywords: `${title},${name},技术博客,编程`, // 根据内容动态生成
        authors: [{ name }],
        openGraph: {
            title,
            description,
            type: 'article',
            publishedTime: createdAt,
            authors: [name],
            images: [cover || '/default-og-image.jpg'], // 添加文章封面
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [cover || '/default-twitter-image.jpg'],
        },
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_APP_URL}/detail/${resolvedParams.id}`, // 规范URL
        },
    }
}

export default async function BlogDetail({params}:PageParams) {
    const resolvedParams = await params
    console.log("resolvedParams=",resolvedParams)
    const blogDataResult = await getBlogDetail(resolvedParams.id)
    const { detail, countInfo, author} = blogDataResult as BlogDetailResult
    if(!detail || !countInfo || !author){
        throw new Error("页面出错")
    }
    console.log("blog_Detail_result result=", {...detail, content: "太多了省略..."})
    const {title, content, createdAt, cover, updatedAt, summary} = detail

    // 结构化数据
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": summary || content.replace(/<[^>]*>/g, '').substring(0, 200),
        "image": cover ? [cover] : [],
        "datePublished": createdAt,
        "dateModified": updatedAt || createdAt,
        "author": {
            "@type": "Person",
            "name": author.name,
            "url": `${process.env.NEXT_PUBLIC_APP_URL}/${author.account}`
        },
        "publisher": {
            "@type": "Organization",
            "name": "你的博客名称",
            "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${process.env.NEXT_PUBLIC_APP_URL}/detail/${resolvedParams.id}`
        },
        "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/ReadAction",
            "userInteractionCount": countInfo?.viewCount || 0
        },
        "commentCount": countInfo?.commentCount || 0
    }
    
    return <div className="blog-detail-container bg-gray-200 bg-white">
        {/* 添加结构化数据 */}
        <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <main role="main">
            <article itemScope itemType="https://schema.org/BlogPosting" className="flex flex-col min-h-screen items-stretch">
                <BlogListHead showSearch={false}/>
                <div className="blog-detail-title mt-3 flex justify-center ">
                    <div className="bg-white blog-title-inner px-6 py-3 rounded-t-sm">
                        <h1 className="font-bold text-4xl">{title}</h1>
                        <div className=" bg-gray-100  px-3 py-2 mt-3 rounded-t-sm">
                            <div className="flex flex-wrap gap-4">
                                <div className="publish-date-container flex items-center text-gray-500 mr-10">
                                    <IconClockFill width={15} height={15} color={"#999999"}/>
                                    <span className="ml-1">于 {createdAt} 发布</span>
                                </div>
                                <div className="read-container flex items-center text-gray-500">
                                    <IconViewFill width={15} height={15} color={"#999999"}/>
                                    <span className="ml-1"> 阅读量 {countInfo?.viewCount || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="blog-detail-preview-and-bottom-container flex justify-center">
                    <BlogDetailPreview value={content}/>
                    {/*为了对齐，放在preview组件里面，放在外面可能会因浏览器其他插件影响，导致底部和中间不对齐*/}
                    <BlogDetailBottom commentCount={countInfo?.commentCount || "0"} author={author}/>
                </div>
            </article>
        </main>

    </div>
}