// src/app/api/blog/add-edit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from "@supabase/supabase-js"
import { checkHasLogin } from "../../../../utils/api/check-session"

interface BlogRequest {
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
        console.log('=== 开始创建博客 ===')

        // 1. 解析请求数据
        const { title, content, cover, status }: BlogRequest = await request.json()

        // 2. 检查登录状态
        const { result, session, message } = await checkHasLogin(request, supabase)
        console.log('登录检查结果:', { result, message })
        console.log('Session 对象:', session)

        if (!result || !session) {
            return NextResponse.json({
                code: 401,
                message: message || '未登录'
            })
        }

        // 3. 验证必填字段
        if (!title || !content) {
            return NextResponse.json({
                code: 400,
                message: '标题和内容均为必填项'
            })
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

        // 5. 准备插入数据
        const insertData = {
            title,
            content,
            cover: cover || "",
            created_at: new Date().toISOString(),
            update_at: new Date().toISOString(),
            status: status === '1' ? 1 : 0, // 确保是数字
            user_id: userId
        }

        console.log('准备插入的数据:', JSON.stringify(insertData, null, 2))

        // 6. 插入数据
        console.log('开始插入数据...')
        const { data, error } = await supabase
            .from('blog')
            .insert(insertData)
            .select()

        console.log('插入结果 - data:', data)
        console.log('插入结果 - error:', error)

        if (error) {
            console.error('数据库插入错误详情:', {
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

        console.log('博客创建成功，数据:', data)
        return NextResponse.json({
            code: 200,
            message: '保存成功',
            data: data[0]
        })

    } catch (error) {
        console.error('BLOG API 错误:', error)
        return NextResponse.json({
            code: 500,
            message: `服务器内部错误:${error instanceof Error ? error.message : 'Unknown error'}`
        })
    }
}