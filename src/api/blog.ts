export async function getCommentList() {
    // const res = await fetch("http://localhost:3000/api/user/info")
    // return res.json()

    return {
        "current": 1,
        "size": 20,
        "total": 0,
        "list": [
            {
                "info": {
                    "commentId": 33420089,
                    "articleId": 139246413,
                    "parentId": 0,
                    "postTime": "2024-06-21 14:48:57",
                    "content": "大佬，兼容win7和mac-intel系统的时候，都会报错\nUncaught Exception:TypeError: undefined is not a functionat Object,&lt;anonymous&gt;(evalmachine.&lt;anonymous&gt;:1:247)at Module. extensions..jsc.Module. extensions..cjsc(C:\\ProgramFiles jetknown-electroniresourceslapp.asarout\\mainbytecode-loader.cjs:71:26)at Module.load (node:internal/modules/cjs/loader:988:32)at Module. load (node:internal/modules/cjs/loader:829:12)\nat c. load (node:electron/js2c/asar _bundle:5:13343)\nat Module.reguire (node:internal/modules/cjs/loader:1012:19)at require (node:internal/modules/cjs/helpers:102:18)\nat Object,&lt;anonymous&gt;(C:\\Program\nFiles\\jetknown-electroniresourceslapp.asarout\\main\\index,js:3:1)at Module.compile (node:internal/modules/cjs/loader:1120:14)at Module. extensions..js (node:internal/modules/cjs/loader;1175:10)\n\n在开发群里问了可能是?.的问题，但是把?.都修改了依然报错TypeError: undefined is not a function，你有遇到过这个问题吗？vue3+js开发",
                    "account": "qq_45752346",
                    "digg": 0,
                    "diggArr": [],
                    "loginUserDigg": false,
                    "parentUserName": "qq_41000974",
                    "parentNickName": "东扯葫芦西扯瓜",
                    "avatar": "https://profile-avatar.csdnimg.cn/22de08ad3831446986ab9ac3ab9eebb6_qq_45752346.jpg!1",
                    "userName": "黄安树_",
                    "dateFormat": "2024.06.21",
                    "years": 6,
                    "vip": false,
                    "vipIcon": "",
                    "vipUrl": "https://mall.csdn.net/vip",
                    "companyBlog": false,
                    "companyBlogIcon": "",
                    "flag": false,
                    "flagIcon": "",
                    "levelIcon": "https://csdnimg.cn/identity/blog2.png",
                    "commentFromTypeResult": {
                        "index": 1,
                        "key": "pc",
                        "title": "PC"
                    },
                    "isTop": false,
                    "isBlack": false,
                    "region": "IP：江苏省",
                    "orderNo": "",
                    "redEnvelopeInfo": null,
                    "gptInfo": null
                },
                "sub": [
                    {
                        "commentId": 33542582,
                        "articleId": 139246413,
                        "parentId": 33420089,
                        "postTime": "2024-07-02 10:27:06",
                        "content": "解决了，bytecode-loader.cjs编译的时候报错，把v8源码加密的代码注释掉就成功打包了，但是还没找到这个bytecodePlugin有什么问题[face]emoji:029.png[/face]",
                        "account": "qq_45752346",
                        "digg": 1,
                        "diggArr": [
                            "qq_41000974"
                        ],
                        "loginUserDigg": true,
                        "parentUserName": "qq_41000974",
                        "parentNickName": "东扯葫芦西扯瓜",
                        "avatar": "https://profile-avatar.csdnimg.cn/22de08ad3831446986ab9ac3ab9eebb6_qq_45752346.jpg!1",
                        "userName": "黄安树_",
                        "dateFormat": "2024.07.02",
                        "years": 6,
                        "vip": false,
                        "vipIcon": "",
                        "vipUrl": "https://mall.csdn.net/vip",
                        "companyBlog": false,
                        "companyBlogIcon": "",
                        "flag": false,
                        "flagIcon": "",
                        "levelIcon": "https://csdnimg.cn/identity/blog2.png",
                        "commentFromTypeResult": {
                            "index": 1,
                            "key": "pc",
                            "title": "PC"
                        },
                        "isTop": false,
                        "isBlack": false,
                        "region": "IP：北京市",
                        "orderNo": "",
                        "redEnvelopeInfo": null,
                        "gptInfo": null
                    },
                    {
                        "commentId": 33516931,
                        "articleId": 139246413,
                        "parentId": 33420089,
                        "postTime": "2024-06-29 22:23:08",
                        "content": "没遇到过。现在解决了没？",
                        "account": "qq_41000974",
                        "digg": 0,
                        "diggArr": [],
                        "loginUserDigg": false,
                        "parentUserName": "qq_45752346",
                        "parentNickName": "黄安树_",
                        "avatar": "https://profile-avatar.csdnimg.cn/34ae4cbb255441a5bf61c77f426875c8_qq_41000974.jpg!1",
                        "userName": "东扯葫芦西扯瓜",
                        "dateFormat": "2024.06.29",
                        "years": 8,
                        "vip": false,
                        "vipIcon": "",
                        "vipUrl": "https://mall.csdn.net/vip",
                        "companyBlog": false,
                        "companyBlogIcon": "",
                        "flag": false,
                        "flagIcon": "",
                        "levelIcon": "https://csdnimg.cn/identity/blog4.png",
                        "commentFromTypeResult": {
                            "index": 1,
                            "key": "pc",
                            "title": "PC"
                        },
                        "isTop": false,
                        "isBlack": false,
                        "region": "IP：贵州省",
                        "orderNo": "",
                        "redEnvelopeInfo": null,
                        "gptInfo": null
                    }
                ],
                "pointCommentId": null
            }
        ]
    }
}