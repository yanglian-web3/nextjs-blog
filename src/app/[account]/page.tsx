import BlogListHead from "../../components/blog-list/blog-list-head/blog-list-head";
import "./account-home-page.css"
import {AccountBlogResult, BlogItemType} from "../../types/blog";
import BlogMyListContent from "../../components/blog-list/blog-my-list/blog-my-list-content";
import {getBlogListByAccount} from "../../utils/blog";
import {cookies} from "next/headers";

interface PageProps {
    params: {
        account: string
    }
}
export default async function MyBlogPage({ params}: PageProps) {
    // 等待 params 和 searchParams
    const [resolvedParams] = await Promise.all([params])
    // 服务端路由调用api时，拿不到cookie，在页面组件中获取 cookies（这里能拿到）
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')?.value
    console.log("在页面获取 sessionToken=", sessionToken)
    const myBlogResult:AccountBlogResult = await getBlogListByAccount({
        account:resolvedParams.account,
        pagination: {current: 1, pageSize: 10},
        sessionToken
    })
    const blogList:BlogItemType[] = myBlogResult.list
    console.log("bloglist.length=", blogList.length)
    return (
        <div className={"page-container"}>
            <BlogListHead/>
            <BlogMyListContent initList={blogList} initPage={myBlogResult.pagination}/>
        </div>
    );
}
