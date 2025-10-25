
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

/**
 *  "id": null,
 "itemId": 151904885,
 "title": "Socket编程核心概念详解：IP、端口、TCP/UDP与网络字节序",
 "summary": "本文深入解析了Socket编程的四大核心基石：IP地址负责在网络中唯一标识一台设备；端口号则在该设备上标识具体的应用程序进程。TCP和UDP是两种主要的通信协议，前者提供可靠、面向连接的传输，后者则提供高效、无连接的传输。最后，网络字节序（大端序）是不同系统间数据通信时必须遵守的统一格式规则，确保了数据的正确解读。掌握这四者，是理解和编写任何网络应用程序的基础。",
 "cover": "https://i-blog.csdnimg.cn/direct/266db0619edf4fc0875703779939d6e2.png?x-oss-process=image/resize,m_fixed,h_300",
 "isTop": 0,
 "channel": 1,
 "editTime": "2025-10-20 15:53:28",
 "viewCount": "2.3k",
 "commentCount": "29",
 "diggCount": "102",
 "favoriteCount": "55",
 "publish": "2025.10.20",
 "url": "https://blog.csdn.net/2402_84532723/article/details/151904885",
 "username": "2402_84532723",
 "nickname": "CodePracticer",
 "avatar": "https://profile-avatar.csdnimg.cn/default.jpg!1",
 "blogUrl": "https://blog.csdn.net/2402_84532723",
 "timestamp": 1760946808000
 */
export interface BlogHomeItemType {
    id: number;
    title: string;
    summary: string;
    cover?: string;
    editTime: string;
    viewCount: string;
    commentCount: string;
    publish: string;
    url: string;
    account: string;
    nickname: string;
    avatar: string;
    blogUrl: string;
}