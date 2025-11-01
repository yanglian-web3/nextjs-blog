import {NextResponse} from "next/server";


/**
 * 校验必填字段
 * @param fieldsValues
 */
export const validateRequiredFields = (fieldsValues: {[k:string]: any}) => {
    const noValueFields = Object.keys(fieldsValues).filter(key => fieldsValues[key] === null || fieldsValues[key] === '')
    if(noValueFields.length){
        return {
            validateCode: 0,
            validateResult: NextResponse.json({
                code: 400,
                message: `缺少参数：${noValueFields.join(',')}`
            })
        }
    }
    return {
        validateCode: 1
    }
}

/**
 * 获取空数据响应
 * @param page
 * @param pageSize
 * @param message
 */
export const getErrorEmptyResponse = (page:number, pageSize: number, message: string) => {
    return  NextResponse.json({
        code: 200,
        message,
        data: {
            list: [],
            pagination: {
                current: page,
                pageSize: pageSize,
                total:0,
                totalPages: 0
            }
        }
    })
}
/**
 * 获取500错误响应
 * @param error
 */
export const getServeError500 = (error:any) => {
    return NextResponse.json({
        code: 500,
        message: `服务器内部错误: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
}
/**
 * 未登录
 */
export const notLoginMessage = NextResponse.json({
    code: 401,
    message: '未登录'
})

/**
 * 查询评论数量
 * @param supabase
 * @param articleId
 */
export const queryCommentsCount = async (supabase,articleId: number):Promise<string> => {
    const { count } = await supabase
        .from('comments')
        .select('id', { count: 'exact' })
        .eq('article_id', articleId)
    return count
}