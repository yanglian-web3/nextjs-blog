// pages/auth/email-validate-callback/page.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../../lib/supabase'

export default function EmailValidateCallback() {
    const router = useRouter()

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    // 从 session 中获取用户信息
                    const user = session.user
                    const userMetadata = user.user_metadata

                    console.log('用户信息:', user)
                    console.log('用户元数据:', userMetadata)

                    // 获取账号信息（从 user_metadata）
                    const userAccount = userMetadata.account
                    const userName = userMetadata.name

                    // 跳转到个人首页，可以带上用户账号
                    if (userAccount) {
                        router.push(`/${userAccount}`)  // 跳转到用户专属页面
                        // 或者: router.push('/welcome')
                    } else {
                        router.push('/')
                    }
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [router])

    return <div>验证中，请稍候...</div>
}