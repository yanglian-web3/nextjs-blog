import BlogListHead from "../../components/blog-list/blog-list-head/blog-list-head";
import "./my-blog-list.css"
import {AccountBlogResult, BlogItemType} from "../../types/blog";
import BlogMyListContent from "../../components/blog-list/blog-my-list/blog-my-list-content";
import {getBlogListByAccount} from "../../utils/blog";
import {cookies} from "next/headers";


export default async function MyBlogList() {
    // 服务端路由调用api时，拿不到cookie，在页面组件中获取 cookies（这里能拿到）
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')?.value
    const account = cookieStore.get('user_account')?.value
    console.log("在页面获取 sessionToken=", sessionToken)
    console.log("在页面获取 account=", account)
    const myBlogResult:AccountBlogResult = await getBlogListByAccount({
        account: account!,
        pagination: {current: 1, pageSize: 10},
        sessionToken: sessionToken!
    })
    const blogList:BlogItemType[] = myBlogResult.list || []
    console.log("bloglist.length=", blogList.length)
    const published = myBlogResult.countInfo?.publishedCount || 0
    const draft = blogList.length - published
    return (
        <div className={"page-container"}>
            <BlogListHead/>
            <BlogMyListContent initList={blogList} initPage={myBlogResult.pagination} draft={ draft} published={published}/>
        </div>
    );
}
