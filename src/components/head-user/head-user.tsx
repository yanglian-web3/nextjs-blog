"use client"
import IconUser from "../icons/icon-user";
import IconEmail from "../icons/icon-email";
import IconPhone from "../icons/icon-phone";
import IconLogout from "../icons/icon-logout";
import IconTrangle from "../icons/icon-trangle";
import {UserInfo} from "../../types/user";
import "./head-user.css"


const nameColorClassNames = [
    'text-blue-600',    // 蓝色
    'text-green-600',   // 绿色
    'text-purple-600',  // 紫色
    'text-pink-600',    // 粉色
    'text-indigo-600',  // 靛蓝色
    'text-teal-600',    // 青蓝色
    'text-orange-600',  // 橙色
    'text-rose-600',    // 玫瑰红
    'text-cyan-600',    // 青色
    'text-amber-600',  // 琥珀色
]

// 根据名字生成稳定的颜色索引
const getStableColorIndex = (name: string): number => {
    if (!name) return 0

    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    return Math.abs(hash) % nameColorClassNames.length
}

export default function HeadUser({ userInfo, mode = "center" }: {userInfo:UserInfo, mode?: "right" | "center"}) {


  /**
   * 退出登录
   */
  const logOut = () => {

  }
    /**
     * 渲染头部
     */
  const getUserHead = () => {
      const getNameHead = (name:string) => {
          const colorIndex = getStableColorIndex(name)
          const colorClass = nameColorClassNames[colorIndex]
          return <strong className={`text-2xl bg-gray-100 rounded-full w-full h-full flex items-center justify-center ${colorClass}`}>
              {name}
          </strong>
      }
      if(!userInfo){
          return getNameHead("?")
      }
      if(userInfo.avatar){
          return <img src={userInfo.avatar} className="user-head-img"/>
      }
      if(userInfo.name){
          return getNameHead(userInfo.name[0].toUpperCase())
      }
      return getNameHead("?")
  }



  return <div className={`user-info-container relative z-10  user-info-container-${mode}`}>
      <div className="user-head-container cursor-pointer">
        {
            getUserHead()
        }
      </div>
      <div className={`user-drap-down-container absolute rounded-md`}>
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
}