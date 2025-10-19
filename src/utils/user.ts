export async function getUserInfo() {
    const res = await fetch("http://localhost:3000/api/user/info")
    return res.json()
}