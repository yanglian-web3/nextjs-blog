import BlogListHead from "../../components/blog-list/blog-list-head/blog-list-head";
import "./account-home-page.css"
import {BlogItemType} from "../../types/blog";
import BlogMyListContent from "../../components/blog-list/blog-my-list/blog-my-list-content";


export default async function MyBlogPage() {

    const blogList:BlogItemType[] = [
    ]

    return (
        <div className={"page-container"}>
            <BlogListHead/>
            <BlogMyListContent initList={blogList}/>
        </div>
    );
}
