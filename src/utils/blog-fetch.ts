/**
 * 封装fetch处理 - Promise版本
 * @param url
 * @param options
 */
export function blogFetch(url: string, options = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url, options);

            // 一次性读取响应文本
            const responseText = await response.text();

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;

                // 尝试解析为JSON错误信息
                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    // 如果不是JSON，检查是否是HTML
                    if (responseText && !responseText.includes('<!DOCTYPE')) {
                        errorMessage = responseText;
                    }
                }

                return reject(new Error(errorMessage));
            }

            // 响应正常，解析JSON
            try {
                const data = JSON.parse(responseText);
                resolve(data);
            } catch {
                reject(new Error('Invalid response format: expected JSON'));
            }

        } catch (error) {
            reject(error);
        }
    });
}