import {AccountBlogResult, BlogHomeItemType, BlogItemType} from "../types/blog";
import {PaginationOptions} from "../types/pagination";
import qs from "qs"

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

/**
 * 根据account账户，分页以及搜索参数获取博客
 * @param account
 * @param pagination
 * @param searchParams
 */
export function getBlogListByAccount(account: string,
                                     pagination: Partial<PaginationOptions>,
                                     searchParams: {title?: string, status?: number} = {}) {
    return  new Promise<AccountBlogResult>((resolve) => {
        const query = qs.stringify(searchParams)
        fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/list/page/${account}?${query}`)
            .then(res => res.json())
            .then(result => {
                const { code ,data, message} = result
                if(code !== 200){
                    console.error("获取博客列表失败:", message)
                    resolve([])
                }
                resolve(data)
            })
            .catch(err => {
                console.error("获取博客列表失败:", err)
                resolve([])
            })
    })
}