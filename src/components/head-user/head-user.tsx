"use client"
import IconUser from "../icons/icon-user";
import IconEmail from "../icons/icon-email";
import IconPhone from "../icons/icon-phone";
import IconLogout from "../icons/icon-logout";
import IconTrangle from "../icons/icon-trangle";
import "./head-user.css"
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/index";
import {updateUserInfo} from "../../store/user-slice";
import Link from "next/link";
import IconList from "../icons/icon-list";
import UserHeadImage from "./user-head-image";




export default function HeadUser({ mode = "center" }: { mode?: "right" | "center"}) {

    const dispatch = useDispatch<AppDispatch>()
    const { userInfo } = useSelector((state: RootState) => state.user)
    /**
     * 退出登录
     */
    const logOut = () => {
        // 清除用户信息和token信息
        dispatch(updateUserInfo(null))
        // 清除浏览器cookie

        // 调用退出登录api
        fetch("/api/auth/logout")
    }




    return <div className={`user-info-container relative z-10  user-info-container-${mode}`}>
        <Link href={`/${userInfo?.account}`} target={"_blank"} rel="noopener noreferrer">
            <div className="user-head-container cursor-pointer" >
                <UserHeadImage name={userInfo?.name} src={userInfo?.avatar} size={"lg"}/>
            </div>
        </Link>
        {userInfo ? <div className={`user-drap-down-container absolute rounded-md`}>
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
                    <p className="pl-1 text-xl">{userInfo.phone || "--"}</p>
                </li>
            </ul>
            <Link href={`/${userInfo.account}`} target={"_blank"} rel="noopener noreferrer" className={"block border-t-1 border-gray-300"}>
                <div className="px-3 py-2 cursor-pointer flex items-center">
                    <IconList width={20} height={20}/>
                    <p className="pl-1 text-xl">内容管理</p>
                </div>
            </Link>
            <div className="user-logout-container border-t-1 border-gray-300 px-3 py-2 cursor-pointer flex items-center" onClick={logOut}>
                <IconLogout width={20} height={20}/>
                <p className="pl-1 text-xl">退出登录</p>
            </div>
            <span  className="icon-trangle">
                              <IconTrangle width={30} height={30} color="#ffffff"/>
                          </span>
        </div> : null}
    </div>
}