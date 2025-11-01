import {CommentItem} from "../../../types/comment";
import {useEffect, useState} from "react";
import CommentListItem from "./comment-list-item";
import {useParams} from "next/navigation";
import {blogFetch} from "../../../utils/blog-fetch";

export default function CommentList({refreshNum}: {refreshNum: number}) {

    const {id } = useParams()
    const [list, setList ] = useState<CommentItem[]>([])
    const [current, setCurrent] = useState(1)
    const [total, setTotal] = useState(1)


    useEffect(() => {
        setCurrent(1)
        if(refreshNum){
            getList(1)
        } else {
            setList([])
            setTotal(0)
        }
    }, [refreshNum])

    /**
     * 获取评论列表数据
     */
    const getList = (page:number) => {
        blogFetch(`/api/comment/list?articleId=${id}&current=${page}&pageSize=10`)
            .then((result) => {
                const { code, data } = result
                if (code === 200) {
                    console.log("data=", data)
                    setList([...list,...data.list])
                    setTotal(data.pagination.total)
                }
                console.log("data=", data)
            })
    }
    /**
     * 加载更多数据
     */
    const getMoreList = () => {
        const newCurrent = current + 1
        setCurrent(newCurrent)
        getList(newCurrent)
    }

    const renderListDom = () => {
        if(list && list.length){
            return <>
                {
                    list.map((item, index) => {
                        const {info, sub} = item
                        return <>
                            <CommentListItem info={info} key={info.id} success={getList}/>
                            {
                                sub && sub.list && sub.list.length ? sub.list.map((item, index) => {
                                    return <CommentListItem info={item}
                                                            key={item.id}
                                                            isSub={ true}
                                                            parentId={info.id}
                                                            success={getList}
                                    />
                                }) : null
                            }
                            {

                            }
                        </>
                    })
                }
                {
                    list.length < total ? <div className={"flex justify-center items-center mt-10"}>
                        <span>{total - list.length}</span>
                        <span className={"text-gray-500 ml-2 mr-3"}>条评论被折叠</span>
                        <button className="text-gray-900 rounded-full cursor-pointer text-sm"
                              onClick={getMoreList}>查看</button>
                    </div> : null
                }
            </>
        }
        return null
    }

    return <div className={"comment-list-container"}>
        {
            renderListDom()
        }
    </div>
}