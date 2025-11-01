// src/app/api/blog/featured/route.ts (随机版本)
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {BlogHomeItemType, BlogItemServeType} from "../../../../../types/blog";
import {getServeError500} from "../../../api-util";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
    try {
        console.log('=== 开始获取随机精选博客列表 ===')

        // 1. 先获取所有已发布博客的ID
        const { data: allBlogs, error: countError } = await supabase
            .from('blog')
            .select('id')
            .eq('status', 1)

        if (countError) {
            console.error('获取博客ID列表错误:', countError)
            return NextResponse.json({
                code: 500,
                message: `获取博客列表失败: ${countError.message}`
            })
        }

        if (!allBlogs || allBlogs.length === 0) {
            return NextResponse.json({
                code: 200,
                message: '暂无博客数据',
                data: []
            })
        }

        // 2. 随机选择5个ID
        const randomIds = allBlogs
            .sort(() => Math.random() - 0.5)
            .slice(0, 5)
            .map((blog:BlogHomeItemType) => blog.id)

        console.log('随机选择的博客ID:', randomIds)

        // 3. 根据随机ID获取完整的博客信息
        const { data: blogs, error: blogError } = await supabase
            .from('blog')
            .select(`
                id,
                title,
                content,
                cover,
                created_at,
                update_at,
                status,
                user_id,
                view_count,
                user:user_id (
                    account,
                    name,
                    avatar
                )
            `)
            .in('id', randomIds)
            .eq('status', 1)

        if (blogError) {
            console.error('数据库查询错误:', blogError)
            return NextResponse.json({
                code: 500,
                message: `获取博客详情失败: ${blogError.message}`
            })
        }

        // 4. 处理数据格式
        const formattedBlogs = (blogs || []).map((blog:BlogItemServeType) => {
            const { user, content, created_at, update_at, id, title, cover, view_count} =  blog
            const contentText = content.replace(/<[^>]*>/g, '')
            const summary = contentText.length > 500
                ? contentText.substring(0, 500)
                : contentText

            const editTime = new Date(update_at || created_at).toLocaleString('zh-CN')
            const publish = new Date(update_at || created_at).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).replace(/\//g, '.')

            return {
                id,
                title,
                summary,
                cover,
                editTime,
                viewCount: view_count,
                commentCount: "0",
                publish,
                url: `/detail/${id}`,
                account: user?.account,
                name: user?.name,
                avatar: user?.avatar,
            }
        })

        // console.log('博客数据:', formattedBlogs)

        return NextResponse.json({
            code: 200,
            message: '获取随机精选博客成功',
            data: formattedBlogs
        })

    } catch (error) {
        console.error('精选博客API错误:', error)
        return getServeError500(error)
    }
}