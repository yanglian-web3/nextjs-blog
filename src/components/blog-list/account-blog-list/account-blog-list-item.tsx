
import { BlogItemType } from "../../../types/blog";
import Link from 'next/link'

export default function AccountBlogListItem({ item }: { item: BlogItemType}){
    /**
     * 跳转到详情页
     */
    const goDetail = () => {
        console.log("item=", item)
    }
    return <div className="blog-list-item  border-b border-gray-100 py-5">
        <Link href={`/detail/${item.id}`} target="_blank" rel="noopener noreferrer">
            <div className="item-left flex items-center cursor-pointer" onClick={goDetail}>
                {item.cover ? <img src={item.cover} alt="cover" className="w-30 h-15 mr-4"/> : null}
                <div className="item-info w-0 flex-1">
                    <h3 className="item-title text-lg font-bold mb-2">{item.title}</h3>
                    <div className="item-content w-full text-sm text-gray-500 whitespace-nowrap overflow-hidden overflow-ellipsis mb-2">{item.summary}</div>
                    <div className={"flex items-center"}>
                        <p className="item-content text-gray-500">{item.createdAt}</p>
                        <div className={"count-container flex items-center"}>
                            <span className="text-sm ml-4 text-gray-400">{item.viewCount} 阅读</span>
                            <span className="text-sm ml-4 text-gray-400">{item.commentCount} 评论</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    </div>
}