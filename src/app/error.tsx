// app/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // 记录错误到控制台或错误报告服务
        console.error('Error:', error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <h2 className="text-2xl font-bold mb-4">出错了！</h2>
            <p className="text-gray-600 mb-4">
                {error.message || '发生了未知错误'}
            </p>
            <button
                onClick={() => reset()}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                重试
            </button>
        </div>
    )
}