"use client"

import "./blog-head.css"
import PropTypes from "prop-types"
import {UserInfo} from "../../types/user";


function BlogHead({ userInfo }: {userInfo:UserInfo}) {
    console.log("userInfo=", userInfo)

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


  return <div className={"blog-head-container row-between"}>
      <input placeholder="Search" className={"blog-head-input"}/>
      <div className={"head-right-container"}>
          {
              userInfo ? <div className={"user-info-container"}>
                  <div className={"user-head-container"}>
                      <img className={"user-head-img"} src={userInfo.headImg ||  ""} alt=""/>
                  </div>
                  <div className={"user-drap-down-container"}>
                      <ul className={"user-info-list"}>
                          <li className={"user-info-item"}>{userInfo.name}</li>
                          <li className={"user-info-item"}>{userInfo.email}</li>
                          <li className={"user-info-item"}>{userInfo.phone}</li>
                      </ul>
                      <div className={"user-logout-container"} onClick={logOut}>
                          退出登录
                      </div>
                  </div>

              </div> : <div>
                  <button className={"login-btn"} onClick={login}>登录</button>
              </div>
          }
      </div>
  </div>
}

BlogHead.prototype = {
    userInfo: PropTypes.object.isRequired
}

export default BlogHead