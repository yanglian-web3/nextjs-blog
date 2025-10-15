import BlogHeadWrap from "../components/blog-head/blog-head-wrap";
import "../styles/index.css"

export default function Home() {
  return (
    <div className={"page-container"}>
        <BlogHeadWrap/>
        <div class="blog-content-container overflow-auto overscroll-contain m-auto p-2">

        </div>
    </div>
  );
}
