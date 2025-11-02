import {CommentContentItem, CommentItem} from "../../../types/comment";
import React, {useEffect, useState} from "react";
import CommentListItem from "./comment-list-item";
import {useParams} from "next/navigation";
import {blogFetch} from "../../../utils/blog-fetch";
import {PaginationOptions} from "../../../types/pagination";
import CustomPageLoading from "../../global-loading/custom-page-loading";
import IconLoading from "../../icons/icon-loading";

export default function CommentList({refreshNum}: {refreshNum: number}) {

    const {id } = useParams()
    const [list, setList ] = useState<CommentItem[]>([])
    const [current, setCurrent] = useState(1)
    const [total, setTotal] = useState(1)
    const [listLoading, setListLoading] = useState(false) // 页面加载
    const [listMoreLoading, setListMoreLoading] = useState(false) // 列表更多加载
    const [subListMoreLoading, setSubListMoreLoading] = useState(false) // 子列表更多加载


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
    const getList = (page:number, more=false) => {
        more ? setListMoreLoading(true) : setListLoading(true)
        getCommentList(page)
            .then((data) => {
                setList([...list,...data.list])
                setTotal(data.pagination.total)
            }).finally(() => {
                more ? setListMoreLoading(false) : setListLoading(false)
        })
    }
    /**
     * 重置评论列表数据
     */
    const getResetCommentList = (page:number) => {
        setListLoading(true)
        getCommentList(page).then((data) => {
            setList([...data.list])
            setTotal(data.pagination.total)
        }).finally(() => {
            setListLoading(false)
        })
    }
    /**
     * 获取评论列表数据
     */
    const getCommentList = (page:number) => {
        return new Promise((resolve,reject) => {
            blogFetch(`/api/comment/list?articleId=${id}&current=${page}&pageSize=10`)
                .then((result) => {
                    const { code, data } = result
                    if (code === 200) {
                        resolve(data)
                    } else {
                        reject(data)
                    }
                    console.log("data=", data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    /**
     * 获取子评论列表数据
     * @param parentId
     * @param originSubList
     * @param page
     */
    const getMoreSubList = (parentId:string, originSubList: CommentContentItem[], page:number) => {
        const newPage = originSubList.length < 10 ? 1 : page + 1
        setSubListMoreLoading(true)
        blogFetch(`/api/comment/sub-list?articleId=${id}&parentId=${parentId}&current=${newPage}`)
            .then((result) => {
                const { code, data } = result
                if (code === 200) {
                    console.log("data=", data)
                    const currentListItemIndex = list.findIndex((item) => item.info.id === parentId)
                    console.log("currentListItemIndex=", currentListItemIndex)
                    if(currentListItemIndex > -1){
                        // 使用函数+展开运算符方式来更新深层次数据
                        setList(prevList => {
                            return prevList.map((item, index) => {
                                if (index === currentListItemIndex) {
                                    // 创建新的对象，保持不可变性
                                    return {
                                        ...item,
                                        sub: {
                                            list: newPage === 1 ? data.list : [...item.sub.list, ...data.list],
                                            pagination: data.pagination
                                        }
                                    }
                                }
                                return item
                            })
                        })
                    }

                }
                console.log("data=", data)
            }).finally(() => {
                setSubListMoreLoading(false)
        })
    }
    /**
     * 加载更多数据
     */
    const getMoreList = () => {
        const newCurrent = current + 1
        setCurrent(newCurrent)
        getList(newCurrent, true)
    }
    /**
     * 渲染子评论列表
     * @param subList
     * @param pagination
     * @param parentId
     */
    const renderSubListDom = (subList: CommentContentItem[], pagination: PaginationOptions, parentId:string) => {
        if(subList && subList.length){
            return <>
                {
                    subList.map((item, index) => {
                        return <CommentListItem info={item}
                                                key={item.id}
                                                isSub={ true}
                                                parentId={parentId}
                                                success={reset => reset ? getResetCommentList(1) : getList(1)}
                        />
                    })
                }
                {
                    pagination.total > subList.length ? <div className={"mb-8 ml-24 flex items-center"}>
                       <span className={"text-gray-500 text-sm"}>共 {pagination.total} 条回复{}</span>
                        <button className="text-gray-900 cursor-pointer text-sm flex justify-center ml-3 items-center"
                                onClick={() => getMoreSubList(parentId, subList,pagination.current)}>
                            加载更多
                            { subListMoreLoading ? <IconLoading width={20} height={20}/> : null}
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
                            <CommentListItem info={info} key={info.id} success={reset => reset ? getResetCommentList(1) : getList(1)}/>
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
                        <button className="text-gray-900 flex items-center cursor-pointer text-sm"
                              onClick={getMoreList}>查看{ listMoreLoading ? <IconLoading width={20} height={20}/> : null}</button>
                    </div> : null
                }
            </>
        }
        return null
    }

    return <div className={"relative w-full h-full flex-1"}>
        <CustomPageLoading loading={ listLoading}>
            {
                renderListDom()
            }
        </CustomPageLoading>
    </div>
}