// app/auth/email-validate-callback/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EmailValidateCallback() {
    const router = useRouter()
    const [status, setStatus] = useState('检查会话状态...')

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth event:', event)
                console.log('Session:', session)

                switch (event) {
                    case 'SIGNED_IN':
                        setStatus('邮箱验证成功！正在跳转...')
                        const user = session.user
                        const userAccount = user.user_metadata.account
                        console.log('用户信息:', user)
                        console.log('邮箱确认状态:', user.email_confirmed_at)
                        // 给用户一点时间看到成功消息
                        await new Promise(resolve => setTimeout(resolve, 2000))
                        router.push(userAccount ? `/${userAccount}` : '/')
                        break
                    case 'INITIAL_SESSION':
                        setStatus('检测到已登录状态...')
                        // 已经验证过，现在没有用户信息，只能跳转默认首页
                        router.push('/')
                        break
                    case 'USER_UPDATED':
                        setStatus('用户信息更新中...')
                        break
                    default:
                        console.log('其他事件:', event)
                }
            }
        )
        return () => subscription.unsubscribe()
    }, [router])

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">邮箱验证</h2>
                <p className="text-gray-600">{status}</p>
                <p className="text-sm text-gray-500 mt-2">
                    {status.includes('成功') ? '即将跳转到您的首页' : '请稍候...'}
                </p>
            </div>
        </div>
    )
}