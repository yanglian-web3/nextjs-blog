import {PaginationOptions} from "./pagination";
import {CamelToSnakeKeys} from "./type-utils";

export interface CommentContentItem{
    articleId: string,
    avatar: string,
    id: string,
    content: string,
    postTime: string,
    username: string,
    parentUsername?: string,
    parentUserAccount?: string,
    parentId?:string,
    userAccount: string,
    loginUserDigg: boolean,
    createdAt: string
}
export interface CommentItem {
    info: CommentContentItem,
    sub: {
        list:CommentContentItem[],
        pagination: PaginationOptions
    }
}

export interface CommentSqlQueryResult {
    data: CamelToSnakeKeys<CommentContentItem>[],
    error: any,
    count: number
}