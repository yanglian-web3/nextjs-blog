import {CommentItem} from "../../../types/comment";
import {useEffect, useState} from "react";
import CommentListItem from "./comment-list-item";
import {useParams} from "next/navigation";
import {blogFetch} from "../../../utils/blog-fetch";

export default function CommentList({refreshNum}: {refreshNum: number}) {

    const {id } = useParams()
    const [list, setList ] = useState<CommentItem[]>([])
    const [current, setCurrent] = useState(1)


    useEffect(() => {
        getList()
    }, [refreshNum])

    /**
     * 获取评论列表数据
     */
    const getList = () => {
        blogFetch(`/api/comment/list?articleId=${id}&current=${current}&pageSize=100`)
            .then((result) => {
                const { code, data, message } = result
                if (code === 200) {
                    console.log("data=", data)
                    setList(data.list)
                } else {
                    console.log("message=", message)
                }
                console.log("data=", data)
            })
    }

    return <div className={"comment-list-container"}>
        {
            list && list.map((item, index) => {
                const {info, sub} = item
                return <>
                    <CommentListItem info={info} key={info.id} success={getList}/>
                    {
                        sub && sub.length ? sub.map((item, index) => {
                            return <CommentListItem info={item}
                                                    key={item.id}
                                                    isSub={ true}
                                                    parentId={info.id}
                                                    success={getList}
                            />
                        }) : null
                    }
                </>
            })
        }
    </div>
}