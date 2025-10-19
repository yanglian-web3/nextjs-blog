"use client"

import MDEditor from "@uiw/react-md-editor";
import "../../blog-editor/blog-editor.css"
import "./blog-detail-preview.css"

export default function BlogDetailPreview({value}: {value: string}) {

    return <div className="blog-detail-preview-container flex justify-center">
       <div className="blog-detail-preview-inner-container bg-white flex-1">
           <MDEditor
               value={value}
               preview="preview"
               hideToolbar={true}
               height="auto"
           />
       </div>
    </div>
}