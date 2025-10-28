import BlogListHead from "../../components/blog-list/blog-list-head/blog-list-head";
import "./account-home-page.css"
import {AccountBlogResult, BlogItemType} from "../../types/blog";
import BlogMyListContent from "../../components/blog-list/blog-my-list/blog-my-list-content";
import {getBlogListByAccount} from "../../utils/blog";

interface PageProps {
    params: {
        account: string
    }
}
export default async function MyBlogPage({ params}: PageProps) {
    // 等待 params 和 searchParams
    const [resolvedParams] = await Promise.all([params])
    const myBlogResult:AccountBlogResult = await getBlogListByAccount(resolvedParams.account, {current: 1, pageSize: 10})
    const blogList:BlogItemType[] = myBlogResult.list
    console.log("bloglist.length=", blogList.length)
    return (
        <div className={"page-container"}>
            <BlogListHead/>
            <BlogMyListContent initList={blogList}/>
        </div>
    );
}
