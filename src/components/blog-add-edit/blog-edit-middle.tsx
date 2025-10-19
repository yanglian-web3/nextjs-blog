"use client"

import BlogEditorTools from "./blog-editor-tools";
import BlogEditor from "./blog-editor";
import BlogView from "./blog-view";
import {useSelector} from "react-redux";
import {RootState} from "../../store/index";
import {useEffect, useState, useRef} from "react";

export default function BlogEditMiddle() {
    const middleContainerRef = useRef<HTMLDivElement | null>(null) // 容器实例
    const { editorToolsHeight } = useSelector((state: RootState) => state.editorTools)
    const [containerHeight, setContainerHeight] = useState(editorToolsHeight)

    useEffect(() => {
        const height = middleContainerRef.current?.clientHeight - editorToolsHeight
        setContainerHeight(height)
    }, [editorToolsHeight])

    return  <div className="blog-edit-middle-container" ref={middleContainerRef}>
        {/* 工具栏 */}
        <BlogEditorTools/>
        <div className="flex editor-view-container" style={{ height: containerHeight }}>
            <BlogEditor />
            <BlogView />
        </div>
    </div>
}