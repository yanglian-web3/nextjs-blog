// context/loading-context.tsx
'use client'

import React, { createContext, useContext, useState } from 'react'

interface LoadingContextType {
    isLoading: boolean
    showLoading: () => void
    hideLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false)

    const showLoading = () => setIsLoading(true)
    const hideLoading = () => setIsLoading(false)

    return (
        <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
    {children}
    </LoadingContext.Provider>
)
}

export function useLoading() {
    const context = useContext(LoadingContext)
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider')
    }
    return context
}