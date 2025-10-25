// pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../lib/supabase'  // 路径修正

interface RegisterRequest {
    email: string
    password: string
    account: string  // 改为 account
    name?: string    // 改为 name
}

interface RegisterResponse {
    success: boolean
    message: string
    user?: any
    error?: string
}
const getRedirectUrl = () => {
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3000/auth/email-validate-callback'
    }
    return 'https://yourapp.com/auth/email-validate-callback'
}
export default async function registerHandler(
    req: NextApiRequest,
    res: NextApiResponse<RegisterResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        })
    }

    try {
        const { email, password, account, name }: RegisterRequest = req.body

        // 验证必填字段
        if (!email || !password || !account) {
            return res.status(400).json({
                success: false,
                message: '邮箱、密码和账号均为必填项'
            })
        }

        // 1. 注册用户到 Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    emailRedirectTo: getRedirectUrl(), // 邮箱验证地址
                    account,  // 使用 account
                    name      // 使用 name
                }
            }
        })

        if (authError) {
            console.error('Auth error:', authError)
            return res.status(400).json({
                success: false,
                message: '注册失败',
                error: authError.message
            })
        }

        // 2. 如果注册成功，创建用户资料记录
        if (authData.user) {
            const { error: profileError } = await supabase
                .from('user')  // 表名改为 user
                .upsert({
                    id: authData.user.id,
                    account: account.toLowerCase(),
                    name: name || account,  // 如果没有 name，使用 account
                    email,
                    update_at: new Date().toISOString(),
                    created_at: "",
                    password: "",
                    phone: ""
                })

            if (profileError) {
                console.error('Profile creation error:', profileError)

                // 如果资料创建失败，删除刚创建的用户
                // 注意：需要 Supabase 项目设置中启用服务角色密钥
                await supabase.auth.admin.deleteUser(authData.user.id)

                return res.status(400).json({
                    success: false,
                    message: '用户资料创建失败',
                    error: profileError.message
                })
            }
        }

        res.status(201).json({
            success: true,
            message: authData.session ? '注册成功' : '注册成功，请检查邮箱验证',
            user: {
                id: authData.user?.id,
                email: authData.user?.email,
                account: account  // 改为 account
            }
        })

    } catch (error) {
        console.error('Register API error:', error)
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}