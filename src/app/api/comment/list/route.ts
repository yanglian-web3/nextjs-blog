// src/app/api/comments/list/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkHasLogin } from '../../../../utils/api/check-session'
import {CommentContentItem, CommentItem} from "../../../../types/comment";
import {underlineToHump} from "../../../../utils/util";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
/**
 * 处理数据，生成Info和sub
 * @param list
 */
const handleCommentData = (list: CommentContentItem[]) => {
    // 先处理下划线转驼峰
    const handleFieldList = list.map(item => {
        const keys = Object.keys(item)
        return keys.reduce((result, key) => {
            return {
                ...result,
                [underlineToHump(key)]: item[key]
            }
        }, {} as CommentContentItem)
    })
    //筛选过滤数据
    const firstLevelComments = handleFieldList.filter(item => !item.parentUserAccount)
    return firstLevelComments.reduce((result,current) => {
        result.push({
            info: current,
            sub: handleFieldList.filter(item => item.parentId === current.id)
        })
        return result
    }, [] as CommentItem[])
}

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

        // 2. 检查当前登录状态和用户身份
        const { result: isLoggedIn, session } = await checkHasLogin(request, supabase, sessionToken)

        if(!isLoggedIn){
            return NextResponse.json({
                code: 401,
                message: '未登录'
            })
        }
        // 3. 验证参数
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
                username,
                user_account,
                avatar,
                parent_user_account,
                parent_id,
                parent_username,
                created_at
            `, { count: 'exact' })
            .eq('article_id', articleId)
        
        // 6. 并行查询：获取列表
        const queryResult = await query
            .order('created_at', { ascending: false })
            .range(from, to)
        const { data: comments, error: commentError, count }:{data: CommentContentItem[], error: any, count: number} = queryResult
        

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

        // 7. 分页信息
        const total = count || 0
        const totalPages = Math.ceil(total / pageSize)



        return NextResponse.json({
            code: 200,
            message: '获取评论列表成功',
            data: {
                list: handleCommentData(comments),
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