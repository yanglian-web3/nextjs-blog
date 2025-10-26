/**
 * 验证整个表单
 */


export const validateForm = <T, E extends Record<string, any>>(
    options: {
        formData: T;
        setErrors: React.Dispatch<React.SetStateAction<Partial<E>>>;
        validateField: (name: keyof T, value: T[keyof T]) => string | null;
    }
): boolean => {
    const { formData, setErrors, validateField } = options;
    const newErrors: Partial<E> = {} as Partial<E>;
    let isValid = true;

    // 验证每个字段
    (Object.keys(formData) as Array<keyof T>).forEach(key => {
        const error = validateField(key, formData[key]);
        if (error) {
            newErrors[key] = { message: error } as E[keyof E];
            isValid = false;
        }
    });

    setErrors(newErrors);
    return isValid;
};

/**
 * 单个字段验证
 * @param options
 */
export const validateSingleField = <T>(options:{
    name: keyof T,
    value: string,
    validateField: (name: keyof T, value: string) => string | null,
    setErrors: React.Dispatch<React.SetStateAction<Partial<K>>>;
}) => {
    const { name, value, validateField, setErrors } = options;
    const error = validateField(name, value);
    setErrors(prev => ({
        ...prev,
        [name]: error ? { message: error } : undefined
    }));
};
/**
 * 验证密码
 * @param password
 */
export const validatePassword = (password: string) => {
    if (!password.trim()) return '请输入密码';
    if (password.length < 6) return '密码至少6位字符';
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) return '密码必须包含字母和数字';
    return null;
};
/**
 * 验证邮箱
 * @param email
 */
export const validateEmail = (email: string) => {
    if (!email.trim()) return '请输入邮箱';
    if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email))
        return '邮箱格式不正确';
    return null;
};