
import BlogDetailPreview from "../../../components/detail/blog-detail-preview/blog-detail-preview";
import BlogDetailHead from "../../../components/detail/blog-detail-head/blog-detail-head";
import {UserInfo} from "../../../types/user";
import {getUserInfo} from "../../../utils/user";
import IconClockFill from "../../../components/icons/icon-clock-fill";
import IconViewFill from "../../../components/icons/icon-view-fill";
import "./detail-page.css"

const initialMarkdown = `

## 代码高亮示例

### JavaScript 代码
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\``

export default function BlogDetail() {
const value = initialMarkdown
    const title = "欢迎使用Markdown编辑器"
    // const userInfo = await getUserInfo()
    const userInfo:UserInfo = {
        name: "张三",
        headImg: "https://picsum.photos/200/300",
        email: "zhangsan@163.com",
        phone: "13888888888"
    }
    return <div className="blog-detail-container bg-gray-200 flex flex-col">
        <BlogDetailHead userInfo={userInfo}/>
        <div className="blog-detail-title mt-3 flex justify-center ">
           <div className="bg-white blog-title-inner px-6 py-3 rounded-t-sm">
               <h1 className="font-bold text-4xl">{title}</h1>
               <div className=" bg-gray-100  px-3 py-2 mt-3 rounded-t-sm">
                  <div className="flex">
                      <div className="publish-date-container flex items-center text-gray-500 mr-10">
                          <IconClockFill width={15} height={15} color={"#999999"}/>
                          <span className="ml-1">于 2024-06-03 21:31:00 发布</span>
                      </div>
                      <div className="read-container flex items-center text-gray-500">
                          <IconViewFill width={15} height={15} color={"#999999"}/>
                          <span className="ml-1"> 阅读量 2.7k</span>
                      </div>
                  </div>
               </div>
           </div>
        </div>
        <BlogDetailPreview value={value}/>
    </div>
}