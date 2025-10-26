///checkUserExists.ts
import {supabase} from "../../../../lib/supabase";

export  async function checkUserExists(email: string) {
    try {
        // 1. 检查 Auth 用户
        const { data: authUsers, error: authError } = await supabase
            .from('auth.users')
            .select('id, email, created_at')
            .eq('email', email)
            .single()

        console.log('Auth 用户状态:', authUsers ? '存在' : '不存在')

        // 2. 检查 user 表记录
        const { data: userRecord, error: userError } = await supabase
            .from('user')
            .select('id, account, auth_user_id')
            .eq('email', email)
            .single()

        console.log('User 表记录状态:', userRecord ? '存在' : '不存在')

        return {
            authUserExists: !!authUsers,
            userRecordExists: !!userRecord,
            authUser: authUsers,
            userRecord: userRecord
        }
    } catch (error) {
        console.error('检查用户存在时出错:', error)
        return {
            authUserExists: false,
            userRecordExists: false,
            authUser: null,
            userRecord: null
        }
    }
}