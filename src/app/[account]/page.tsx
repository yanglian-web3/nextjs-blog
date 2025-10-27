import BlogListHead from "../../components/blog-list/blog-list-head/blog-list-head";
import "./account-home-page.css"
import {BlogItemType} from "../../types/blog";
import BlogMyListContent from "../../components/blog-list/blog-my-list/blog-my-list-content";
import {UserInfo} from "../../types/user";
// import {getUserInfo} from "../utils/user";


export default async function MyBlogPage() {

    const blogList:BlogItemType[] = [
        // {
        //     id: "1",
        //     title: "博客标题",
        //     content: "博客内容",
        //     createdAt: "2023-05-01",
        //     updatedAt: "2023-05-01",
        //     commentNum: 5,
        //     cover: "https://picsum.photos/200/300",
        //     status: 0
        // },
        // {
        //     id: "2",
        //     title: "博客标题",
        //     content: "博客内容",
        //     createdAt: "2023-05-01",
        //     updatedAt: "2023-05-01",
        //     commentNum: 5,
        //     cover: "https://picsum.photos/200/300",
        //     status: 1
        // },
        // {
        //     id: "3",
        //     title: "博客标题",
        //     content: "博客内容",
        //     createdAt: "2023-05-01",
        //     updatedAt: "2023-05-01",
        //     commentNum: 5,
        //     cover: "https://picsum.photos/200/300",
        //     status:1
        // },
        // {
        //     id: "4",
        //     title: "博客标题4",
        //     content: "博客内容",
        //     createdAt: "2023-05-01",
        //     updatedAt: "2023-05-01",
        //     commentNum: 5,
        //     cover: "https://picsum.photos/200/300",
        //     status: 0
        // },
        // {
        //     id: "5",
        //     title: "博客标题5",
        //     content: "博客内容",
        //     createdAt: "2023-05-01",
        //     updatedAt: "2023-05-01",
        //     commentNum: 5,
        //     cover: "https://picsum.photos/200/300",
        //     status: 1
        // },
        // {
        //     id: "6",
        //     title: "博客标题6",
        //     content: "博客内容",
        //     createdAt: "2023-05-01",
        //     updatedAt: "2023-05-01",
        //     commentNum: 5,
        //     cover: "https://picsum.photos/200/300",
        //     status: 1
        // },
        // {
        //     id: "7",
        //     title: "博客标题7",
        //     content: "博客内容",
        //     createdAt: "2023-05-01",
        //     updatedAt: "2023-05-01",
        //     commentNum: 5,
        //     cover: "https://picsum.photos/200/300",
        //     status: 1
        // },
    ]

    // const userInfo = await getUserInfo()

    const userInfo:UserInfo | null = null

    return (
        <div className={"page-container"}>
            <BlogListHead/>
            <BlogMyListContent initList={blogList}/>
        </div>
    );
}
