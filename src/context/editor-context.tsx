// context/editor-context.tsx
"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface EditorContextType {
    editor: any
    setEditor: (editor: any) => void
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export function EditorProvider({ children }: { children: ReactNode }) {
    const [editor, setEditor] = useState<any>(null)

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