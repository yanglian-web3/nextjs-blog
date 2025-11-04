import BlogListHead from "../../components/blog-list/blog-list-head/blog-list-head";
import "./account-home-page.css"
import {AccountBlogResult, BlogItemType} from "../../types/blog";
import AccountBlogListContent from "../../components/blog-list/account-blog-list/account-blog-list-content";
import {getBlogListByAccount} from "../../utils/blog";
import {cookies} from "next/headers";

interface PageProps {
    params: Promise<{
        account: string
    }>
}

export const revalidate = 60*60*24 // 24小时ISR

export default async function AccountBlogPage({ params}: PageProps) {
    // 等待 params 和 searchParams
    const resolvedParams = await params
    // 服务端路由调用api时，拿不到cookie，在页面组件中获取 cookies（这里能拿到）
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')?.value
    console.log("在页面获取 sessionToken=", sessionToken)
    const accountBlogResult:AccountBlogResult = await getBlogListByAccount({
        account:resolvedParams.account,
        pagination: {current: 1, pageSize: 10},
        sessionToken,
        searchParams:{status: 1}
    })
    const blogList:BlogItemType[] = accountBlogResult.list
    console.log("bloglist.length=", blogList.length)
    return (
        <div className={"page-container"}>
            <BlogListHead/>
            <AccountBlogListContent initList={blogList} initPage={accountBlogResult.pagination}/>
        </div>
    );
}
