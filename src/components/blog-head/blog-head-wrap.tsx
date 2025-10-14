import BlogHead from "./blog-head";
import {UserInfo} from "../../types/user";

async function getUserInfo() {
    const res = await fetch("http://localhost:3000/api/user/info")
    return res.json()
}

export default async function BlogHeadWrap() {

    // const userInfo = await getUserInfo()

    const userInfo:UserInfo = {
        name: "张三",
        headImg: "https://picsum.photos/200/300",
        email: "zhangsan@163.com",
        phone: "13888888888"
    }
    return <BlogHead userInfo={userInfo}/>
}