// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function POST(request: NextRequest) {
    try {
        const requestResult = await request.json()
        console.log("requestResult-=", requestResult)
        const { email, password, account, name } = requestResult

        // 验证必填字段
        if (!email || !password || !account || !name) {
            return NextResponse.json(
                {
                    success: false,
                    message: '邮箱、密码和账号均为必填项'
                },
                { status: 400 }
            )
        }

        // 1. 注册用户到 Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    account,
                    name,
                    email
                },
                emailRedirectTo: getRedirectUrl()
            }
        })

        if (authError) {
            console.error('Auth error:', authError)
            return NextResponse.json(
                {
                    success: false,
                    message: '注册失败',
                    error: authError.message
                },
                { status: 400 }
            )
        }

        // 2. 如果注册成功，创建用户资料记录
        if (authData.user) {
            const userData = {
                account,
                name,
                email,
                created_at: new Date().toISOString(),
                update_at: new Date().toISOString(),
                avatar: null,
                phone: null,
                auth_user_id: authData.user.id,
            }

            const { error: profileError } = await supabase
                .from('user')
                .insert(userData)

            if (profileError) {
                console.error('Profile creation error:', profileError)

                // 如果资料创建失败，删除刚创建的 auth 用户
                try {
                    await supabase.auth.admin.deleteUser(authData.user.id)
                } catch (deleteError) {
                    console.error('Failed to delete auth user:', deleteError)
                }

                return NextResponse.json(
                    {
                        success: false,
                        message: '用户资料创建失败',
                        error: profileError.message
                    },
                    { status: 400 }
                )
            }
        }

        return NextResponse.json({
            success: true,
            message: authData.session ? '注册成功' : '注册成功，请检查邮箱验证',
            user: {
                id: authData.user?.id,
                email: authData.user?.email,
                account: account
            }
        })

    } catch (error) {
        console.error('Register API error:', error)
        return NextResponse.json(
            {
                success: false,
                message: '服务器内部错误',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

const getRedirectUrl = () => {
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3000/auth/email-validate-callback'
    }
    return 'https://yourapp.com/auth/email-validate-callback'
}