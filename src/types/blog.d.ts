
export interface BlogItemType {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    commentNum: number;
    cover: string,
    status: number;
}

export interface BlogCountInfo {
    commentCount: number;
    readCount: number
}