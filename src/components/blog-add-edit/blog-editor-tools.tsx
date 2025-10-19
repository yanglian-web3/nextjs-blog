"use client"

export default function BlogEditorTools({editor}){
    if(!editor){
        return null
    }
    return <div className="flex flex-wrap gap-2 p-4 border border-gray-300 bg-gray-50">
        <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded ${
                editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
        >
            <strong>B</strong>
        </button>
        <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded ${
                editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
        >
            <em>I</em>
        </button>
        <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded ${
                editor.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
        >
            H1
        </button>
        <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded ${
                editor.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
        >
            H2
        </button>
        <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded ${
                editor.isActive('codeBlock') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
        >
            代码
        </button>
        <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded ${
                editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
        >
            列表
        </button>
    </div>
}