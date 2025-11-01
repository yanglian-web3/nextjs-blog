import BlogListHead from "../../components/blog-list/blog-list-head/blog-list-head";
import "./my-blog-list.css"
import BlogMyListContent from "../../components/blog-list/blog-my-list/blog-my-list-content";


export default async function MyBlogList() {
    return (
        <div className={"page-container"}>
            <BlogListHead showSearch={false}/>
            <BlogMyListContent/>
        </div>
    );
}
