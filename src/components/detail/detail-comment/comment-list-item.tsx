import {CommentContentItem} from "../../../types/comment";
import "./comment-list-item.css"
import IconMsg from "../../icons/icon-msg";
import CommentInputSend from "./comment-input-send";
import {useState} from "react";
import UserHeadImage from "../../head-user/user-head-image";

interface CommentListItemProps {
    info: CommentContentItem,
    isSub?: boolean,
    success: () => void
    parentId?: string
}

export default function CommentListItem({ info, success, parentId, isSub = false}: CommentListItemProps){
    const { id, avatar, content, username, postTime, loginUserDigg, parentUsername, userAccount } = info
    const [replay, setReplay] = useState(false);

    /**
     * 获取信息顶部
     */
    const getInfoTopLeft = () =>{
        if(isSub){
            return <>
                <span className={"user-name text-sm text-gray-400"}>{username}</span>
                {
                    !loginUserDigg && <span className={"text-sm theme-color ml-1 theme-bg-opacity5"}>作者</span>
                }
                <span className={"user-name text-sm text-gray-400 mx-2"}>回复</span>
                <span className={"user-name text-sm text-gray-400"}>{parentUsername} {postTime}</span>
            </>
        }
        return <span className={"user-name text-sm text-gray-400 whitespace-nowrap"}>{username} {postTime}</span>
    }
    /**
     * 子评论完成
     */
    const subCommentsSuccess = () => {
        console.log("子评论完成================")
        success && success()
        setReplay(false)
    }
    return <>
        <div className={`comment-list-item-container mb-5 ${isSub ? "ml-13" : ""}`} key={id}>
            <div className={"comment-list-item flex mb-5"}>
                <div className={`comment-user-head-container cursor-pointer mr-4 flex-shrink-0 `}>
                    <UserHeadImage name={username} src={avatar} size={ isSub ? "sm" : "md"}/>
                </div>
                <div className={"info-right-container w-full"}>
                    <div className={"info-top-container flex justify-between items-center mb-2 w-full"}>
                        <div className={"flex-1 w-0 whitespace-nowrap overflow-ellipsis overflow-hidden"}>
                            {getInfoTopLeft()}
                        </div>
                        <div className={"info-apply-container flex items-center cursor-pointer flex-shrink-0 ml-5"}
                             onClick={() => setReplay(!replay)}
                        >
                            <IconMsg color="#999999" width={16} height={16}/>
                            <span className={"text-sm text-gray-400 ml-1"}>{ replay ? "收起" : "回复"}</span>
                        </div>
                    </div>
                    <div>
                        <p className={"comment-content text-sm"}>{content}</p>
                    </div>
                </div>
            </div>
        </div>
        {
            replay && <div className={"ml-13 mb-5"}>
                <CommentInputSend parentUsername={username} parentUserAccount={userAccount} parentId={ parentId || id} success={subCommentsSuccess}/>
            </div>
        }
    </>
}