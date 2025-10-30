// src/app/api/blog/detail/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkHasLogin } from '../../../../utils/api/check-session'
import { BlogItemServeType } from "../../../../types/blog";
import {UserInfo} from "../../../../types/user";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const [resolvedParams] = await Promise.all([params])
        const blogId = resolvedParams.id

        console.log('=== 开始获取博客详情 ===', { blogId })

        // 1. 获取会话信息
        const requestHeaders = request.headers
        const sessionToken = requestHeaders.get('session_token') || request.cookies.get('session_token')?.value
        const { result: isLoggedIn, session } = await checkHasLogin(request, supabase, sessionToken)

        console.log('会话状态:', { isLoggedIn, currentUserId: session?.user_id })

        // 2. 查询博客基本信息
        const { data: blog, error: blogError }:{data: BlogItemServeType, error: any} = await supabase
            .from('blog')
            .select(`
                id,
                title,
                content,
                cover,
                status,
                created_at,
                update_at,
                user_id,
                view_count
            `)
            .eq('id', blogId)
            .single()

        if (blogError || !blog) {
            console.error('博客查询错误:', blogError)
            return NextResponse.json({
                code: 404,
                message: '博客不存在'
            })
        }

        const { id, title, content, cover, status, created_at, update_at, user_id, view_count } = blog

        console.log('查询到博客:', {
            id,
            title,
            status,
            user_id
        })

        // 3. 查询作者信息
        const { data: author, error: authorError }: { data: UserInfo, error: any} = await supabase
            .from('user')
            .select('auth_user_id, account, name, avatar, bio')
            .eq('auth_user_id', blog.user_id)
            .single()

        if (authorError || !author) {
            console.error('作者查询错误:', authorError)
            return NextResponse.json({
                code: 404,
                message: '作者信息不存在'
            })
        }

        // 4. 权限检查
        const isOwnBlog = isLoggedIn && session && session.user_id === user_id
        const isPublished = blog.status === 1

        console.log('权限检查:', { isOwnBlog, isPublished, blogStatus: status })

        // 非作者只能查看已发布的博客
        if (!isOwnBlog && !isPublished) {
            return NextResponse.json({
                code: 403,
                message: '无权查看该博客'
            })
        }

        // 5. 更新浏览量（非作者查看时）
        if (!isOwnBlog && isPublished) {
            await supabase
                .from('blog')
                .update({ view_count: (view_count || 0) + 1 })
                .eq('id', blogId)
        }

        // 6. 查询相关博客（同作者的已发布博客）
        const { data: relatedBlogs } = await supabase
            .from('blog')
            .select('id, title, cover, created_at')
            .eq('user_id', blog.user_id)
            .eq('status', 1)
            .neq('id', blogId)
            .order('created_at', { ascending: false })
            .limit(4)

        // 7. 查询评论数量
        const { count: commentCount } = await supabase
            .from('comments')
            .select('id', { count: 'exact' })
            .eq('blog_id', blogId)
            .eq('status', 1) // 只统计已审核的评论

        // 9. 构建响应数据
        const blogDetail = {
            id,
            title,
            content,
            cover,
            status,
            createdAt: created_at,
            updatedAt: update_at,
            viewCount: (view_count || 0) + (!isOwnBlog && isPublished ? 1 : 0), // 实时计数
            commentCount: commentCount || 0
        }

        return NextResponse.json({
            code: 200,
            message: '获取博客详情成功',
            data: blogDetail
        })

    } catch (error) {
        console.error('获取博客详情API错误:', error)
        return NextResponse.json({
            code: 500,
            message: `服务器内部错误: ${error instanceof Error ? error.message : 'Unknown error'}`
        })
    }
}