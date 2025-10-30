"use client"

import "./blog-list-head.css"
import PropTypes from "prop-types"
import IconSearch from "../../icons/icon-search";
import HeadUser from "../../head-user/head-user";
import IconPlus from "../../icons/icon-plus";
import Link from 'next/link'
import Login from "../../auth/login/login";
import {useEffect, useState} from "react";
import Registry from "../../auth/registry/registry";
import ForgetPass from "../../forget-pass/forget-pass";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/index";
import {getUserInfo} from "../../../utils/user";
import { updateUserInfo } from "../../../store/user-slice";


function BlogListHead() {
    const dispatch = useDispatch<AppDispatch>()
    const { userInfo } = useSelector((state: RootState) => state.user)

    const [loginOpen, setLoginOpen] = useState(false)
    const [registryOpen, setRegistryOpen] = useState(false)
    const [forgetPassOpen, setForgetPassOpen] = useState(false)

    useEffect(() => {
        getUserInfo().then(res => {
            console.log("res=", res)
            dispatch(updateUserInfo(res))
        })
    },[])

    /**
     * 打开登录弹窗
     */
    const openLogin = () => {
        setLoginOpen(true)
    }
    /**
     * 关闭登录弹窗
     */
    const onLoginClose = () => {
        console.log("关闭登录弹窗")
        setLoginOpen(false)
    }
    /**
     * 打开注册弹窗
     */
    const openRegistry = () => {
        onLoginClose()
        setRegistryOpen(true)
    }
    /**
     * 关闭注册弹窗
     */
    const onRegistryClose = () => {
        setRegistryOpen(false)
    }
    /**
     * 打开忘记密码弹窗
     */
    const openForgetPass = () => {
        onLoginClose()
        setForgetPassOpen(true)
    }
    /**
     * 关闭忘记密码弹窗
     */
    const onForgetPassClose = () => {
        setForgetPassOpen(false)
    }



    return <>
        <div className="blog-head-out-container">
            <div className="blog-head-container flex justify-between items-center">
                <div className="blog-search-container relative flex">
                    <input placeholder="输入标题搜索" className="blog-search-input blog-head-input border border-solid border-gray-200 pl-4 pr-10 py-1 w-100"/>
                    <span className="search-icon cursor-pointer absolute right-2">
                 <IconSearch/>
              </span>
                </div>
                <div className="flex justify-end items-center">
                    { userInfo && userInfo.id && userInfo.account && userInfo.name ?
                        <HeadUser/>  :
                        <button className={"login-btn bg-gray-200 w-12 h-12 text-center rounded-3xl cursor-pointer"} onClick={openLogin}>登录</button>}
                    <Link href={`/add-edit`} target="_blank" rel="noopener noreferrer">
                        <div className="create-container ml-10 flex items-center py-1 px-6 rounded-full cursor-pointer">
                            <IconPlus width={20} height={20} color="#ffffff"/>
                            <span className="text-xl text-white ml-1">创作</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
        <Login open={loginOpen} onClose={onLoginClose} onOpenRegistry={openRegistry} onOpenForgetPass={openForgetPass}/>
        <Registry open={registryOpen} onClose={onRegistryClose} onOpenLogin={() => {
            onRegistryClose()
            openLogin()
        }
        }/>
        <ForgetPass open={forgetPassOpen} onClose={onForgetPassClose}/>
    </>
}

BlogListHead.prototype = {
    userInfo: PropTypes.object.isRequired
}

export default BlogListHead
