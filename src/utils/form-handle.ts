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
