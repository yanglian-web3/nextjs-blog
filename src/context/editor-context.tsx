// context/editor-context.tsx
"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

// 定义更通用的编辑器接口
interface EditorInstance {
    chain: <T>() => T
    isActive: <T,>(type: string, attributes?: T) => boolean
    // 可以根据需要添加更多方法
}

interface EditorContextType {
    editor: EditorInstance | null
    setEditor: (editor: EditorInstance | null) => void
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export function EditorProvider({ children }: { children: ReactNode }) {
    const [editor, setEditor] = useState<EditorInstance | null>(null)

    return (
        <EditorContext.Provider value={{ editor, setEditor }}>
            {children}
        </EditorContext.Provider>
    )
}

export function useEditorContext() {
    const context = useContext(EditorContext)
    if (context === undefined) {
        throw new Error('useEditorContext must be used within an EditorProvider')
    }
    return context
}