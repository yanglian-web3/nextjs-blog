import {UserInfo} from "../types/user";

/**
 * 获取用户信息
 */
export async function getUserInfo() {
    return new Promise<UserInfo>(resolve => {
        fetch("/api/auth/user")
            .then(res => res.json())
            .then(res => {
                console.log("请求用户信息 res=", res)
                const { code ,data } = res
                if(code === 200){
                    resolve(data.user)
                }
            })
    })
}