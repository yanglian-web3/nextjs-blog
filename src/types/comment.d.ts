export interface CommentContentItem{
    articleId: string,
    avatar: string,
    commentId: number,
    content: string,
    postTime: string,
    userName: string,
    parentUserName: string,
    parentAccount: string,
    account: string,
    loginUserDigg: boolean,
}
export interface CommentItem {
    info: CommentContentItem,
    sub: CommentContentItem[]
}