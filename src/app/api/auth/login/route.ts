// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import {CryptoUtils} from "../../../../utils/crypto";

interface LoginRequest {
    email: string
    password: string
}

export async function POST(request: NextRequest) {
    try {
        const { email, password }: LoginRequest = await request.json()

        // 验证必填字段
        if (!email || !password) {
            return NextResponse.json({
                code: 400,
                message: '邮箱和密码均为必填项'
            })
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

        // 2. 登录成功，获取用户资料
        if (authData.user) {
            // 从 user 表获取完整的用户资料
            const { data: userProfile, error: profileError } = await supabase
                .from('user')
                .select('*')
                .eq('auth_user_id', authData.user.id)
                .single()

            if (profileError) {
                console.error('Profile fetch error:', profileError)
                // 即使获取资料失败，也返回登录成功，但提示资料获取失败
                return NextResponse.json({
                    code: 400,
                    message: '登录失败，获取用户资料失败',
                    data: {
                        user: {
                            id: authData.user.id,
                            email: authData.user.email,
                            user_metadata: authData.user.user_metadata
                        },
                        session: authData.session
                    }
                })
            }

            // 3. 更新最后登录时间（可选）
            await supabase
                .from('user')
                .update({
                    update_at: new Date().toISOString()
                })
                .eq('auth_user_id', authData.user.id)

            return NextResponse.json({
                code: 200,
                message: '登录成功',
                data: {
                    user: {
                        ...userProfile,
                        // 合并 Auth 的用户信息
                        email: authData.user.email,
                        email_confirmed: !!authData.user.email_confirmed_at,
                        last_sign_in: authData.user.last_sign_in_at
                    },
                    session: authData.session
                }
            })
        }

        // 理论上不会走到这里，但为了安全起见
        return NextResponse.json({
            code: 500,
            message: '登录过程中发生未知错误'
        })

    } catch (error) {
        console.error('Login API error:', error)
        return NextResponse.json({
            code: 500,
            message: `服务器内部错误:${error instanceof Error ? error.message : 'Unknown error'}`
        })
    }
}