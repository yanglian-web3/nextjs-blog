import BlogListHead from "../components/blog-list/blog-list-head/blog-list-head";
import "../styles/index.css"
import {BlogItemType} from "../types/blog";
import BlogListContent from "../components/blog-list/blog-list-content";
import {UserInfo} from "../types/user";
import {getUserInfo} from "../utils/user";


export default async function Home() {

    const blogList:BlogItemType[] = [
        {
            id: "1",
            title: "博客标题",
            content: "博客内容",
            createdAt: "2023-05-01",
            updatedAt: "2023-05-01",
            evaluation: 5,
            cover: "https://picsum.photos/200/300",
            status: 0
        },
        {
            id: "2",
            title: "博客标题",
            content: "博客内容",
            createdAt: "2023-05-01",
            updatedAt: "2023-05-01",
            evaluation: 5,
            cover: "https://picsum.photos/200/300",
            status: 1
        },
        {
            id: "3",
            title: "博客标题",
            content: "博客内容",
            createdAt: "2023-05-01",
            updatedAt: "2023-05-01",
            evaluation: 5,
            cover: "https://picsum.photos/200/300",
            status:1
        },
        {
            id: "4",
            title: "博客标题4",
            content: "博客内容",
            createdAt: "2023-05-01",
            updatedAt: "2023-05-01",
            evaluation: 5,
            cover: "https://picsum.photos/200/300",
            status: 0
        },
        {
            id: "5",
            title: "博客标题5",
            content: "博客内容",
            createdAt: "2023-05-01",
            updatedAt: "2023-05-01",
            evaluation: 5,
            cover: "https://picsum.photos/200/300",
            status: 1
        },
        {
            id: "6",
            title: "博客标题6",
            content: "博客内容",
            createdAt: "2023-05-01",
            updatedAt: "2023-05-01",
            evaluation: 5,
            cover: "https://picsum.photos/200/300",
            status: 1
        },
        {
            id: "7",
            title: "博客标题7",
            content: "博客内容",
            createdAt: "2023-05-01",
            updatedAt: "2023-05-01",
            evaluation: 5,
            cover: "https://picsum.photos/200/300",
            status: 1
        },
    ]

    // const userInfo = await getUserInfo()

    const userInfo:UserInfo = {
        name: "张三",
        headImg: "https://picsum.photos/200/300",
        email: "zhangsan@163.com",
        phone: "13888888888"
    }

  return (
    <div className={"page-container"}>
        <BlogListHead userInfo={userInfo}/>
        <BlogListContent initList={blogList}/>
    </div>
  );
}
