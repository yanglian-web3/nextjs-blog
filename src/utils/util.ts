
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

/**
 *  获取单个 cookie 值
 * @param name
 */
export const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null

    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null
    }
    return null
}

/**
 * 处理数量显示，根据数据大小，显示不同单位
 */
export function handleCount(count: number) {
   if(count > 10000){
       return `${(count / 10000).toFixed(1)}万`
   }
   if(count > 1000){
       return `${(count / 1000).toFixed(1)}千`
   }
   return count
}

/**
 * 驼峰转为下划线
 */
export function humpToUnderline(str: string) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
/**
 * 下划线转为驼峰
 */
export function underlineToHump(str: string) {
    return str.replace(/_(\w)/g, function(all, letter) {
        return letter.toUpperCase()
    })
}

/**
 * 批量处理对象里面的字符串
 * @param list
 * @param fn
 * @constructor
 */
export const multiHandleStrInObject = <T>(list: T[], fn: (k:string) => T) => {
    return list.map(item => {
        const keys = Object.keys(item)
        return keys.reduce((result, key) => {
            return {
                ...result,
                [fn(key)]: item[key]
            }
        }, {} as T)
    })
}

/**
 * 批量下划线转为驼峰
 * @param list
 * @constructor
 */
export const multiUnderlineToHump = <T>(list: T[]) => {
    return multiHandleStrInObject(list, underlineToHump)
}

/**
 * 批量驼峰转为下划线
 */
export const multiHumpToUnderline = <T>(list: T[]) => {
    return multiHandleStrInObject(list, humpToUnderline)
}