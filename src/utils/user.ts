import {UserInfo} from "../types/user";
import {blogFetch} from "./blog-fetch";

/**
 * 获取用户信息
 */
export async function getUserInfo() {
    return new Promise<UserInfo>(resolve => {
        blogFetch("/api/auth/user",{
            credentials: 'include' // 重要：确保携带 Cookie
        })
            .then(res => {
                console.log("请求用户信息 res=", res)
                const { code ,data } = res
                if(code === 200){
                    resolve(data)
                }
            })
    })
}