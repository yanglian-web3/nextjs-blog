// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import {checkUserExists} from "./check-user-exists";
import {CryptoUtils} from "../../../../utils/crypto";



export async function POST(request: NextRequest) {
    try {
        const requestResult = await request.json()
        console.log("requestResult-=", requestResult)
        const { email, password, account, name } = requestResult

        // 验证必填字段
        if (!email || !password || !account || !name) {
            return NextResponse.json(
                {
                    code: 500,
                    message: '邮箱、密码和账号均为必填项'
                }
            )
        }

// 使用示例
        const result = await checkUserExists(email)
        console.log('检查结果:', result)
        if (result.userRecordExists || result.authUserExists) {
            // 用户已存在，尝试恢复或报错
            return NextResponse.json(
                {
                    code: 500,
                    message: '用户已存在, 该邮箱或账号已被注册',
                }
            )
        }

        // 1. 注册用户到 Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password: CryptoUtils.md5(password), // 二次md5
            options: {
                data: {
                    account,
                    name,
                    email
                },
                emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/email-validate-callback`
            }
        })

        if (authError) {
            console.error('Auth error:', authError)
            return NextResponse.json(
                {
                    code: 500,
                    message: `注册失败,${authError.message}`,
                }
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
                        code: 500,
                        message: `用户资料创建失败,${profileError.message}`,
                    },
                )
            }
        }

        return NextResponse.json({
            code: 200,
            message: authData.session ? '注册成功' : '注册成功，请到邮箱查看验证',
            data: {
                id: authData.user?.id,
                email: authData.user?.email,
                account: account
            }
        })

    } catch (error) {
        console.error('Register API error:', error)
        return NextResponse.json(
            {
                code: 500,
                message: `服务器内部错误:${error instanceof Error ? error.message : 'Unknown error'}`,
            }
        )
    }
}