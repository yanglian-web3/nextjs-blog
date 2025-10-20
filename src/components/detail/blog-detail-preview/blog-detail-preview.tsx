"use client"

import MDEditor from "@uiw/react-md-editor";
import "../../blog-editor/blog-editor.css"
import "./blog-detail-preview.css"

export default function BlogDetailPreview({value}: {value: string}) {

    return <div className="blog-detail-preview-inner-container flex flex-1 flex-col">
        <div className="bg-white flex-1 pb-16">
            <MDEditor
                value={value}
                preview="preview"
                hideToolbar={true}
                height="auto"
            />
        </div>
    </div>
}