import {CommentContentItem} from "../../../types/comment";

export default function CommentListItem({ info, sub, isSub = false}: { info: CommentContentItem, sub?: CommentContentItem[], isSub?: boolean},){
    const { commentId, avatar, content, userName, postTime, loginUserDigg } = info

    /**
     * 获取信息顶部
     */
    const getInfoTop = () =>{
        if(isSub){
            return <>
                <span className={"user-name text-sm text-gray-400"}>{userName}</span>
                {
                    !loginUserDigg && <span className={"text-sm theme-color ml-1 theme-bg-opacity5"}>作者</span>
                }
                <span className={"user-name text-sm text-gray-400 mx-2"}>回复</span>
                <span className={"user-name text-sm text-gray-400"}>{postTime}</span>
            </>
        }
        return <>
            <span className={"user-name text-sm text-gray-400"}>{userName}</span>
            <span className={"user-name text-sm text-gray-400 ml-2"}>{postTime}</span>
        </>
    }
    return <div className={"comment-list-item-container mb-5"} key={commentId}>
        <div className={"comment-list-item flex mb-5"}>
            <div className="user-head-container cursor-pointer mr-4 flex-shrink-0">
                <img className={"user-head-img"} src={avatar ||  ""} alt=""/>
            </div>
            <div className={"info-right-container"}>
                <div className={"info-top-container flex items-center mb-2"}>
                    {getInfoTop()}
                </div>
                <div>
                    <p className={"comment-content text-sm"}>{content}</p>
                </div>
            </div>
        </div>
        {
            sub && sub.length && sub.map((item, index) => {
                return <CommentListItem info={item} isSub={ true}/>
            })
        }
    </div>
}