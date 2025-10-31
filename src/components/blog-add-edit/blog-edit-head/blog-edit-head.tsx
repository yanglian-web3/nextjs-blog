"use client"

import "./blog-edit-head.css"
import HeadUser from "../../head-user/head-user";
import IconClear from "../../icons/icon-clear";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/index";
import { updateTitle } from "../../../store/blog-edit-slice";
import {useEffect} from "react";
import {getUserInfo} from "../../../utils/user";
import {updateUserInfo} from "../../../store/user-slice";



function BlogEditHead() {
    const dispatch = useDispatch<AppDispatch>()


    const { title } = useSelector((state: RootState) => state.blogEdit)

    useEffect(() => {
        getUserInfo().then(res => {
            console.log("res=", res)
            dispatch(updateUserInfo(res))
        })
    },[])
    /**
     * 设置标题
     * @param title
     */
    const setTitle = (title: string) => {
        dispatch(updateTitle(title))
    }
  return <div className="blog-head-edit-out-container">
      <div className="blog-head-edit-container flex justify-between items-center py-5 px-10">
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
         <HeadUser mode="right"/>
      </div>
  </div>
}

export default BlogEditHead