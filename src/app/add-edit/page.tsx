// app/add-edit/page.tsx
import BlogEditor from '../../components/blog-add-edit/blog-editor'
import { Metadata } from 'next'
import BlogEditHead from "../../components/blog-add-edit/blog-edit-head/blog-edit-head";
import {UserInfo} from "../../types/user";
import {getUserInfo} from "../../utils/user";
import BlogEditPublishButtons from "../../components/blog-add-edit/blog-edit-publish-buttons";
import BlogView from "../../components/blog-add-edit/blog-view";
import BlogEditorTools from "../../components/blog-add-edit/blog-editor-tools";
import "./blog-add-edit.css"

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
            <div className="blog-editor-view-container py-8">
                {/* 工具栏 */}
                <BlogEditorTools/>
                <div className="flex">
                    <BlogEditor />
                    <BlogView />
                </div>
            </div>
            {/* 操作按钮 */}
            <BlogEditPublishButtons/>
        </div>
    )
}