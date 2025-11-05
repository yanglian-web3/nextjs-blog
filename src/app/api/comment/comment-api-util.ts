import {NextRequest} from "next/server";
import {CommentContentItem} from "../../../types/comment";
import { SupabaseClient } from '@supabase/supabase-js'

export const selectFields = `
                id,
                article_id,
                content,
                user_id,
                username,
                user_account,
                avatar,
                parent_user_account,
                parent_id,
                parent_username,
                created_at
            `


export const getSubQuery = (supabase: SupabaseClient, articleId: string, parentId: string) => {
    // 构建查询，查询文章id为articleId的，并且评论id为parentId的
    // console.log("getSubQuery=", articleId, parentId)
    return supabase
        .from('comments')
        .select(selectFields, { count: 'exact' })
        .eq('article_id', articleId)
        .eq('parent_id', parentId)
}
/**
 * 获取参数和请求头
 * @param request
 */
export const getParamsAndHeads = (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('current') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const articleId = searchParams.get('articleId') || ""
    const parentId = searchParams.get('parentId')
    const requestHeaders = request.headers
    const sessionToken = requestHeaders.get('session_token') || request.cookies.get('session_token')?.value
    return {
        page,
        pageSize,
        articleId,
        parentId,
        sessionToken
    }
}

/**
 * 根据今天时间对比时间，显示今天、昨天、前天
 * 2025-11-01T04:10:56.482867+00:00
 */
export const getPostTimeShowValue = (postTime:string, dateAfterValue:string) => {
    const now = new Date().getTime()
    const postTimeStamp = new Date(postTime).getTime()
    const hourMinute = dateAfterValue.substring(0, 5)
    // console.log("hourMinute=", hourMinute)
    // console.log("dateAfterValue=", dateAfterValue)
    if (now - postTimeStamp < 24 * 60 * 60 * 1000) {
        return "今天 " + hourMinute
    }
    if (now - postTimeStamp < 2 * 24 * 60 * 60 * 1000) {
        return "昨天 " + hourMinute
    }
    if (now - postTimeStamp < 3 * 24 * 60 * 60 * 1000) {
        return "前天 " + hourMinute
    }
    return postTime
}
/**
 * 处理显示用的评论时间
 * @param data
 */
export const handlePostTime = (data: CommentContentItem[]) => {
    return data.map((item) => {
        const dateArr = item.createdAt.split("T")
        item.postTime = getPostTimeShowValue(dateArr[0], dateArr[1])
        return item
    })
}