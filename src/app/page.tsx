import BlogListHead from "../components/blog-list/blog-list-head/blog-list-head";
import "./index.css"
import {BlogHomeItemType} from "../types/blog";
import BlogHomeListContent from "../components/blog-list/blog-home/blog-home-list-content";


export default async function Home() {

    const blogList:BlogHomeItemType[] =[
        {
            id: 151904805,
            "title": "Socket编程核心概念详解：IP、端口、TCP/UDP与网络字节序",
            "summary": "本文深入解析了Socket编程的四大核心基石：IP地址负责在网络中唯一标识一台设备；端口号则在该设备上标识具体的应用程序进程。TCP和UDP是两种主要的通信协议，前者提供可靠、面向连接的传输，后者则提供高效、无连接的传输。最后，网络字节序（大端序）是不同系统间数据通信时必须遵守的统一格式规则，确保了数据的正确解读。掌握这四者，是理解和编写任何网络应用程序的基础。",
            "cover": "https://i-blog.csdnimg.cn/direct/266db0619edf4fc0875703779939d6e2.png?x-oss-process=image/resize,m_fixed,h_300",
            "editTime": "2025-10-21 22:12:50",
            "viewCount": "2.3k",
            "commentCount": "29",
            "publish": "2025.10.20",
            "url": "https://blog.csdn.net/2402_84532723/article/details/151904885",
            "username": "2402_84532723",
            "nickname": "CodePracticer",
            "avatar": "https://profile-avatar.csdnimg.cn/default.jpg!1",
            "blogUrl": "https://blog.csdn.net/2402_84532723",
        },
        {
            id: 151904815,
            "title": "DeepSeek-OCR：视觉压缩的革命性突破——当OCR遇上LLM的“降维打击“",
            "summary": "DeepSeek-OCR的出现，标志着OCR技术从\"识别\"时代进入\"理解\"时代。它不仅仅是精度的提升、速度的优化，更是范式的革命——从\"pixel-level\"到\"semantic-level\"的跨越。技术启示：64个tokens就能表达整张图片的信息，证明了\"压缩即理解\"的哲学。：未来的多模态模型，应该围绕LLM的理解能力来设计视觉编码器，而不是盲目追求\"还原像素\"。端到端思维：从输入到输出的每一步，都应该服务于最终目标，避免pipeline的信息损失。展望未来。",
            "cover": "https://i-blog.csdnimg.cn/direct/7a27502578a84d2d99c5563935c85ecf.png?x-oss-process=image/resize,m_fixed,h_300",
            "editTime": "2025-10-21 22:12:50",
            "viewCount": "1.2k",
            "commentCount": "0",
            "publish": "2025.10.21",
            "url": "https://blog.csdn.net/u012094427/article/details/153703683",
            "username": "u012094427",
            "nickname": "许泽宇的技术分享",
            "avatar": "https://i-avatar.csdnimg.cn/a864783c9785430fb97b51086a4d0d53.jpg!1",
            "blogUrl": "https://blog.csdn.net/u012094427",
        },
        {
            id: 153753076,
            "title": "一文读懂B+树：从皇帝视角看B+树发展",
            "summary": "​：查找\"年世兰\"档案，只需访问\"N-R\"档案司→\"N-Q\"分室→找到目标。​：三年一次选秀（批量插入），新妃嫔档案激增，库房整理工作停滞，期间无法查询任何档案。​：创建纯索引档案司（非叶子节点），只记录妃嫔封号和下级档案司位置，不存放详细档案。​：B+树非叶子节点只存键，不存数据，使节点更\"瘦\"，一次可加载更多索引。​：新妃嫔入宫，档案只能堆在库房末尾。​：同样的库房空间，现在能存储更多档案司索引信息，可管理更庞大的后宫。​：B树节点包含键值和数据，每个节点有多个子节点，降低树的高度。",
            "cover": "null",
            "editTime": "2025-10-22 23:13:46",
            "viewCount": "1.1k",
            "commentCount": "0",
            "publish": "2025.10.22",
            "url": "https://blog.csdn.net/weixin_42921920/article/details/153753076",
            "username": "weixin_42921920",
            "nickname": "吃鱼的辣条",
            "avatar": "https://profile-avatar.csdnimg.cn/248efdbb4b2a41e1948bacbc989b2062_weixin_42921920.jpg!1",
            "blogUrl": "https://blog.csdn.net/weixin_42921920"
        },
        {

            "id": 153632185,
            "title": "[Ollydbg] 加密与解密-原版和吾爱版Ollydbg的下载及详细安装过程（附有下载文件）",
            "summary": "x64dbg、x32dbg 和ollydbg的分析操作区别不大，这里分享Ollydbg的绿化版文件，需要x64dbg可以看。",
            // "cover": null,
            "editTime": "2025-10-22 11:00:00",
            "viewCount": "1.6k",
            "commentCount": "0",
            "publish": "2025.10.22",
            "url": "https://blog.csdn.net/2401_89387076/article/details/153632185",
            "username": "2401_89387076",
            "nickname": "灯火不休➴",
            "avatar": "https://profile-avatar.csdnimg.cn/3cee6c3778924a2f9a43428857af4833_2401_89387076.jpg!1",
            "blogUrl": "https://blog.csdn.net/2401_89387076"
        },
        {

            "id": 153619053,
            "title": "AI日报 - 2025年10月20日",
            "summary": "AI人工智能日报新闻和最新AI工具",
            "cover": "https://i-blog.csdnimg.cn/direct/c33b39ab57974b598f8b2535f89bb964.png?x-oss-process=image/resize,m_fixed,h_300",
            "editTime": "2025-10-20 09:25:31",
            "viewCount": "1.3k",
            "commentCount": "0",
            "publish": "2025.10.20",
            "url": "https://blog.csdn.net/NingboWill/article/details/153619053",
            "username": "NingboWill",
            "nickname": "NingboWill",
            "avatar": "https://profile-avatar.csdnimg.cn/default.jpg!1",
            "blogUrl": "https://blog.csdn.net/NingboWill",
        },
        {

            "id": 153684818,
            "title": "前端三驾马车（HTML/CSS/JS）核心概念深度解析",
            "summary": "前端三驾马车（HTML/CSS/JS）核心概念深度解析",
            "cover": "https://i-blog.csdnimg.cn/direct/7cf6dca55a29476c8a7b53ab8b442d20.png?x-oss-process=image/resize,m_fixed,h_300",
            "editTime": "2025-10-21 11:56:23",
            "viewCount": "1k",
            "commentCount": "1",
            "publish": "2025.10.21",
            "url": "https://blog.csdn.net/qq_46123200/article/details/153684818",
            "username": "qq_46123200",
            "nickname": "fruge365",
            "avatar": "https://profile-avatar.csdnimg.cn/e6526c48680d42389fc8373fe5506672_qq_46123200.jpg!1",
            "blogUrl": "https://blog.csdn.net/qq_46123200",
        },
        {

            "id": 153729000,
            "title": "【软考中级】计算机硬件基础-计算机基本组成-常考知识点",
            "summary": "【软考中级】第1章计算机硬件基础-计算机基本组成，CPU的组成、奇偶校验的知识点总结、例题。",
            "cover": "https://i-blog.csdnimg.cn/direct/43c9e2bfd5094e1396c7b1031e67aff3.png?x-oss-process=image/resize,m_fixed,h_300",
            "editTime": "2025-10-22 21:30:00",
            "viewCount": "1.5k",
            "commentCount": "0",
            "publish": "2025.10.22",
            "url": "https://blog.csdn.net/ygxfbpkn/article/details/153729000",
            "username": "ygxfbpkn",
            "nickname": "PM小乔大王",
            "avatar": "https://i-avatar.csdnimg.cn/6ba1429526e74331a797ac233be9a743_ygxfbpkn.jpg!1",
            "blogUrl": "https://blog.csdn.net/ygxfbpkn",
        }
    ]

  return (
    <div className={"page-container"}>
        <BlogListHead/>
        <BlogHomeListContent initList={blogList}/>
    </div>
  );
}
