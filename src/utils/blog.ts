import {AccountBlogResult, BlogDetailResult, BlogHomeItemType} from "../types/blog";
import {PaginationOptions} from "../types/pagination";
import qs from "qs"
import {blogFetch} from "./blog-fetch";
import {supabase} from "../lib/supabase";

/**
 * 获取随机精选博客列表
 */
export function getBlogListRandom(searchValue:string = "") {
    return  new Promise<BlogHomeItemType[]>((resolve) => {
        blogFetch<BlogHomeItemType[]>(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/list/random?title=${searchValue}`)
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
    return  new Promise<Partial<AccountBlogResult>>((resolve,reject) => {
        const searchQuery = qs.stringify(searchParams)
        blogFetch<Partial<AccountBlogResult>>(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/list/page/${account}?${searchQuery}&current=${current}&pageSize=${pageSize}`, {
            credentials: 'include',
            headers: {
                'session_token': sessionToken || ''
            }
        })
            .then(result => {
                const { code ,data, message} = result
                if(code !== 200){
                    console.error("获取博客列表失败:", message)
                    reject(message)
                }
                resolve(data)
            })
            .catch(err => {
                console.error("获取博客列表失败:", err)
                reject(err)
            })
    })
}

/**
 * 获取博客详情
 * @param id
 */
export const getBlogDetail = (id: string) => {
    return  new Promise<Partial<BlogDetailResult>>((resolve) => {
        blogFetch<Partial<BlogDetailResult>>(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/detail/${id}`)
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

/**
 * 获取需要预生成静态页面的博客id
 */
export async function getPopularBlogIds(): Promise<{id: string}[]> {
    try {
        // 从数据库获取热门博客的 ID
        const { data, error } = await supabase
            .from('blogs')
            .select('id')
            .order('view_count', { ascending: false }) // 按阅读数降序
            .limit(20) // 预生成前20篇热门文章

        if (error) {
            console.error('Error fetching popular blog ids:', error)
            return []
        }

        // 返回格式必须符合 generateStaticParams 的要求
        return data.map(blog => ({ id: blog.id.toString() }))
    } catch (error) {
        console.error('Error in getPopularBlogIds:', error)
        return []
    }
}