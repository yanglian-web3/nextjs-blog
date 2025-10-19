// app/add-edit/page.tsx
import { Metadata } from 'next'
import BlogEditHead from "../../components/blog-add-edit/blog-edit-head/blog-edit-head";
import {UserInfo} from "../../types/user";
import {getUserInfo} from "../../utils/user";
import BlogEditPublishButtons from "../../components/blog-add-edit/blog-edit-publish-buttons";
import "./blog-add-edit.css"
import BlogEditor from "../../components/blog-add-edit/blog-editor";

export const metadata: Metadata = {
    title: '写文章 - 我的博客',
    description: '创建或编辑博客文章',
}

export default async function AddEditPage() {
    // const userInfo = await getUserInfo()
    const userInfo:UserInfo = {
        name: "张三",
        headImg: "https://picsum.photos/200/300",
        email: "zhangsan@163.com",
        phone: "13888888888"
    }


    return (
        <div className="blog-add-edit-container">
            <BlogEditHead userInfo={userInfo}/>
            {/*中间部分*/}
            <div className="blog-edit-middle-container">
                <BlogEditor />
            </div>
            {/* 操作按钮 */}
            <BlogEditPublishButtons/>
        </div>
    )
}