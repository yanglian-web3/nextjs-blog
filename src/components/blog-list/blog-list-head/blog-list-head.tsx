"use client"

import "./blog-list-head.css"
import PropTypes from "prop-types"
import {UserInfo} from "../../../types/user";
import IconSearch from "../../icons/icon-search";
import IconEmail from "../../icons/icon-email";
import IconUser from "../../icons/icon-user";
import IconPhone from "../../icons/icon-phone";
import IconLogout from "../../icons/icon-logout";
import IconTrangle from "../../icons/icon-trangle";
import IconPlus from "../../icons/icon-plus";
import Link from 'next/link'
import HeadUser from "../../head-user/head-user";


function BlogListHead({ userInfo }: {userInfo:UserInfo}) {
    // console.log("userInfo=", userInfo)

  return <div className="blog-head-out-container">
      <div className="blog-head-container flex justify-between items-center p-5">
          <div className="blog-search-container relative flex">
              <input placeholder="Search" className="blog-search-input blog-head-input border border-solid border-gray-200 pl-4 pr-10 py-2 w-100"/>
              <span className="search-icon cursor-pointer absolute right-2">
              <IconSearch/>
          </span>
          </div>
          <HeadUser userInfo={userInfo}/>
      </div>
  </div>
}

BlogListHead.prototype = {
    userInfo: PropTypes.object.isRequired
}

export default BlogListHead