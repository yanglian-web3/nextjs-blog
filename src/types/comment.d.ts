export interface CommentContentItem{
    articleId: string,
    avatar: string,
    id: string,
    content: string,
    postTime: string,
    username: string,
    parentUsername?: string,
    parentAccount?: string,
    parentId?:string,
    userAccount: string,
    loginUserDigg: boolean,
}
export interface CommentItem {
    info: CommentContentItem,
    sub: CommentContentItem[]
}