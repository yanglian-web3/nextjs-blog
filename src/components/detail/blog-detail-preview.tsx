"use client"

import MDEditor from "@uiw/react-md-editor";
import "../blog-editor/blog-editor.css"

export default function BlogDetailPreview({value}: {value: string}) {

    return <MDEditor
        value={value}
        preview="preview"
        hideToolbar={true}
        height="auto"
    />
}