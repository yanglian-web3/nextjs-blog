// components/blog-editor.tsx
'use client'

import { useEffect, useState } from 'react'
import { useDispatch } from "react-redux"
import MDEditor from '@uiw/react-md-editor'
import { AppDispatch } from "../../store/index"
import { updateContent, updateTitle } from "../../store/blog-edit-slice"
import { useEditorContext } from '../../context/editor-context'
import "./blog-editor.css"
import {getBlogDetail} from "../../utils/blog";
import { useSearchParams } from "next/navigation";
import {BlogDetailResult} from "../../types/blog";
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
    const { setEditor } = useEditorContext()
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
        getBlogDetail(id).then((detailData:BlogDetailResult) => {
            console.log("detailData=", detailData)
            const { title, content } = detailData.detail
            handleChange(content)
            dispatch(updateTitle(title))
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

    // 模拟 editor 实例
    useEffect(() => {
        if (isClient) {
            const mockEditor = {
                chain: () => ({
                    focus: () => ({
                        toggleBold: () => ({
                            run: () => {
                                const text = '**粗体文字**'
                                setValue(prev => prev + text)
                            }
                        }),
                        toggleItalic: () => ({
                            run: () => {
                                const text = '*斜体文字*'
                                setValue(prev => prev + text)
                            }
                        }),
                        toggleHeading: (options: { level: number }) => ({
                            run: () => {
                                const prefix = '#'.repeat(options.level) + ' '
                                setValue(prev => prev + prefix)
                            }
                        }),
                        toggleCodeBlock: () => ({
                            run: () => {
                                const text = '\n```javascript\n// 在这里写代码\n```\n'
                                setValue(prev => prev + text)
                            }
                        }),
                        toggleBulletList: () => ({
                            run: () => {
                                const text = '\n- 列表项\n'
                                setValue(prev => prev + text)
                            }
                        })
                    })
                }),
                isActive: () => false
            }
            setEditor(mockEditor)
        }
    }, [isClient, setEditor])

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
                        code: ({ inline, children, className, ...props }) => {
                            if (inline) {
                                return <code {...props}>{children}</code>
                            }
                            return (
                                <pre className={className} {...props}>
                                    <code>{children}</code>
                                </pre>
                            )
                        }
                    }
                }}
                className="editor-content"
            />
        </div>
    )
}