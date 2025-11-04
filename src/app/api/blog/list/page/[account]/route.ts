// src/app/api/blog/list/page/[account]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkHasLogin } from '../../../../../../utils/api/check-session'
import {UserInfo} from "../../../../../../types/user";
import {BlogItemServeType, BlogItemType} from "../../../../../../types/blog";
import {formatDateTime} from "../../../../../../utils/date-format";
import {getServeError500, queryCommentsCount} from "../../../../api-utils/api-util";
import {handleCount} from "../../../../../../utils/util";
import NP from "number-precision"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const handleBlogData = async (blogs: BlogItemServeType[]) => {
    const formattedBlogs: BlogItemType[] = []
    for(const blog of  blogs){
        const { created_at, id, update_at, status, content, cover, title, view_count } = blog
        // 从内容中提取纯文本作为摘要
        const contentText = content.replace(/<[^>]*>/g, '')
        const summary = contentText.length > 500
            ? contentText.substring(0, 500)
            : contentText
        const commentCount = await queryCommentsCount(supabase, id)
        formattedBlogs.push({
            id,
            title,
            content: "",
            cover,
            status,
            viewCount: handleCount(view_count || 0),
            commentCount: handleCount(Number(commentCount) || 0),
            summary, // 返回摘要而不是完整内容
            account: "",
            createdAt: formatDateTime(created_at),
            updatedAt: formatDateTime(update_at),
        })
    }
    return formattedBlogs
}
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ account: string }> }
) {
    try {
        const resolvedParams = await params
        const account = resolvedParams.account
        console.log('=== 开始获取作者博客列表 ===', { account })

        // 1. 获取查询参数
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('current') || '1')
        const pageSize = parseInt(searchParams.get('pageSize') || '10')
        const status = searchParams.get('status') // 可选：按状态筛选
        const searchTitle = searchParams.get('title') // 可选：按标题筛选
        const requestHeaders = request.headers
        const sessionToken = requestHeaders.get('session_token') || request.cookies.get('session_token')?.value

        console.log('查询参数:', { account, page, pageSize, status, searchTitle })
        console.log('request.cookies.get(\'session_token\')?.value', request.cookies.get('session_token')?.value)

        // 2. 首先根据 account 查找目标用户
        const { data: targetUser, error: userError }:{data: UserInfo, error: unknown} = await supabase
            .from('user')
            .select('auth_user_id, account, name, avatar')
            .eq('account', account)
            .single()

        if (userError || !targetUser) {
            console.error('查找用户错误:', userError)
            return NextResponse.json({
                code: 404,
                message: '用户不存在'
            })
        }

        console.log('找到目标用户:', targetUser)

        // 3. 检查当前登录状态和用户身份
        const { result: isLoggedIn, session } = await checkHasLogin(request, supabase, sessionToken)

        // 判断是否是查看自己的博客
        const isOwnBlog = isLoggedIn && session && session.user_id === targetUser.auth_user_id
        console.log('访问权限判断:', {
            isLoggedIn,
            currentUserId: session?.user_id,
            targetUserId: targetUser.auth_user_id,
            isOwnBlog
        })

        // 4. 计算分页
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        // 5. 构建查询
        let query = supabase
            .from('blog')
            .select(`
                id,
                title,
                content,
                cover,
                status,
                created_at,
                update_at,
                view_count,
                user_id
            `, { count: 'exact' })
            .eq('user_id', targetUser.auth_user_id)

        // 7 状态筛选逻辑：
        // - 如果是查看自己的博客，可以按状态筛选，默认显示所有
        // - 如果是查看他人的博客，只能看已发布的（status=1）
        if (isOwnBlog) {
            // 查看自己的博客，可以按状态筛选
            const statusNum = status ? parseInt(status) : null
            if (typeof statusNum === 'number') {
                query = query.eq('status', statusNum)
            }
            // 如果没有指定状态，显示所有状态的博客
        } else {
            // 查看他人的博客，强制只显示已发布的
            query = query.eq('status', 1)
        }
        // 8. 添加标题模糊查询
        if (searchTitle && searchTitle.trim()) {
            // 使用 ilike 进行不区分大小写的模糊查询
            // % 表示任意字符，可以匹配标题中包含关键词的博客
            query = query.ilike('title', `%${searchTitle.trim()}%`)
            console.log('添加标题模糊查询:', searchTitle.trim())
        }
        // 9. 并行查询：获取博客列表和发布数
        const [blogResult, publishedCountResult] = await Promise.all([
            // 查询博客列表
            query
                .order('update_at', { ascending: false })
                .range(from, to),

            // 查询发布数（status=1 的总数）
            supabase
                .from('blog')
                .select('id', { count: 'exact' })
                .eq('user_id', targetUser.auth_user_id)
                .eq('status', 1)
        ])
        // // 10. 执行查询（按更新时间倒序）
        // const { data: blogs, error: blogError, count } = await query
        //     .order('update_at', { ascending: false })
        //     .range(from, to)
        const { data: blogs, error: blogError, count } = blogResult
        const { count: published } = publishedCountResult
        const author = {
            account: targetUser.account,
            name: targetUser.name,
            avatar: targetUser.avatar,
            isCurrentUser: isOwnBlog // 前端可以据此显示不同的UI
        }

        if (blogError) {
            console.error('数据库查询错误:', blogError)
            return NextResponse.json({
                code: 200,
                message: '获取博客列表成功',
                data: {
                    author,
                    list: [],
                    pagination: {
                        current: page,
                        pageSize: pageSize,
                        total:0,
                        totalPages: 0
                    },
                    countInfo: {
                        published: 0
                    }
                }
            })
        }


        // 11. 处理数据格式
        const formattedBlogs = await handleBlogData(blogs)

        // 8. 分页信息
        const total = count || 0
        const totalPages = Math.ceil(total / pageSize)

        console.log('作者博客列表数据:', {
            account,
            isOwnBlog,
            page,
            pageSize,
            total,
            totalPages,
            blogsCount: formattedBlogs.length
        })

        return NextResponse.json({
            code: 200,
            message: '获取博客列表成功',
            data: {
                author,
                list: formattedBlogs,
                pagination: {
                    current: page,
                    pageSize: pageSize,
                    total,
                    totalPages: totalPages
                },
                countInfo: {
                    published,
                    total,
                    draft: NP.minus(total, published)
                }
            }
        })

    } catch (error) {
        console.error('获取作者博客API错误:', error)
        return getServeError500(error)
    }
}