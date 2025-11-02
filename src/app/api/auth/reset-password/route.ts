// src/app/api/auth/reset-password/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json({
                code: 400,
                message: '邮箱地址不能为空'
            })
        }

        // 发送密码重置邮件
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`,
        })

        if (error) {
            console.error('发送重置邮件失败:', error)
            return NextResponse.json({
                code: 500,
                message: '发送重置邮件失败，请稍后重试'
            })
        }

        // 出于安全考虑，不透露邮箱是否存在
        return NextResponse.json({
            code: 200,
            message: '重置链接已发送到您的邮箱,请到邮箱查看'
        })

    } catch (error) {
        console.error('重置密码API错误:', error)
        return NextResponse.json({
            code: 500,
            message: '服务器内部错误'
        })
    }
}