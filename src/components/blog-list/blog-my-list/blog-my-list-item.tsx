
import { BlogItemType } from "../../../types/blog";
import Link from 'next/link'

export default function BlogMyListItem({ item }: { item: BlogItemType}){
    /**
     * 跳转到详情页
     */
    const goDetail = () => {
        console.log("item=", item)
    }
    return <div className="blog-list-item flex justify-between border-b border-gray-100 py-5">
        <Link href={`/detail/${item.id}`} target="_blank" rel="noopener noreferrer">
            <div className="item-left flex items-center cursor-pointer" onClick={goDetail}>

                <img src={item.cover} alt="cover" className="w-30 h-15 mr-4"/>
                <div className="item-info">
                    <h3 className="item-title text-lg font-bold mb-2">{item.title}</h3>
                    <p className="item-content text-gray-500">{item.createdAt}</p>
                </div>
            </div>
        </Link>
        <div className="blog-list-title-right flex justify-end items-center">
            <span className="blog-list-title-right-item w-24 flex justify-center">{ item.commentNum }</span>
            <div className="item-right flex justify-end items-center w-40">
                <Link href={`/add-edit?id=${item.id}`} target="_blank" rel="noopener noreferrer">
                    <span className="item-button text-blue py-2 cursor-pointer">编辑</span>
                </Link>
                <span className="item-button text-red-600 py-2 cursor-pointer ml-6">删除</span>
            </div>
        </div>

    </div>
}