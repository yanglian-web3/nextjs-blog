import BlogListHead from "../components/blog-list/blog-list-head/blog-list-head";
import "./index.css"
import {BlogHomeItemType} from "../types/blog";
import BlogHomeListContent from "../components/blog-list/blog-home/blog-home-list-content";
import {getBlogListRandom} from "../utils/blog";


export const revalidate = 300 // 5分钟ISR

export default async function Home() {
    const blogList:BlogHomeItemType[] = await getBlogListRandom()
    // console.log("blogList=", blogList)
  return (
    <div className={"page-container"}>
        <BlogListHead/>
        <BlogHomeListContent initList={blogList}/>
    </div>
  );
}
