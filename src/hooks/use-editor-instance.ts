// hooks/useEditorInstance.ts
"use client"

import { useState, useRef, useCallback } from 'react'

export function useEditorInstance() {
    const editorRef = useRef<any>(null)
    const [editor, setEditor] = useState<any>(null)

    const updateEditor = useCallback((editorInstance: any) => {
        editorRef.current = editorInstance
        setEditor(editorInstance)
    }, [])

    return {
        editor,
        editorRef,
        updateEditor
    }
}