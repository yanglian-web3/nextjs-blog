"use client"

import "./blog-detail-head.css"
import PropTypes from "prop-types"
import IconSearch from "../../icons/icon-search";
import HeadUser from "../../head-user/head-user";
import IconPlus from "../../icons/icon-plus";
import Link from 'next/link'
import {useEffect} from "react";
import {getUserInfo} from "../../../utils/user";
import {updateUserInfo} from "../../../store/user-slice";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/index";


function BlogDetailHead() {

    const dispatch = useDispatch<AppDispatch>()
    const { userInfo } = useSelector((state: RootState) => state.user)

    // console.log("userInfo=", userInfo)
    useEffect(() => {
        getUserInfo().then(res => {
            console.log("res=", res)
            dispatch(updateUserInfo(res))
        })
    },[])

  return <div className="blog-head-out-container bg-white">
      <div className="blog-head-container flex justify-between items-center p-2">
          <div className="blog-search-container relative flex">
              <input placeholder="Search" className="blog-search-input blog-head-input border border-solid border-gray-200 pl-4 pr-10 py-2 w-100"/>
              <span className="search-icon cursor-pointer absolute right-2">
                 <IconSearch/>
              </span>
          </div>
          <div className="flex justify-end items-center">
              <HeadUser/>
              <Link href={`/add-edit`} target="_blank" rel="noopener noreferrer">
                  <div className="create-container ml-10 flex items-center py-1 px-6 rounded-full cursor-pointer">
                      <IconPlus width={20} height={20} color="#ffffff"/>
                      <span className="text-xl text-white ml-1">创作</span>
                  </div>
              </Link>
          </div>
      </div>
  </div>
}

BlogDetailHead.prototype = {
    userInfo: PropTypes.object.isRequired
}

export default BlogDetailHead
