
import {BlogHomeItemType} from "../../../types/blog";
import Link from 'next/link'
import IconViewFill from "../../icons/icon-view-fill";
import UserHeadImage from "../../head-user/user-head-image";
import Image from "next/image";

export default function BlogListItem({ item }: { item: BlogHomeItemType}){
    /**
     * 跳转到详情页
     */
    const goDetail = () => {
        console.log("item=", item)
    }
    return <li className="blog-list-item border-b border-gray-100 py-5">
        <Link href={`/${item.account}`} className={"user-info-container flex items-center cursor-pointer mb-2"} target="_blank" rel="noopener noreferrer">
            <UserHeadImage src={item.avatar} name={item.name} size="sm"/>
            <p className={"ml-2 text-xs text-gray-500"}>{item.name}</p>
        </Link>
        <Link href={`/detail/${item.id}`} target="_blank" rel="noopener noreferrer">
            <div className="item-left flex items-center cursor-pointer" onClick={goDetail}>
                <div className="item-info flex-1 w-0">
                    <h3 className="item-title text-lg font-bold mb-2">{item.title}</h3>
                    <p className="item-content w-full text-sm text-gray-500 whitespace-nowrap overflow-hidden overflow-ellipsis mb-2">{item.summary}</p>
                    <div className={"count-container flex items-center"}>
                        <span className="icon-eye mr-2 flex items-center">
                            <IconViewFill width={16} height={16} color={"#aaa"}/>
                            <span className="text-sm ml-1 text-gray-400">阅读 {item.viewCount}</span>
                        </span>
                    </div>
                </div>
                {
                    item.cover && <div className={"blog-item-cover-container w-40 h-20 ml-4 flex-shrink-0"}>
                        <Image src={item.cover} alt="cover" className="w-full h-full"/>
                    </div>
                }
            </div>
        </Link>
    </li>
}