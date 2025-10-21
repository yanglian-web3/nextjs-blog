
import "./detail-comment.css";
import CommentList from "./comment-list";
import {UserInfo} from "../../../types/user";
import {useState} from "react";
import CommentInputSend from "./comment-input-send";



export default function DetailComment({userInfo} : {userInfo: UserInfo}) {


    return <div className={"detail-comment-container p-2"}>
        <div className="comment-send-container flex mb-7">
            <div className="user-head-container cursor-pointer">
                <img className={"user-head-img"} src={userInfo.avatar ||  ""} alt=""/>
            </div>
           <div className={"ml-4 flex-1 flex"}>
               <CommentInputSend/>
           </div>
        </div>
        <CommentList/>
    </div>
}