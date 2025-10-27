
import BlogDetailPreview from "../../../components/detail/blog-detail-preview/blog-detail-preview";
import BlogDetailHead from "../../../components/detail/blog-detail-head/blog-detail-head";
import IconClockFill from "../../../components/icons/icon-clock-fill";
import IconViewFill from "../../../components/icons/icon-view-fill";
import "./detail-page.css"
import {BlogCountInfo} from "../../../types/blog";
import BlogDetailBottom from "../../../components/detail/blog-detail-bottom/blog-detail-bottom";

const initialMarkdown = ``

export default function BlogDetail() {
const value = initialMarkdown
    const title = "欢迎使用Markdown编辑器"
    const blogCountInfo: BlogCountInfo = {
        commentCount: 10,
        readCount: 100
    }
    return <div className="blog-detail-container bg-gray-200 flex flex-col">
        <BlogDetailHead/>
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
        <div className="blog-detail-preview-and-bottom-container flex justify-center">
            <BlogDetailPreview value={value}/>
            {/*为了对齐，放在preview组件里面，放在外面可能会因浏览器其他插件影响，导致底部和中间不对齐*/}
            <BlogDetailBottom blogCountInfo={blogCountInfo}/>
        </div>
    </div>
}