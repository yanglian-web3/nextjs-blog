import "../styles/common.css"
import BlogHeadWrap from "../components/blog-head/blog-head-wrap";
import "../styles/index.css"

export default function Home() {
  return (
    <div className={"page-container"}>
      <BlogHeadWrap/>
    </div>
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
    //     <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
    //         <h1 className="text-3xl font-bold text-gray-800 mb-4">
    //             Tailwind CSS v4.1
    //         </h1>
    //         <p className="text-gray-600 mb-6">
    //             如果看到这个样式化的卡片，说明 Tailwind CSS v4.1 配置成功！
    //         </p>
    //         <div className="space-y-3">
    //             <div className="flex items-center space-x-2">
    //                 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
    //                 <span className="text-sm text-gray-700">Next.js 15</span>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //                 <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
    //                 <span className="text-sm text-gray-700">Tailwind CSS v4.1</span>
    //             </div>
    //         </div>
    //         <button className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
    //             开始使用
    //         </button>
    //     </div>
    // </div>
  );
}
