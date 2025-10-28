// src/app/api/auth/user/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {checkHasLogin} from "../../../../utils/api/check-session";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
    try {

        const { result, session, message} = await checkHasLogin( request, supabase, request.cookies.get('session_token')?.value)
        if(!result){
            return NextResponse.json({
                code: 401,
                message
            })
        }

        // 2. 再查询用户信息
        const { data: user, error: userError } = await supabase
            .from('user')
            .select('*')
            .eq('auth_user_id', session.user_id)
            .single()

        console.log("user=", user)
        console.log("userError=", userError)

        if (userError || !user) {
            return NextResponse.json({
                code: 404,
                message: '用户资料不存在'
            })
        }

        // 3. 更新最后访问时间
        await supabase
            .from('user_sessions')
            .update({
                last_accessed_at: new Date().toISOString()
            })
            .eq('id', session.id)

        const response = NextResponse.json({
            code: 200,
            message: '获取用户信息成功',
            data: {
                ...user,
                email_confirmed: !!user.email_confirmed_at,
                last_sign_in: user.last_sign_in_at
            }
        })
        response.cookies.set('user_account', user.account)
        return response
    } catch (error) {
        console.error('Get user API error:', error)
        return NextResponse.json({
            code: 500,
            message: '服务器内部错误'
        })
    }
}