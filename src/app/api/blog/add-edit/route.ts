// src/app/api/blog/add-edit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from "@supabase/supabase-js"
import { checkHasLogin } from "../../../../utils/api/check-session"
import {getServeError500, validateRequiredFields} from "../../api-utils/api-util";

interface BlogRequest {
    id?: number | string
    title: string
    content: string
    cover?: string
    status?: string
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
    try {
        console.log('=== 开始创建/更新博客 ===')

        // 1. 解析请求数据
        const { id, title, content, cover, status }: BlogRequest = await request.json()
        console.log('接收到的数据:', { id, title, content, cover, status })

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
        const { validateCode, validateResult} = validateRequiredFields({title,content})
        if(!validateCode){
            return validateResult
        }

        // 4. 获取用户ID
        const userId = session.user_id
        console.log('用户ID:', userId)
        console.log('用户ID类型:', typeof userId)

        if (!userId) {
            return NextResponse.json({
                code: 401,
                message: '无法获取用户信息'
            })
        }

        // 5. 判断是新增还是更新
        const isUpdate = !!id
        console.log('操作类型:', isUpdate ? '更新' : '新增')

        // 准备基础数据
        const baseData = {
            title,
            content,
            cover: cover || "",
            update_at: new Date().toISOString(),
            status: Number(status || 0), // 默认状态为0
            user_id: userId
        }

        let resultData
        let error

        if (isUpdate) {
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
                .update(baseData)
                .eq('id', id)
                .eq('user_id', userId) // 确保只能更新自己的博客
                .select()

            resultData = updateResult.data
            error = updateResult.error

            console.log('更新结果 - data:', resultData)
            console.log('更新结果 - error:', error)

        } else {
            // 新增操作
            const insertData = {
                ...baseData,
                created_at: new Date().toISOString(),
            }

            console.log('准备插入的数据:', JSON.stringify(insertData, null, 2))
            console.log('开始插入数据...')

            const insertResult = await supabase
                .from('blog')
                .insert(insertData)
                .select()

            resultData = insertResult.data
            error = insertResult.error

            console.log('插入结果 - data:', resultData)
            console.log('插入结果 - error:', error)
        }

        if (error) {
            console.error('数据库操作错误详情:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            })
            return NextResponse.json({
                code: 500,
                message: `${isUpdate ? '更新' : '保存'}失败: ${error.message}`
            })
        }

        const successMessage = isUpdate ? '更新成功' : '保存成功'
        console.log(`${successMessage}，数据:`, resultData)

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