import styles from "./page.module.css";
import "../styles/common.css"
import "../styles/flex.css"
import BlogHead from "../components/blog-head/blog-head";

export default function Home() {
  return (
    <div className={styles.page}>
      <BlogHead/>
    </div>
  );
}
