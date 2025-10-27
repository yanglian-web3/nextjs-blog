// lib/session.ts
import { createClient } from '@supabase/supabase-js'
import {NextRequest} from 'next/server'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 生成安全的会话令牌
function generateSessionToken(): string {
    // 方法1: 使用 Web Crypto API（推荐）
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const array = new Uint8Array(32)
        crypto.getRandomValues(array)
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    }

    // 方法2: 降级方案（用于不支持 crypto 的环境）
    return Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2)
}

export async function createSession(userId: string, request: NextRequest) {
    const sessionToken = generateSessionToken()
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'

    // 会话24小时后过期
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    console.log('创建会话参数:', {
        userId,
        sessionToken,
        userAgent: userAgent.substring(0, 50), // 只打印前50字符
        ipAddress,
        expiresAt: expiresAt.toISOString()
    })

    const { error } = await supabase
        .from('user_sessions')
        .insert({
            user_id: userId,
            session_token: sessionToken,
            user_agent: userAgent,
            ip_address: ipAddress,
            expires_at: expiresAt.toISOString()
        })

    console.log('插入会话结果:', error)

    if (error) {
        // 处理重复会话令牌的情况
        if (error.code === '23505') {
            console.warn('会话令牌冲突，重新生成...')
            return await createSession(userId, request)
        }
        throw error
    }

    return sessionToken
}