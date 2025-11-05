import {PaginationOptions} from "./pagination";
import {CamelToSnakeKeys} from "./type-utils";
import {PostgrestError} from "@supabase/supabase-js";

export interface CommentContentCommonItem{
    articleId: string,
    avatar: string,
    id: string,
    content: string,
    username: string,
    parentUsername?: string,
    parentUserAccount?: string,
    parentId?:string,
    userAccount: string,
    createdAt: string,
    userId: string,
    // 添加索引签名
    [key: string]: unknown;
}
export type CommentContentServerItem  = CamelToSnakeKeys<CommentContentCommonItem>
export interface CommentContentItem extends CommentContentCommonItem{
    postTime: string,
    loginUserDigg: boolean,
}
export interface CommentItem {
    info: CommentContentItem,
    sub: {
        list:CommentContentItem[],
        pagination: PaginationOptions
    }
}

export interface CommentSqlQueryResult {
    data: CommentContentServerItem[] | null,
    error: PostgrestError | null,
    count: number | null
}