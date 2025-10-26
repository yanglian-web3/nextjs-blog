// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function POST(request: NextRequest) {
    try {
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error('Logout error:', error)
            return NextResponse.json({
                code: 500,
                message: `登出失败:${error.message}`
            })
        }

        return NextResponse.json({
            code: 200,
            message: '登出成功'
        })

    } catch (error) {
        console.error('Logout API error:', error)
        return NextResponse.json({
            code: 500,
            message: `服务器内部错误:${error instanceof Error ? error.message : 'Unknown error'}`
        })
    }
}