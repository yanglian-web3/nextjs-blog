// src/app/api/comment/delete/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from "@supabase/supabase-js"
import { checkHasLogin } from "../../../../../utils/api/check-session"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        console.log('=== 开始删除评论 ===')

        const [resolvedParams] = await Promise.all([params])
        const commentId = resolvedParams.id
        console.log('接收到的评论ID:', commentId)

        // 检查登录状态
        const supabaseAnon = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const sessionToken = request.cookies.get('session_token')?.value
        const { result, session, message } = await checkHasLogin(request, supabaseAnon, sessionToken)
        if (!result) {
            return NextResponse.json({ code: 401, message: message || '未登录' })
        }

        const userId = session.user_id
        console.log('用户ID:', userId)

        if (!userId) {
            return NextResponse.json({ code: 401, message: '无法获取用户信息' })
        }

        // 创建认证的客户端
        const supabaseAuth = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        'x-session-token': sessionToken!  // 传递自定义会话 token
                    }
                }
            }
        )

        // 使用认证的客户端执行删除
        const { data: deletedData, error: deleteError } = await supabaseAuth
            .from('comments')
            .delete()
            .eq('id', commentId)
            .eq('user_id', userId)
            .select()

        console.log('删除结果:', {
            deletedData: deletedData,
            deleteError: deleteError,
            删除条数: deletedData ? deletedData.length : 0
        })

        if (deleteError) {
            console.error('数据库删除错误:', deleteError)
            return NextResponse.json({ code: 500, message: `删除失败: ${deleteError.message}` })
        }

        if (!deletedData || deletedData.length === 0) {
            return NextResponse.json({ code: 404, message: '评论不存在' })
        }

        console.log('✅ 评论删除成功')
        return NextResponse.json({ code: 200, message: '删除成功', data: null })

    } catch (error) {
        console.error('删除评论API错误:', error)
        return NextResponse.json({ code: 500, message: `服务器内部错误: ${error instanceof Error ? error.message : 'Unknown error'}` })
    }
}