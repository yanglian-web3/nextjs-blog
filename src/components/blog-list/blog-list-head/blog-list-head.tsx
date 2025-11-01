"use client"

import "./blog-list-head.css"
import PropTypes from "prop-types"
import IconSearch from "../../icons/icon-search";
import HeadUser from "../../head-user/head-user";
import IconPlus from "../../icons/icon-plus";
import Login from "../../auth/login/login";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/index";
import {getUserInfo} from "../../../utils/user";
import { updateUserInfo } from "../../../store/user-slice";
import IconClear from "../../icons/icon-clear";
import { updateSearchValue} from "../../../store/blog-search-slice"


function BlogListHead({showSearch = true}: {showSearch?: boolean}) {
    const dispatch = useDispatch<AppDispatch>()
    const { userInfo } = useSelector((state: RootState) => state.user)
    const [searchValue, setSearchValue] = useState("")

    const [loginOpen, setLoginOpen] = useState(false)


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
     * 跳转到添加编辑页面
     */
    const goAddEdit = () => {
        if(!userInfo || !userInfo.id){
            openLogin()
            return
        }
        window.open('/add-edit', '_blank');
    }
    /**
     * 搜索
     */
    const search = () => {
        console.log("search searchValue=", searchValue)
        dispatch(updateSearchValue(searchValue))
    }
    /**
     * 清空搜索标题
     */
    const clearSearchTitle = () => {
        setSearchValue("")
        dispatch(updateSearchValue(""))
    }
    /**
     * 输入框值改变
     * @param e
     */
    const searchValueChange = (e) => {
        setSearchValue(e.target.value)
    }


    return <>
        <div className="blog-head-out-container">
            <div className="blog-head-container flex justify-between items-center">
                <div className="blog-search-container relative flex">
                    {
                        showSearch ? <>
                            <div className={"flex items-center"}>
                                <input placeholder="输入标题搜索"
                                       className="blog-search-input text-gray-500 blog-head-input border border-gray-200 pl-4 pr-10 py-1 w-120"
                                     value={searchValue}
                                     onChange={searchValueChange}
                                />
                                {
                                    searchValue ?  <div className="cursor-pointer absolute right-12 flex justify-center items-center h-full"
                                                        onClick={clearSearchTitle}>
                                        <IconClear  width={20} height={20} color={"#999999"}/>
                                    </div> : null
                                }
                                <div className="cursor-pointer flex justify-center items-center h-full px-2 bg-gray-100 border border-l-0 border-gray-200"  onClick={search}>
                                    <IconSearch width={20} height={20}/>
                                </div>
                            </div>
                        </> : null
                    }
                </div>
                <div className="flex justify-end items-center">
                    { userInfo && userInfo.id && userInfo.account && userInfo.name ?
                        <HeadUser/>  :
                        <button className={"login-btn bg-gray-200 w-12 h-12 text-center rounded-3xl cursor-pointer"} onClick={openLogin}>登录</button>}
                    <div className="create-container ml-10 flex items-center py-1 px-6 rounded-full cursor-pointer" onClick={goAddEdit}>
                        <IconPlus width={20} height={20} color="#ffffff"/>
                        <span className="text-xl text-white ml-1">创作</span>
                    </div>
                </div>
            </div>
        </div>
        <Login open={loginOpen} updateOpen={setLoginOpen}/>
    </>
}

BlogListHead.prototype = {
    userInfo: PropTypes.object.isRequired
}

export default BlogListHead
