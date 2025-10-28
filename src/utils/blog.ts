import {BlogHomeItemType} from "../types/blog";

/**
 * 获取随机精选博客列表
 */
export function getBlogListRandom() {
    return  new Promise<BlogHomeItemType[]>((resolve) => {
        fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/list/random`)
            .then(res => res.json())
            .then(result => {
                const { code ,data, message} = result
                if(code !== 200){
                    console.error("获取博客列表失败:", message)
                    resolve([])
                    return
                }
                resolve(data)
            })
            .catch(err => {
                console.error("获取博客列表失败:", err)
                resolve([])
            })
    })
}