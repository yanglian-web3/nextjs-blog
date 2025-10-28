import {PaginationOptions} from "./pagination";

export interface BlogItemCommonType {
    id: number;
    title: string;
    content: string;
    cover: string,
    status: number;
}
export interface BlogItemType extends BlogItemCommonType{
    createdAt: string;
    updatedAt: string;
    commentNum: number;
    account: string;
    auth_user_id: string;
}

export interface BlogItemServeType extends BlogItemCommonType{
    created_at: string;
    update_at: string;
    comment_num: number;
    user: {
        account: string;
        name: string;
        avatar: string;
    }
}
export interface BlogCountInfo {
    commentCount: number;
    readCount: number
}

export interface BlogHomeItemType extends BlogItemCommonType {
    summary: string;
    editTime: string;
    viewCount: string;
    commentCount: string;
    publish: string;
    url: string;
    account: string;
    name: string;
    avatar: string;
    blogUrl: string;
}

export interface AccountBlogResult {
    author: {
        account: string;
        name: string;
        avatar: string;
        isCurrentUser: boolean;
    },
    list:BlogItemType[],
    pagination: PaginationOptions
}