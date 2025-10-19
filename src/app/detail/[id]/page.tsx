
import BlogDetailPreview from "../../../components/detail/blog-detail-preview";

const initialMarkdown = `# 欢迎使用Markdown编辑器

## 代码高亮示例

### JavaScript 代码
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\``

export default function BlogDetail() {
const value = initialMarkdown

    return <div className="blog-detail-container h-screen">
        <BlogDetailPreview value={value}/>
        </div>
}