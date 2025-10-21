// "use client"

import { Dialog, Field } from "@ark-ui/react";
import { useEffect, useState } from "react";
import IconPlus from "../icons/icon-plus";
import { ErrorField } from "../../types/form";

interface LoginForm {
    email: string;
    password: string;
}

interface LoginFormError {
    email: ErrorField;
    password: ErrorField;
}

export default function Login({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [isOpen, setOpen] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<LoginFormError>>({});
    const [formData, setFormData] = useState<LoginForm>({
        email: '',
        password: ''
    });

    // 验证规则
    const validateField = (name: keyof LoginForm, value: string): string | null => {
        switch (name) {
            case 'email':
                if (!value.trim()) return '邮箱是必填的';
                if (!/\S+@\S+\.\S+/.test(value)) return '邮箱格式不正确';
                return null;

            case 'password':
                if (!value.trim()) return '密码是必填的';
                if (value.length < 6) return '密码至少6位字符';
                if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) return '密码必须包含字母和数字';
                return null;

            default:
                return null;
        }
    };

    // 验证整个表单
    const validateForm = (): boolean => {
        const newErrors: Partial<LoginFormError> = {};
        let isValid = true;

        // 验证每个字段
        (Object.keys(formData) as Array<keyof LoginForm>).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = { message: error };
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    // 单个字段验证
    const validateSingleField = (name: keyof LoginForm, value: string) => {
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error ? { message: error } : undefined
        }));
    };

    // 处理输入变化
    const handleInputChange = (field: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // 实时验证（可选，也可以在提交时验证）
        validateSingleField(field, value);
    };

    // 表单提交
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 提交前验证
        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        try {
            console.log('提交登录数据:', formData);
            // 这里调用实际的登录 API
            await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用

            // 登录成功后的处理
            console.log('登录成功');
            handleClose();

        } catch (error) {
            console.error('登录失败:', error);
            // 设置服务器错误
            setErrors(prev => ({
                ...prev,
                submit: { message: '登录失败，请稍后重试' }
            }));
        } finally {
            setSubmitting(false);
        }
    };

    // 重置表单
    const resetForm = () => {
        setFormData({
            email: '',
            password: ''
        });
        setErrors({});
    };

    useEffect(() => {
        if (open) {
            setOpen(true);
            resetForm(); // 打开时重置表单
        }
    }, [open]);

    /**
     * 关闭
     */
    const handleClose = () => {
        setOpen(false);
        onClose();
        resetForm(); // 关闭时重置表单
    };

    // 检查表单是否可提交
    const isFormValid = () => {
        return formData.email.trim() !== '' &&
            formData.password.trim() !== '' &&
            Object.keys(errors).length === 0;
    };

    return (
        <Dialog.Root open={isOpen}>
            <Dialog.Backdrop
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                onClick={handleClose}
            />
            <Dialog.Positioner className="fixed inset-0 flex items-center justify-center p-4 z-[100]">
                <Dialog.Content className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                    <Dialog.Title className="text-lg font-semibold mb-2">
                        <div className="flex items-center gap-2">登录</div>
                    </Dialog.Title>

                    <Dialog.Description className="mb-6">
                        <div className="form">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* 邮箱字段 */}
                                <Field.Root invalid={!!errors.email}>
                                    <Field.Label className="block text-sm font-medium text-gray-700 mb-1">
                                        邮箱地址
                                    </Field.Label>
                                    <Field.Input
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange('email')}
                                        placeholder="your@email.com"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <Field.ErrorText className="text-red-500 text-xs mt-1">
                                        {errors.email?.message}
                                    </Field.ErrorText>
                                </Field.Root>

                                {/* 密码字段 */}
                                <Field.Root invalid={!!errors.password}>
                                    <Field.Label className="block text-sm font-medium text-gray-700 mb-1">
                                        密码
                                    </Field.Label>
                                    <Field.Input
                                        type="password"
                                        value={formData.password}
                                        onChange={handleInputChange('password')}
                                        placeholder="请输入密码"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <Field.ErrorText className="text-red-500 text-xs mt-1">
                                        {errors.password?.message}
                                    </Field.ErrorText>
                                </Field.Root>

                                {/* 提交错误 */}
                                {errors.submit && (
                                    <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                                        {errors.submit.message}
                                    </div>
                                )}

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !isFormValid()}
                                        className={`px-6 py-2 text-white rounded-lg transition-colors ${
                                            isSubmitting || !isFormValid()
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'theme-bg hover:opacity-90'
                                        }`}
                                    >
                                        {isSubmitting ? '登录中...' : '登录'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Dialog.Description>

                    {/* 关闭按钮 */}
                    <Dialog.CloseTrigger
                        className="close-btn absolute top-3 right-3 w-8 h-8"
                        onClick={handleClose}
                    >
            <span className="rotate-45 text-sm cursor-pointer flex items-center justify-center">
              <IconPlus color="#999999" width={26} height={26} />
            </span>
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
}