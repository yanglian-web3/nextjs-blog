import {AccountBlogResult, BlogDetailResult, BlogHomeItemType, BlogItemType} from "../types/blog";
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
 * @param options
 */
export function getBlogListByAccount(options: {
    account: string,
    pagination: Partial<PaginationOptions>,
    searchParams?: {title?: string, status?: number},
    sessionToken?:string
}) {
    const {account, pagination, sessionToken,searchParams = {}} = options
    const {current, pageSize} = pagination
    return  new Promise<AccountBlogResult>((resolve) => {
        const searchQuery = qs.stringify(searchParams)
        fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/list/page/${account}?${searchQuery}&current=${current}&pageSize=${pageSize}`, {
            credentials: 'include',
            headers: {
                'session_token': sessionToken || ''
            }
        })
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

/**
 * 获取博客详情
 * @param id
 */
export const getBlogDetail = (id: string) => {
    return  new Promise<BlogDetailResult>((resolve) => {
        fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/detail/${id}`)
            .then(res => res.json())
            .then(result => {
                // console.log("get_Blog_Detail result=", {...result,content: "太多了省略..."})
                const { code ,data, message} = result
                if(code !== 200){
                    console.error("getBlogDetail 获取博客详情失败:", message)
                    resolve({})
                } else {
                    resolve(data)
                }
            })
    })
 }