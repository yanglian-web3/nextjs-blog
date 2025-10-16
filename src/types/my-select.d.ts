export type MySelectListMode = "down" | "up" | undefined
export type ButtonHorizontalMode = "center" | "start" | "between" | "end"
export type MySelectObjectItem = {
    label: string,
    value: string | number,
    [k:string]: any
}
export type MySelectItem = string | number | MySelectObjectItem
