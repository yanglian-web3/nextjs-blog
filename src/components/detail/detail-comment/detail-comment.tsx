
import "./detail-comment.css";
import CommentList from "./comment-list";
import CommentInputSend from "./comment-input-send";
import UserHeadImage from "../../head-user/user-head-image";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/index";



export default function DetailComment() {

    const { userInfo } = useSelector((state: RootState) => state.user)

    return <div className={"detail-comment-container p-2"}>
        <div className="comment-send-container flex mb-7">
            <UserHeadImage name={userInfo?.name} src={userInfo?.avatar} size={"sm"}/>
           <div className={"ml-4 flex-1 flex"}>
               <CommentInputSend/>
           </div>
        </div>
        <CommentList/>
    </div>
}