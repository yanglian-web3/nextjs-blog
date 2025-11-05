// components/blog-editor.tsx
'use client'

import { useEffect, useState } from 'react'
import { useDispatch } from "react-redux"
import MDEditor from '@uiw/react-md-editor'
import { AppDispatch } from "../../store/index"
import { updateContent, updateTitle } from "../../store/blog-edit-slice"
import "./blog-editor.css"
import {getBlogDetail} from "../../utils/blog";
import { useSearchParams } from "next/navigation";
import {useLoading} from "../../context/loading-context";

// 包含多种编程语言的示例内容
const initialMarkdown = `# 欢迎使用Markdown编辑器

## 代码高亮示例

### JavaScript 代码
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

const user = "World";
console.log(greet(user));
\`\`\`

### Python 代码
\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
\`\`\`

### CSS 代码
\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
}

.button:hover {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}
\`\`\`

### HTML 代码
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>示例页面</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>这是一个段落</p>
</body>
</html>
\`\`\`

### Java 代码
\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
        
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
        names.forEach(System.out::println);
    }
}
\`\`\`
`


export default function BlogEditor() {
    const dispatch = useDispatch<AppDispatch>()
    const searchParams = useSearchParams()
    const { showLoading, hideLoading } = useLoading()
    const [isClient, setIsClient] = useState(false)
    const [value, setValue] = useState("")
    const [,setDetailId] = useState("")

    useEffect(() => {
        setIsClient(true)
        console.log("searchParams=", searchParams)
        const id =  searchParams.get("id")
        if(id){
            setDetailId(id)
            getDetailData(id)
        } else {
            handleChange(initialMarkdown)
        }
    }, [])

    /**
     * 获取详情数据
     * @param id
     */
    const getDetailData = (id:string) => {
        showLoading()
        getBlogDetail(id).then((detailData) => {
            console.log("detailData=", detailData)
            const { title, content } = detailData.detail || {}
            handleChange(content || "")
            dispatch(updateTitle(title || ""))
        }).finally(() => {
            hideLoading()
        })
    }

    /**
     * 处理编辑器内容改变
     * @param newValue
     */
    const handleChange = (newValue: string = '') => {
        setValue(newValue)
        dispatch(updateContent(newValue))
    }

    if (!isClient) {
        return (
            <div className="editor-empty-container flex-1 flex items-center justify-center">
                <div className="text-gray-500">加载编辑器中...</div>
            </div>
        )
    }

    return (
        <div className="blog-editor-wrapper flex-1" data-color-mode="light">
            <MDEditor
                value={value}
                onChange={handleChange}
                height={500}
                preview="live"
                hideToolbar={false}
                visibleDragbar={true}
                previewOptions={{
                    // 代码高亮相关配置
                    rehypePlugins: [],
                    components: {
                        // 可以自定义代码块组件
// 可以自定义代码块组件
                        code: ({ children, className, ...props }) => {
                            // 通过 className 判断是否是行内代码
                            const isInline = !className?.includes('language-');

                            // 创建安全的 props，只包含 HTML 属性
                            const safeProps: React.HTMLAttributes<HTMLElement> = {
                                style: props.style,
                                id: props.id,
                                // 只包含需要的 HTML 属性
                            };

                            if (isInline) {
                                return <code {...safeProps}>{children}</code>;
                            }
                            return (
                                <pre className={className} {...safeProps}>
            <code>{children}</code>
        </pre>
                            );
                        }
                    }
                }}
                className="editor-content"
            />
        </div>
    )
}