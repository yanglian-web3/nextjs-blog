import {CommentItem} from "../../../types/comment";
import {useEffect, useState} from "react";
import { getCommentList } from "../../../api/blog";
import CommentListItem from "./comment-list-item";

export default function CommentList() {

    const [list, setList ] = useState<CommentItem[]>([])

    useEffect(() => {
        getCommentList().then((res) => {
            console.log("res=", res)
            setList(res.list as CommentItem[])
        })
    }, [])

    return <div className={"comment-list-container"}>
        {
            list && list.map((item, index) => {
                const {info, sub} = item
                return <CommentListItem info={info} sub={sub}/>
            })
        }
    </div>
}