import {NextRequest} from "next/server";

export const selectFields = `
                id,
                article_id,
                content,
                user_id,
                username,
                user_account,
                avatar,
                parent_user_account,
                parent_id,
                parent_username,
                created_at
            `

/**
 * 分页查询封装
 * @param page
 * @param pageSize
 * @param query
 */
export const queryFromTo = async (page: number, pageSize: number, query: any) => {
    // 4. 计算分页
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    // 6. 并行查询：获取列表
    return await query
        .order('created_at', { ascending: false })
        .range(from, to)
}


export const getSubQuery = (supabase: any, articleId: string, parentId: string) => {
    // 构建查询，查询文章id为articleId的，并且parent_id为null的
    return supabase
        .from('comments')
        .select(selectFields, { count: 'exact' })
        .eq('article_id', articleId)
        .eq('parent_id', parentId)
}
/**
 * 获取参数和请求头
 * @param request
 */
export const getParamsAndHeads = (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('current') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const articleId = searchParams.get('articleId')
    const parentId = searchParams.get('parentId')
    const requestHeaders = request.headers
    const sessionToken = requestHeaders.get('session_token') || request.cookies.get('session_token')?.value
    return {
        page,
        pageSize,
        articleId,
        parentId,
        sessionToken
    }
}