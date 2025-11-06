// src/app/api/blog/detail/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import {createClient, PostgrestError} from '@supabase/supabase-js'
import { checkHasLogin } from '../../../../../utils/api/check-session'
import { BlogItemServeType } from "../../../../../types/blog";
import {UserInfo} from "../../../../../types/user";
import {formatDateTime} from "../../../../../utils/date-format";
import {handleCount} from "../../../../../utils/util";
import {getServeError500, queryCommentsCount} from "../../../../../utils/api/api-util";
import {triggerBlogRevalidation} from "../../../../../utils/api/revalidate";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params
        const blogId = Number(resolvedParams.id)

        console.log('=== 开始获取博客详情 ===', { blogId })

        // 1. 获取会话信息
        const requestHeaders = request.headers
        const sessionToken = requestHeaders.get('session_token') || request.cookies.get('session_token')?.value
        const { result: isLoggedIn, session } = await checkHasLogin(request, supabase, sessionToken)

        console.log('会话状态:', { isLoggedIn, currentUserId: session?.user_id })

        // 2. 查询博客基本信息
        const { data: blog, error: blogError }:{data: BlogItemServeType | null, error: PostgrestError | null} = await supabase
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

        // 3. 查询作者信息
        const { data: author, error: authorError }: { data: UserInfo | null, error: PostgrestError | null} = await supabase
            .from('user')
            .select('auth_user_id, account, name, avatar')
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

        const newViewCount = (view_count || 0) + 1
        // 5. 更新浏览量（非作者查看时）
        if (!isOwnBlog && isPublished) {
            await supabase
                .from('blog')
                .update({ view_count: newViewCount})
                .eq('id', blogId)
        }
        if(newViewCount % 10 === 0){
            // 每增加10次阅读重新验证一次
            await triggerBlogRevalidation(blogId)
        }

        // 6. 查询评论数量
        const commentCount = await queryCommentsCount(supabase, blogId)

        // 7. 构建响应数据
        const blogDetail = {
            id,
            title,
            content,
            cover,
            status,
            createdAt: formatDateTime(created_at),
            updatedAt: formatDateTime(update_at)
        }

        return NextResponse.json({
            code: 200,
            message: '获取博客详情成功',
            data: {
                detail: blogDetail,
                countInfo: {
                    viewCount: handleCount((view_count || 0) + (!isOwnBlog && isPublished ? 1 : 0)),
                    commentCount: handleCount(Number(commentCount) || 0)
                },
                author
            }
        })

    } catch (error) {
        console.error('获取博客详情API错误:', error)
        return getServeError500(error)
    }
}