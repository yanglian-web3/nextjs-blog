// src/app/api/auth/user/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET(request: NextRequest) {
    try {
        // 获取当前登录用户
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({
                code: 401,
                message: '用户未登录'
            })
        }

        // 获取用户资料
        const { data: userProfile, error: profileError } = await supabase
            .from('user')
            .select('*')
            .eq('auth_user_id', user.id)
            .single()

        if (profileError) {
            console.error('Profile fetch error:', profileError)
            return NextResponse.json({
                code: 404,
                message: '用户资料不存在'
            })
        }

        return NextResponse.json({
            code: 200,
            message: '获取用户信息成功',
            data: {
                user: {
                    ...userProfile,
                    email: user.email,
                    email_confirmed: !!user.email_confirmed_at,
                    last_sign_in: user.last_sign_in_at
                }
            }
        })

    } catch (error) {
        console.error('Get user API error:', error)
        return NextResponse.json({
            code: 500,
            message: `服务器内部错误:${error instanceof Error ? error.message : 'Unknown error'}`
        })
    }
}