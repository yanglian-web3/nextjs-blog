import {PaginationOptions} from "./pagination";

export interface BlogItemCommonType {
    id: number;
    title: string;
    content: string;
    cover: string | null;
    status: number;
}
export interface BlogItemType extends BlogItemCommonType{
    summary: string;
    createdAt: string;
    updatedAt: string;
    account: string;
    auth_user_id?: string;
    viewCount: string;
    commentCount: string;
}
export interface BlogItemServeSqlType extends BlogItemCommonType{
    created_at: string;
    update_at: string;
    user_id: string
    view_count: number;
}
export interface BlogItemServeType extends BlogItemServeSqlType{
    comment_count: number;
    view_count: number;
}

export interface BlogHomeItemServeType extends BlogItemServeSqlType{
    view_count: number;
    user: {
        account: string;
        name: string;
        avatar: string | null
    }
}



export interface BlogHomeItemType {
    id: number;
    title: string;
    summary: string;
    cover: string | null;
    editTime: string;
    viewCount: string;
    publish: string;
    url: string;
    account: string;
    name: string;
    avatar: string;
}
interface BlogStatusCountInfo {
    published: number,
    draft: number,
    total: number
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
    countInfo: BlogStatusCountInfo
}

export interface BlogDetailResult {
    detail: BlogItemType,
    countInfo: {
        viewCount: string,
        commentCount: string
    },
    author: {
        account: string;
        name: string;
        avatar: string;
    }
}