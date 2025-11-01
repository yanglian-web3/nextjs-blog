// src/app/api/comments/sub-list/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkHasLogin } from '../../../../utils/api/check-session'
import {CommentContentItem, CommentItem} from "../../../../types/comment";
import {underlineToHump} from "../../../../utils/util";
import {getParamsAndHeads, getSubQuery, queryFromTo, selectFields} from "../comment-api-util";
import {getServeError500, getErrorEmptyResponse, notLoginMessage, validateRequiredFields} from "../../api-util";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)


/**
 * 获取作者评论
 * @param request
 * @constructor
 */
export async function GET(
    request: NextRequest
) {
    try {
        // 1. 获取查询参数
        const { page, pageSize, articleId, parentId, sessionToken } = await getParamsAndHeads(request)
        console.log('查询参数:', { page, pageSize })
        console.log('request.cookies.get(\'session_token\')?.value', request.cookies.get('session_token')?.value)
        // 2. 检查当前登录状态和用户身份
        const { result: isLoggedIn } = await checkHasLogin(request, supabase, sessionToken)

        if(!isLoggedIn){
            return notLoginMessage
        }
        // 3. 验证参数
        const { validateCode, validateResult} = validateRequiredFields({articleId,parentId})
        if(!validateCode){
            return validateResult
        }
        // 4. 构建查询，查询文章id为articleId的，并且parent_id为null的
        let query = getSubQuery(supabase,articleId!,parentId!)

        const { data: comments, error: commentError, count }:{data: CommentContentItem[], error: any, count: number} = await queryFromTo(page,pageSize,query)

        if (commentError) {
            console.error('数据库查询错误:', commentError)
            return getErrorEmptyResponse(page, pageSize,"获取评论列表成功")
        }

        // 7. 分页信息
        const total = count || 0
        const totalPages = Math.ceil(total / pageSize)

        return NextResponse.json({
            code: 200,
            message: '获取评论列表成功',
            data: {
                list: comments,
                pagination: {
                    current: page,
                    pageSize: pageSize,
                    total,
                    totalPages: totalPages
                },
            }
        })

    } catch (error) {
        console.error('获取作者评论API错误:', error)
        return getServeError500(error)
    }
}