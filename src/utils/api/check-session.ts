import {NextRequest} from "next/server";
import {SupabaseClient} from "@supabase/supabase-js";

/**
 * 检查用户是否登录
 * @param request
 * @param supabase
 * @param sessionToken
 */
export const checkHasLogin = async (request: NextRequest, supabase: SupabaseClient, sessionToken?: string) => {
    console.error("====================开始调用 checkhaslogin=========================================================================")
    // 直接从 Cookie 获取 session_token
    // const sessionToken = request.cookies.get('session_token')?.value
    // console.log("checkHasLogin sessionToken=", sessionToken)
    // console.log("checkHasLogin request.url=", request.url)
    if (!sessionToken) {
        return {
            result: false,
            message: '用户未登录'
        }
    }
    // 1. 先查询会话信息
    const { data: session, error: sessionError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single()

    // console.log("session=", session)
    // console.log("sessionError=", sessionError)

    if (sessionError || !session) {
        return {
            result: false,
            message: '登录已过期'
        }
    }
    return {
        result: true,
        session
    }
}