// src/app/api/comments/list/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkHasLogin } from '../../../../utils/api/check-session'
import {CommentContentItem} from "../../../../types/comment";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
    request: NextRequest
) {
    try {

        // 1. 获取查询参数
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('current') || '1')
        const pageSize = parseInt(searchParams.get('pageSize') || '10')
        const articleId = searchParams.get('articleId')
        const requestHeaders = request.headers
        const sessionToken = requestHeaders.get('session_token') || request.cookies.get('session_token')?.value

        console.log('查询参数:', { page, pageSize })
        console.log('requestHeaders.get(\'session_token\'):', requestHeaders.get('session_token'))
        console.log('request.cookies.get(\'session_token\')?.value', request.cookies.get('session_token')?.value)

        // 3. 检查当前登录状态和用户身份
        const { result: isLoggedIn, session } = await checkHasLogin(request, supabase, sessionToken)

        if(!isLoggedIn){
            return NextResponse.json({
                code: 401,
                message: '未登录'
            })
        }

        if(!articleId){
            return NextResponse.json({
                code: 400,
                message: '缺少参数：articleId'
            })
        }

        // 4. 计算分页
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        // 5. 构建查询
        let query = supabase
            .from('comments')
            .select(`
                id,
                article_id,
                content,
                user_id,
                user_name,
                user_account,
                avatar,
                parent_user_account,
                parent_username,
                created_at
            `, { count: 'exact' })
            .eq('article_id', articleId)
        
        // 7. 并行查询：获取评论列表和发布数
        const queryResult = await query
            .order('created_at', { ascending: false })
            .range(from, to)
        const { data: comments, error: commentError, count } = queryResult
        

        if (commentError) {
            console.error('数据库查询错误:', commentError)
            return NextResponse.json({
                code: 200,
                message: '获取评论列表成功',
                data: {
                    list: [],
                    pagination: {
                        current: page,
                        pageSize: pageSize,
                        total:0,
                        totalPages: 0
                    }
                }
            })
        }

        // 7. 处理数据格式
        const formattedCommentss = (comments || []).map((comments:CommentContentItem) => {
            return comments
        })

        // 8. 分页信息
        const total = count || 0
        const totalPages = Math.ceil(total / pageSize)



        return NextResponse.json({
            code: 200,
            message: '获取评论列表成功',
            data: {
                list: formattedCommentss,
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
        return NextResponse.json({
            code: 500,
            message: `服务器内部错误: ${error instanceof Error ? error.message : 'Unknown error'}`
        })
    }
}