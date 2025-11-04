// utils/revalidate.ts
export async function triggerBlogRevalidation(blogId: number) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/revalidate?id=${blogId}&secret=${process.env.REVALIDATE_SECRET}`,
            {
                method: 'GET',
            }
        )

        if (!response.ok) {
            throw new Error(`Revalidation failed: ${response.statusText}`)
        }

        const result = await response.json()
        console.log('Revalidation triggered:', result)
        return result
    } catch (error) {
        console.error('Error triggering revalidation:', error)
        throw error
    }
}