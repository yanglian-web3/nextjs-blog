// src/app/api/comment/send/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from "@supabase/supabase-js"
import { checkHasLogin } from "../../../../utils/api/check-session"
import {triggerBlogRevalidation} from "../../../../utils/api/revalidate";

interface BlogCommentSendRequest {
    user_account: string;
    article_id: number;
    avatar?: string;
    parentId?: string;
    content: string;
    username: string;
    parent_username?: string;
    parent_user_account?: string;
    parent_id?: string;
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
    try {
        console.log('=== 开始创建/更新评论 ===')

        // 1. 解析请求数据
        const { user_account, article_id, avatar, parentId, content, username, parent_username, parent_user_account, parent_id }: BlogCommentSendRequest = await request.json()
        console.log('接收到的数据:', {  user_account, article_id, avatar, parentId, content, username, parent_username, parent_user_account, parent_id })

        // 2. 检查登录状态
        const { result, session, message } = await checkHasLogin(request, supabase, request.cookies.get('session_token')?.value)
        console.log('登录检查结果:', { result, message })
        console.log('Session 对象:', session)

        if (!result) {
            return NextResponse.json({
                code: 401,
                message: message || '未登录'
            })
        }

        // 3. 验证必填字段
        if (!content) {
            return NextResponse.json({
                code: 400,
                message: '内容为必填项'
            })
        }
        if (!article_id) {
            return NextResponse.json({
                code: 400,
                message: "文章ID缺失"
            })
        }
        if (!user_account || !username) {
            return NextResponse.json({
                code: 400,
                message: "用户信息缺失"
            })
        }


        // 4. 获取用户ID
        const userId = session.user_id
        console.log('用户ID:', userId)
        console.log('用户ID类型:', typeof userId)
        // console.log('session:', session)

        if (!userId) {
            return NextResponse.json({
                code: 401,
                message: '无法获取用户信息'
            })
        }

        // 6.准备基础数据

        const insertData = {
            article_id,
            avatar,
            content,
            user_id: userId,
            parentId,
            username,
            parent_username,
            parent_user_account,
            user_account,
            parent_id,
            created_at: new Date().toISOString(),
        }

        console.log('准备插入的数据:', JSON.stringify(insertData, null, 2))
        console.log('开始插入数据...')

        const insertResult = await supabase
            .from('comments')
            .insert(insertData)
            .select()

        const resultData = insertResult.data
        const error = insertResult.error

        console.log('插入结果 - data:', resultData)
        console.log('插入结果 - error:', error)

        if (error) {
            console.error('数据库操作错误详情:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            })
            return NextResponse.json({
                code: 500,
                message: `保存失败: ${error.message}`
            })
        }
       // 触发页面重新验证
        await triggerBlogRevalidation(article_id)
        const successMessage = '保存成功'
        console.log(`${successMessage}，数据:`, resultData)

        return NextResponse.json({
            code: 200,
            message: successMessage,
            data: resultData ? resultData[0] : null
        })

    } catch (error) {
        console.error('BLOG API 错误:', error)
        return NextResponse.json({
            code: 500,
            message: `服务器内部错误:${error instanceof Error ? error.message : 'Unknown error'}`
        })
    }
}