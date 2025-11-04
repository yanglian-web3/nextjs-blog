// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const secret = searchParams.get('secret')

    // 验证密钥，防止滥用
    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    try {
        // 重新验证博客详情页
        revalidatePath(`/blog/[id]`, 'page')
        // 如果需要重新验证首页也可以加上
        // revalidatePath('/')

        console.log(`Revalidated blog page: ${id}`)
        return NextResponse.json({ revalidated: true, now: Date.now() })
    } catch (err) {
        console.error('Error revalidating:', err)
        return NextResponse.json({ error: 'Error revalidating' }, { status: 500 })
    }
}

// 也可以支持 POST 请求
export async function POST(request: NextRequest) {
    const body = await request.json()
    const { id, secret } = body

    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    try {
        revalidatePath(`/blog/${id}`)
        revalidatePath('/') // 同时重新验证首页

        console.log(`Revalidated blog page via POST: ${id}`)
        return NextResponse.json({ revalidated: true, now: Date.now() })
    } catch (err) {
        console.error('Error revalidating:', err)
        return NextResponse.json({ error: 'Error revalidating' }, { status: 500 })
    }
}