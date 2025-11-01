// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {getServeError500} from "../../api-util";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
    try {
        // 从 Cookie 获取 session_token
        const sessionToken = request.cookies.get('session_token')?.value

        console.log('登出 - sessionToken:', sessionToken)

        if (sessionToken) {
            // 从数据库删除会话
            const { error } = await supabase
                .from('user_sessions')
                .delete()
                .eq('session_token', sessionToken)

            console.log('删除会话结果:', error)
        }

        // 创建响应
        const response = NextResponse.json({
            code: 200,
            message: '登出成功'
        })

        // 清除 Cookie - 确保设置正确
        response.cookies.set('session_token', '', {
            expires: new Date(0),  // 设置为过去时间
            path: '/',             // 确保路径一致
            httpOnly: true,        // 与登录时保持一致
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        })

        console.log('Cookie 清除指令已设置')

        return response

    } catch (error) {
        console.error('Logout error:', error)
        return getServeError500(error)
    }
}