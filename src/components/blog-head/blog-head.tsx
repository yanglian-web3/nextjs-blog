"use client"

import "./blog-head.css"
import PropTypes from "prop-types"
import {UserInfo} from "../../types/user";


export default function BlogHead({userInfo}: {userInfo:UserInfo}) {


    /**
     * 退出登录
     */
    const logOut = () => {

    }
    /**
     * 登录
     */
    const login = () => {

    }

  return <div className={"blog-head-container row-between"}>
      <input placeholder="Search" className={"blog-head-input"}/>
      <div className={"user-info-container"}>
          {
              userInfo ? <div>
                  <div className={"user-head-container"}>
                      <img class={"user-head-img"} src={userInfo.headImg ||  ""} alt=""/>
                      <button class={"logout-btn"} onClick={logOut}>退出登录</button>
                  </div>
              </div> : <div>
                  <button class={"login-btn"} onClick={login}>登录</button>
              </div>
          }
      </div>
  </div>
}

BlogHead.prototype = {
    userInfo: PropTypes.object.isRequiredv
}