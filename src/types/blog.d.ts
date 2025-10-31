import {PaginationOptions} from "./pagination";

export interface BlogItemCommonType {
    id: number;
    title: string;
    content: string;
    cover: string,
    status: number;
    viewCount: string;
    commentCount: string;
    summary: string;
}
export interface BlogItemType extends BlogItemCommonType{
    createdAt: string;
    updatedAt: string;
    account: string;
    summary: string;
    auth_user_id: string;
}

export interface BlogItemServeType extends BlogItemCommonType{
    created_at: string;
    update_at: string;
    comment_count: number;
    view_count: number;
    user_id: string
}
export interface BlogCountInfo {
    commentCount: number;
    readCount: number
}

export interface BlogHomeItemType extends BlogItemCommonType {
    editTime: string;
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
    pagination: PaginationOptions,
    countInfo: {
        publishedCount: number
    }
}