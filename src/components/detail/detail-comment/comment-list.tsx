import {CommentContentItem, CommentItem} from "../../../types/comment";
import {useEffect, useState} from "react";
import CommentListItem from "./comment-list-item";
import {useParams} from "next/navigation";
import {blogFetch} from "../../../utils/blog-fetch";
import {PaginationOptions} from "../../../types/pagination";

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
     * 获取子评论列表数据
     * @param parentId
     * @param page
     */
    const getMoreSubList = (parentId:string, page:number) => {
        blogFetch(`/api/comment/sub-list?articleId=${id}&parentId=${parentId}&current=${page}`)
            .then((result) => {
                const { code, data } = result
                if (code === 200) {
                    console.log("data=", data)
                    // setList([...list,...data.list])
                    // setTotal(data.pagination.total)
                    const originList = list
                    const currentListItemIndex = originList.findIndex((item) => item.info.id === parentId)
                    if(currentListItemIndex > -1){
                        originList[currentListItemIndex].sub.list.push(data.list)
                        originList[currentListItemIndex].sub.pagination = data.pagination
                        setList(originList)
                    }

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
    /**
     * 渲染子评论列表
     * @param list
     * @param pagination
     * @param parentId
     */
    const renderSubListDom = (list: CommentContentItem[], pagination: PaginationOptions, parentId:string) => {
        if(list && list.length){
            return <>
                {
                    list.map((item, index) => {
                        return <CommentListItem info={item}
                                                key={item.id}
                                                isSub={ true}
                                                parentId={parentId}
                                                success={getList}
                        />
                    })
                }
                {
                    pagination.total > list.length ? <div className={"mb-8 ml-24 flex align-center"}>
                       <span className={"text-gray-500 text-sm"}>共 {pagination.total} 条回复{}</span>
                        <button className="text-gray-900 cursor-pointer text-sm flex justify-center ml-3"
                                onClick={() => getMoreSubList(parentId, pagination.current + 1)}>
                            加载更多
                        </button>
                    </div> : null
                }
            </>
        }
        return null
    }
    /**
     * 渲染评论列表
     */
    const renderListDom = () => {
        if(list && list.length){
            return <>
                {
                    list.map((item, index) => {
                        const {info, sub} = item
                        const { list, pagination} =  sub
                        return <>
                            <CommentListItem info={info} key={info.id} success={getList}/>
                            {
                                sub && renderSubListDom(list, pagination, info.id)
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