// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-3xl font-bold mb-4">页面未找到</h2>
        <p className="text-gray-600 mb-4">抱歉，您访问的页面不存在。</p>
        <Link
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          返回首页
        </Link>
      </div>
  )
}