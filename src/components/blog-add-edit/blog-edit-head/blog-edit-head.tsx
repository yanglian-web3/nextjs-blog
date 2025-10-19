"use client"

import "./blog-edit-head.css"
import PropTypes from "prop-types"
import {UserInfo} from "../../../types/user";
import {useState} from "react";
import HeadUser from "../../head-user/head-user";
import IconClear from "../../icons/icon-clear";



function BlogEditHead({ userInfo }: {userInfo:UserInfo}) {
    // console.log("userInfo=", userInfo)
    const [title, setTitle] = useState('')


  return <div className="blog-head-edit-out-container">
      <div className="blog-head-edit-container flex justify-between items-center p-5">
          <div className="blog-search-container flex relative flex-1 pr-20">
              <input placeholder="请输入文章标题"
                     value={title}
                     className="blog-head-edit-input border border-solid border-gray-200 pl-4 py-2 text-lg"
                     onChange={(e) => setTitle(e.target.value)}/>
              {
                  title.length ? <span className="clear-icon cursor-pointer absolute" onClick={() => setTitle('')}>
              <IconClear width={20} height={20} color={"#666666"}/>
          </span> : null
              }
              <div className="title-count-container flex justify-center items-center absolute">
                  <p className="text-gray-500 text-sm">{title.length}/100</p>
              </div>
          </div>
         <HeadUser userInfo={userInfo}/>
      </div>
  </div>
}

BlogEditHead.prototype = {
    userInfo: PropTypes.object.isRequired
}

export default BlogEditHead