/**
 * 生成n-m的随机数,包含max
 * @param min
 * @param max
 */
export function getRandom(min:number, max:number) {
    return Math.random() * (max - min) + min // 含最大值，含最小值
}
/**
 * 生成n-m的随机整数,不包含max
 * @param min
 * @param max
 */
export function getRandomInt(min:number, max:number) {
    return Math.floor(getRandom(min, max))
}