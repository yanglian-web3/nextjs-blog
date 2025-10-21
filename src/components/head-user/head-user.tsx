import IconUser from "../icons/icon-user";
import IconEmail from "../icons/icon-email";
import IconPhone from "../icons/icon-phone";
import IconLogout from "../icons/icon-logout";
import IconTrangle from "../icons/icon-trangle";
import {UserInfo} from "../../types/user";
import "./head-user.css"

export default function HeadUser({ userInfo, mode = "center" }: {userInfo?:UserInfo, mode?: "right" | "center"}) {
  /**
   * 退出登录
   */
  const logOut = () => {

  }

  return <div className={`user-info-container relative z-10  user-info-container-${mode}`}>
      <div className="user-head-container cursor-pointer">
        <img className={"user-head-img"} src={userInfo.avatar ||  ""} alt=""/>
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