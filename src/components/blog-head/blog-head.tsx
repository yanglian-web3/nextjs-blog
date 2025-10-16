"use client"

import "./blog-head.css"
import PropTypes from "prop-types"
import {UserInfo} from "../../types/user";
import IconSearch from "../icons/icon-search";
import IconEmail from "../icons/icon-email";
import IconUser from "../icons/icon-user";
import IconPhone from "../icons/icon-phone";
import IconLogout from "../icons/icon-logout";
import IconTrangle from "../icons/icon-trangle";
import IconPlus from "../icons/icon-plus";


function BlogHead({ userInfo }: {userInfo:UserInfo}) {
    // console.log("userInfo=", userInfo)

    /**
     * 退出登录
     */
    const logOut = () => {

    }
    /**
     * 登录
     */
    const login = () => {
        console.log("userInfo=", userInfo)
    }


  return <div className="blog-head-out-container">
      <div className="blog-head-container flex justify-between items-center p-5">
          <div className="blog-search-container relative flex">
              <input placeholder="Search" className="blog-search-input blog-head-input border border-solid border-gray-200 pl-4 pr-10 py-2 w-100"/>
              <span className="search-icon cursor-pointer absolute right-2">
              <IconSearch/>
          </span>
          </div>
          <div className={"head-right-container"}>
              {
                  userInfo ? <div className="flex justify-end items-center">
                      <div className="user-info-container relative">
                          <div className="user-head-container cursor-pointer">
                              <img className={"user-head-img"} src={userInfo.headImg ||  ""} alt=""/>
                          </div>
                          <div className="user-drap-down-container absolute rounded-md">
                              <ul className={"user-info-list py-2 px-4"}>
                                  <li className="user-info-item flex items-center">
                                      <IconUser width={20} height={20}/>
                                      <p className="pl-1 text-xl">{userInfo.name}</p>
                                  </li>
                                  <li className="user-info-item flex items-center">
                                      <IconEmail width={20} height={20}/>
                                      <p className="pl-1 text-xl">{userInfo.email}</p>
                                  </li>
                                  <li className="user-info-item flex items-center">
                                      <IconPhone width={20} height={20}/>
                                      <p className="pl-1 text-xl">{userInfo.phone}</p>
                                  </li>
                              </ul>
                              <div className="user-logout-container cursor-pointer flex items-center" onClick={logOut}>
                                  <IconLogout width={20} height={20}/>
                                  <p className="pl-1 text-xl">退出登录</p>
                              </div>
                              <span  className="icon-trangle">
                              <IconTrangle width={30} height={30} color="#ffffff"/>
                          </span>
                          </div>

                      </div>
                      <div className="create-container ml-10 flex items-center py-2 px-6 rounded-full cursor-pointer">
                          <IconPlus width={20} height={20} color="#ffffff"/>
                          <span className="text-xl text-white ml-1">创作</span>
                      </div>
                  </div>: <div>
                      <button className={"login-btn"} onClick={login}>登录</button>
                  </div>
              }
          </div>
      </div>
  </div>
}

BlogHead.prototype = {
    userInfo: PropTypes.object.isRequired
}

export default BlogHead