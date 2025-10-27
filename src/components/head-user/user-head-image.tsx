'use client'

import { useMemo } from 'react'

interface AvatarProps {
    name?: string
    src?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

// 10种精心搭配的文字颜色（与浅灰色背景搭配）
const TEXT_COLORS = [
    'text-blue-600',    // 蓝色
    'text-green-600',   // 绿色
    'text-purple-600',  // 紫色
    'text-pink-600',    // 粉色
    'text-indigo-600',  // 靛蓝色
    'text-teal-600',    // 青蓝色
    'text-orange-600',  // 橙色
    'text-rose-600',    // 玫瑰红
    'text-cyan-600',    // 青色
    'text-amber-600',   // 琥珀色
]

// 尺寸配置
const SIZE_CLASSES = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-12 h-12 text-2xl',
    xl: 'w-16 h-16 text-3xl'
}

export default function Avatar({ name = '', src, size = 'md', className = '' }: AvatarProps) {
    // 根据名字生成稳定的随机颜色
    const textColor = useMemo(() => {
        if (!name) return TEXT_COLORS[0]

        // 将名字转换为数字，用于选择颜色
        let hash = 0
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash)
        }

        const index = Math.abs(hash) % TEXT_COLORS.length
        return TEXT_COLORS[index]
    }, [name])

    // 获取名字的首字母（支持中文）
    const initial = useMemo(() => {
        if (!name.trim()) return '?'

        // 处理中文和其他字符
        const firstChar = name.charAt(0)

        // 如果是中文字符，直接返回
        if (/[\u4e00-\u9fa5]/.test(firstChar)) {
            return firstChar
        }

        // 如果是英文字母，返回大写
        if (/[a-zA-Z]/.test(firstChar)) {
            return firstChar.toUpperCase()
        }

        // 其他字符返回第一个字符
        return firstChar
    }, [name])

    const sizeClass = SIZE_CLASSES[size]

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={`rounded-full object-cover ${sizeClass} ${className}`}
            />
        )
    }

    return (
        <div
            className={`
        rounded-full bg-gray-100 flex items-center justify-center font-semibold select-none ${textColor} ${sizeClass} ${className}
      `}
            title={name}
        >
            <strong>{initial}</strong>
        </div>
    )
}