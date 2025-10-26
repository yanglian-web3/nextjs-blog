// utils/crypto.ts
import CryptoJS from 'crypto-js'

export class CryptoUtils {
    // 基础 MD5
    static md5(str: string): string {
        return CryptoJS.MD5(str).toString()
    }

    // 带盐值的 MD5
    static md5WithSalt(str: string, salt: string): string {
        return CryptoJS.MD5(str + salt).toString()
    }

    // 生成随机盐值
    static generateSalt(length: number = 16): string {
        return CryptoJS.lib.WordArray.random(length).toString()
    }

    // 验证 MD5 哈希
    static verifyMD5(str: string, hash: string): boolean {
        return CryptoJS.MD5(str).toString() === hash
    }

    // 验证带盐值的 MD5
    static verifyMD5WithSalt(str: string, salt: string, hash: string): boolean {
        return CryptoJS.MD5(str + salt).toString() === hash
    }
}

// // 使用示例
// import { CryptoUtils } from '@/utils/crypto'
//
// const password = 'user123'
// const salt = CryptoUtils.generateSalt()
// const hashedPassword = CryptoUtils.md5WithSalt(password, salt)
//
// console.log('盐值:', salt)
// console.log('哈希值:', hashedPassword)
//
// // 验证
// const isValid = CryptoUtils.verifyMD5WithSalt(password, salt, hashedPassword)
// console.log('验证结果:', isValid)