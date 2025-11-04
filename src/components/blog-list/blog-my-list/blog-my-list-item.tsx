
import { BlogItemType } from "../../../types/blog";
import Link from 'next/link'
import {useLoading} from "../../../context/loading-context";
import {blogFetch} from "../../../utils/blog-fetch";
import BlogAlert, {AlertConfig, AlertType} from "../../blog-alert/blog-alert";
import {useState} from "react";
import Image from "next/image"

interface BlogMyListItemProps {
    item: BlogItemType,
    publishSuccess: () => void
}
export default function BlogMyListItem({ item, publishSuccess }: BlogMyListItemProps){
    const { showLoading, hideLoading } = useLoading()
    const { alertOpen, setAlertOpen } = useState(false)

    const [alertConfig, setAlertConfig] = useState<AlertConfig>({
        title: "",
        message: "",
        type: 'warning'
    })
    /**
     * 发布文章
     */
    const publishNow = () => {
        console.log("发布")
        showLoading()
        blogFetch(`/api/blog/publish/${item.id}`, {
            credentials: 'include',
        })
            .then(data => {
                if(data.code === 200){
                    console.log('发布成功')
                   setTimeout(()=>{
                       publishSuccess()
                   },100)
                } else {
                    showAlert("发布失败，请重试", "error", "发布失败")
                }
            })
        .finally(() => {
            hideLoading()
        })
    }
    /**
     * 显示警告弹窗
     * @param message
     * @param type
     * @param title
     */
    const showAlert = (message: string, type: AlertType = 'warning', title: string = '提示') => {
        setAlertConfig({ title, message, type })
        setAlertOpen(true)
    }


    return <>
        <div className="blog-list-item flex justify-between border-b border-gray-100 py-5">
            <Link href={`/detail/${item.id}`} target="_blank" rel="noopener noreferrer">
                <div className="item-left flex items-center cursor-pointer">
                    {item.cover ? <Image src={item.cover} alt="cover" className="w-30 h-15 mr-4"/> : null}
                    <div className="item-info">
                        <h3 className="item-title text-lg font-bold mb-2">{item.title}</h3>
                        <p className="item-content text-gray-500">{item.createdAt}</p>
                    </div>
                </div>
            </Link>
            <div className="blog-list-title-right flex justify-end items-center">
                <span className="blog-list-title-right-item w-24 flex justify-center">{ item.status === 1 ? item.commentCount : "--" }</span>
                <div className="item-right flex justify-end items-center w-40">
                    {
                        item.status === 0 ? <span className="item-button theme-color py-2 cursor-pointer mr-6" onClick={publishNow}>发布</span> : null
                    }
                    <Link href={`/add-edit?id=${item.id}`} target="_blank" rel="noopener noreferrer">
                        <span className="item-button text-blue py-2 cursor-pointer">编辑</span>
                    </Link>
                    <span className="item-button text-red-600 py-2 cursor-pointer ml-6">删除</span>
                </div>
            </div>

        </div>
        {/* 警告弹窗 */}
        <BlogAlert  open={alertOpen} updateOpen={setAlertOpen} config={alertConfig} footer={false}/>
    </>
}