// src/app/api/blog/add-edit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from "@supabase/supabase-js"
import {checkHasLogin} from "../../../../utils/api/check-session";

interface BlogRequest {
    email: string
    password: string
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
    try {
        const { title, content, cover, status }: BlogRequest = await request.json()
        const { result, session, message} = await checkHasLogin( request, supabase)
        if(!result){
            return NextResponse.json({
                code: 401,
                message
            })
        }
        // 3 验证必填字段
        if (!title || !content) {
            return NextResponse.json({
                code: 400,
                message: '标题和内容均为必填项'
            })
        }
        // 3. 更新最后登录时间（可选）
        await supabase
            .from('blog')
            .insert({
                content,
                cover,
                created_at: new Date().toISOString(),
                title,
                update_at: new Date().toISOString(),
                status
            })

        // 4. 创建成功响应
        return NextResponse.json({
            code: 200,
            message: '保存成功',
        })


    } catch (error) {
        console.error('BLOG error:', error)
        return NextResponse.json({
            code: 500,
            message: `服务器内部错误:${error instanceof Error ? error.message : 'Unknown error'}`
        })
    }
}