// app/add-edit/layout.tsx
import { EditorProvider } from '../../context/editor-context'

export default function AddEditLayout({
                                          children,
                                      }: {
    children: React.ReactNode
}) {
    return <EditorProvider>{children}</EditorProvider>
}