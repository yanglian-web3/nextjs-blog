import styles from "./page.module.css";
import "../styles/common.css"
import "../styles/flex.css"
import BlogHeadWrap from "../components/blog-head/blog-head-wrap";

export default function Home() {
  return (
    <div className={styles.page}>
      <BlogHeadWrap/>
    </div>
  );
}
