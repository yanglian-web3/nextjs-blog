// src/app/api/blog/publish/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from "@supabase/supabase-js"
import { checkHasLogin } from "../../../../../utils/api/check-session"
import {getServeError500, notLoginMessage} from "../../../api-utils/api-util";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // 1. 解析请求数据
        const resolvedParams = await params
        const { id } = resolvedParams
        console.log('接收到的数据:', { id })

        // 2. 检查登录状态
        const { result, session, message } = await checkHasLogin(request, supabase, request.cookies.get('session_token')?.value)
        console.log('登录检查结果:', { result, message })
        console.log('Session 对象:', session)

        if (!result) {
            return notLoginMessage
        }

        // 3. 获取用户ID
        const userId = session.user_id
        console.log('用户ID:', userId)
        console.log('用户ID类型:', typeof userId)

        if (!userId) {
            return NextResponse.json({
                code: 401,
                message: '无法获取用户信息'
            })
        }
        // 更新操作
        console.log('开始更新数据...')

        // 首先检查该博客是否存在且属于当前用户
        const { data: existingBlog, error: checkError } = await supabase
            .from('blog')
            .select('id, user_id')
            .eq('id', id)
            .eq('user_id', userId)
            .single()

        if (checkError || !existingBlog) {
            return NextResponse.json({
                code: 404,
                message: '博客不存在或无权修改'
            })
        }

        // 执行更新
        const updateResult = await supabase
            .from('blog')
            .update({
                status: 1
            })
            .eq('id', id)
            .eq('user_id', userId) // 确保只能更新自己的博客
            .select()

        const resultData = updateResult.data
        const error = updateResult.error

        console.log('更新结果 - data:', resultData)
        console.log('更新结果 - error:', error)
        if (error) {
            console.error('数据库操作错误详情:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            })
            return NextResponse.json({
                code: 500,
                message: `发布失败: ${error.message}`
            })
        }

        const successMessage = '发布成功'
        console.log(`${successMessage}:`)

        return NextResponse.json({
            code: 200,
            message: successMessage,
            data: resultData ? resultData[0] : null
        })

    } catch (error) {
        console.error('BLOG API 错误:', error)
        return getServeError500(error)
    }
}