// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from "@supabase/supabase-js"
import { CryptoUtils } from "../../../../utils/crypto"
import { createSession } from "../../../../lib/session"
import {getServeError500, validateRequiredFields} from "../../api-utils/api-util";

interface LoginRequest {
    email: string
    password: string
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
    try {
        const { email, password }: LoginRequest = await request.json()

        // 验证必填字段
        const { validateCode, validateResult} = validateRequiredFields({email,password})
        if(!validateCode){
            return validateResult
        }

        // 1. 使用 Supabase Auth 登录
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password: CryptoUtils.md5(password) // 二次md5
        })

        if (authError) {
            console.error('Auth error:', authError)

            // 根据错误类型返回不同的提示信息
            let errorMessage = '登录失败'
            if (authError.message.includes('Invalid login credentials')) {
                errorMessage = '邮箱或密码错误'
            } else if (authError.message.includes('Email not confirmed')) {
                errorMessage = '邮箱未验证，请先验证邮箱'
            } else if (authError.message.includes('Too many requests')) {
                errorMessage = '登录尝试次数过多，请稍后再试'
            }

            return NextResponse.json({
                code: 400,
                message: `${errorMessage},${authError.message}`
            })
        }

        // 2. 登录成功，创建数据库会话
        if (authData.user) {
            try {
                // 创建自定义会话
                const sessionToken = await createSession(authData.user.id, request)
                console.log('创建的 sessionToken:', sessionToken)
                // 立即验证会话是否创建成功
                const { data: verifySession, error: verifyError } = await supabase
                    .from('user_sessions')
                    .select('*')
                    .eq('session_token', sessionToken)
                    .single()

                console.log('会话创建验证:', { verifySession, verifyError })
                // 从 user 表获取完整的用户资料
                const { data: userProfile, error: profileError } = await supabase
                    .from('user')
                    .select('*')
                    .eq('auth_user_id', authData.user.id)
                    .single()

                if (profileError) {
                    console.error('Profile fetch error:', profileError)
                    // 即使获取资料失败，也返回登录成功，但提示资料获取失败
                    const response = NextResponse.json({
                        code: 400,
                        message: '登录失败，获取用户资料失败',
                        data: {
                            user: {
                                id: authData.user.id,
                                email: authData.user.email,
                                user_metadata: authData.user.user_metadata
                            }
                        }
                    })

                    // 设置会话 Cookie
                    response.cookies.set('session_token', sessionToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: 24 * 60 * 60 // 24小时
                    })

                    return response
                }

                // 3. 更新最后登录时间（可选）
                await supabase
                    .from('user')
                    .update({
                        update_at: new Date().toISOString()
                    })
                    .eq('auth_user_id', authData.user.id)

                // 4. 创建成功响应
                const response = NextResponse.json({
                    code: 200,
                    message: '登录成功',
                    data: {
                        ...userProfile,
                        // 合并 Auth 的用户信息
                        email: authData.user.email,
                        email_confirmed: !!authData.user.email_confirmed_at,
                        last_sign_in: authData.user.last_sign_in_at
                    }
                })

                // 5. 设置会话 Cookie
                response.cookies.set('session_token', sessionToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 24 * 60 * 60 // 24小时
                })
                response.cookies.set('user_account', userProfile.account)
                return response

            } catch (sessionError) {
                console.error('Session creation error:', sessionError)
                return NextResponse.json({
                    code: 500,
                    message: '登录失败，会话创建错误'
                })
            }
        }

        // 理论上不会走到这里，但为了安全起见
        return NextResponse.json({
            code: 500,
            message: '登录过程中发生未知错误'
        })

    } catch (error) {
        console.error('Login API error:', error)
        return getServeError500( error)
    }
}