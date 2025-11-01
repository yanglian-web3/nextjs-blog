// src/app/api/comments/list/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkHasLogin } from '../../../../utils/api/check-session'
import {CommentContentItem} from "../../../../types/comment";
import {multiUnderlineToHump} from "../../../../utils/util";
import {getParamsAndHeads, getSubQuery, handlePostTime, queryFromTo, selectFields} from "../comment-api-util";
import {getErrorEmptyResponse, getServeError500, notLoginMessage, validateRequiredFields} from "../../api-util";
import {CamelToSnakeKeys} from "../../../../types/type-utils";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
/**
 * 处理数据，生成Info和sub
 * @param list
 * @param articleId
 */
const handleCommentData = async (list: CamelToSnakeKeys<CommentContentItem>[], articleId) => {
    // 先处理下划线转驼峰
    const handleFieldList = multiUnderlineToHump<CamelToSnakeKeys<CommentContentItem>, CommentContentItem>(list)
    const afterHandlePostTimeList = handlePostTime(handleFieldList)
    const handleResult = []
    const page = 1
    const pageSize = 3 // 子评论默认加载3条
    for(const current of afterHandlePostTimeList){
        const { id } = current
        let subQuery = getSubQuery(supabase,articleId!,id!)
        const dataResult:{data: CamelToSnakeKeys<CommentContentItem>[], error: any, count: number} = await queryFromTo(page,pageSize,subQuery)
        const { data: subComments, error: subCommentError, count:subCount } = dataResult
        const total = subCount || 0
        const totalPages = Math.ceil(total / pageSize)
        const subList = subCommentError || !subComments ? [] : multiUnderlineToHump<CamelToSnakeKeys<CommentContentItem>, CommentContentItem>(subComments)
        const afterHandlePostTimeSubList = handlePostTime(subList)
        handleResult.push({
            info: current,
            sub: {
                list: afterHandlePostTimeSubList,
                pagination: {
                    current: page,
                    pageSize,
                    total,
                    totalPages
                },
            }
        })
    }

    return handleResult

}

/**
 * 获取作者评论
 * @param request
 * @constructor
 * 查询逻辑：
 * 1）先获取第一层的评论，分页查询parent_id为null的评论
 * 2）获取子评论，根据第一层评论的id，查询parent_id等于当前id的评论,分页查询
 * 3）组装数据
 */
export async function GET(
    request: NextRequest
) {
    try {

        // 1. 获取查询参数
        const { page, pageSize, articleId, sessionToken } = await getParamsAndHeads(request)
        console.log('查询参数:', { page, pageSize })
        console.log('request.cookies.get(\'session_token\')?.value', request.cookies.get('session_token')?.value)

        // 2. 检查当前登录状态和用户身份
        const { result: isLoggedIn } = await checkHasLogin(request, supabase, sessionToken)

        if(!isLoggedIn){
            return notLoginMessage
        }
        // 3. 验证参数
        const { validateCode, validateResult} = validateRequiredFields({articleId})
        if(!validateCode){
            return validateResult
        }

        // 4. 计算分页
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        // 5. 构建查询，查询文章id为articleId的，并且parent_id为null的
        let query = supabase
            .from('comments')
            .select(selectFields, { count: 'exact' })
            .eq('article_id', articleId)
            .is('parent_id', null)  // 使用 .is() 方法查询 NULL 值
        
        // 6. 并行查询：获取列表
        const queryResult = await query
            .order('created_at', { ascending: false })
            .range(from, to)
        const { data: comments, error: commentError, count }:{data: CommentContentItem[], error: any, count: number} = queryResult

        if (commentError) {
            console.error('数据库查询错误:', commentError)
            return getErrorEmptyResponse(page, pageSize,"获取评论列表成功")
        }

        // 7. 分页信息
        const total = count || 0
        const totalPages = Math.ceil(total / pageSize)

        const dataList = await handleCommentData(comments, articleId)

        return NextResponse.json({
            code: 200,
            message: '获取评论列表成功',
            data: {
                list: dataList,
                pagination: {
                    current: page,
                    pageSize: pageSize,
                    total,
                    totalPages: totalPages
                },
            }
        })

    } catch (error) {
        console.error('获取作者评论API错误:', error)
        return getServeError500(error)
    }
}