
/**
 * 组装格式化日期数据
 * @param date
 * @param connector
 */
export function mergeFormatDate (date: Date, connector:string) {
    return `${date.getFullYear()}${connector}${(date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)}${connector}${date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()}`
}

/**
 * 组装格式化时分秒数据
 * @param date
 */
export function mergeFormatHourSecond (date: Date) {
    return `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()}`
}
/**
 * 处理日期时间值
 * @param date
 */
function handleDataFormat (date:string | Date | number | null | undefined = new Date()) {
    if (typeof date === "string") {
        date = date.replace(/-/g, "/").replace("T"," ")
        if(/\./.test( date)){
            date = date.split( ".")[0]
        }
        date = new Date(date)
    } else if (typeof date === "number") {
        date = new Date(date)
    }
    return date
}

/**
 * 格式化日期
 * @param date
 * @param connector
 */
export function formatDate (date:string | Date | number | null | undefined = new Date(), connector:string = "/"):string {
    date = handleDataFormat(date)
    if (!(date instanceof Date)) {
        return ""
    }
    return mergeFormatDate(date, connector)
}

/**
 * 格式化月份
 * @param date
 * @param connector
 */
export function formatMonth (date:string | Date | number | null | undefined = new Date(), connector:string = "/"):string {
    date = handleDataFormat(date)
    if (!(date instanceof Date)) {
        return ""
    }
    return mergeFormatDate(date, connector).substring(0, 7)
}
/**
 * 根据日期时间值获取字符串各是日期时间
 * @param date
 * @param connector
 */
export function formatDateTime(date: string | Date | number | null | undefined, connector: string = "-"): string {
    console.log("format-date-time=", date)
    date = handleDataFormat(date)
    if (!(date instanceof Date)) {
        return ""
    }
    return `${mergeFormatDate(date, connector)} ${mergeFormatHourSecond(date)}`
}
