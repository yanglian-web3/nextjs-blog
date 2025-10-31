// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 需要认证的路径
const protectedPaths = ['/add-edit', '/my-blog-list']

function parseUrlSearchParams(search: string) {
    const params = new URLSearchParams(search)
    const obj: Record<string, string> = {}
    params.forEach((value, key) => {
        obj[key] = value
    })
    return obj
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const sessionToken = request.cookies.get('session_token')?.value
    const userAccount = request.cookies.get('user_account')?.value
    // 获取路径的account参数，如果有，那么重定向的时候优先选择
    const search = request.nextUrl.search
    const queryParams = parseUrlSearchParams(search)
    console.log("queryParams=", queryParams)

    // 检查是否为保护路径
    const isProtectedPath = protectedPaths.some(path =>
        pathname.startsWith(path)
    )
    // console.log(" request=",  request)
    const origin = request.nextUrl.origin
    const targetRedirectUrl = new URL(queryParams.account || userAccount || '/', origin)
    if (isProtectedPath) {
        if (!sessionToken) {
            // 未登录访问保护页面，重定向到个人首页或者页面首页
            return NextResponse.redirect(targetRedirectUrl)
        }

        // 验证会话有效性
        try {
            const { data: session, error } = await supabase
                .from('user_sessions')
                .select('*')
                .eq('session_token', sessionToken)
                .gt('expires_at', new Date().toISOString())
                .single()

            if (error || !session) {
                // 会话无效，清除Cookie并重定向
                const response = NextResponse.redirect(targetRedirectUrl)
                response.cookies.delete('session_token')
                return response
            }
        } catch (error) {
            console.error('Session validation error:', error)
            return NextResponse.redirect(targetRedirectUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * 匹配所有路径，排除：
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}