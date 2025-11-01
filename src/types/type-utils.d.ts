/**
 * 驼峰转下划线的类型工具
 */
export type CamelToSnake<T extends string> = T extends `${infer First}${infer Rest}`
    ? First extends Uppercase<First>
        ? `_${Lowercase<First>}${CamelToSnake<Rest>}`
        : `${First}${CamelToSnake<Rest>}`
    : T

// 将对象的所有键从驼峰转为下划线
export type CamelToSnakeKeys<T> = {
    [K in keyof T as K extends string ? CamelToSnake<K> : K]: T[K]
}