// "use client"

import { Dialog, Field } from "@ark-ui/react";
import { useEffect, useState } from "react";
import IconPlus from "../icons/icon-plus";
import { ErrorField } from "../../types/form";

interface LoginForm {
    account: string;
    password: string;
}

interface LoginFormError {
    account: ErrorField;
    password: ErrorField;
}
interface Props {
    open: boolean;
    onClose: () => void;
    onOpenLogin: () => void;
}

export default function ForgetPass({ open, onClose, onOpenLogin }: Props) {
    const [isOpen, setOpen] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<LoginFormError>>({});
    const [formData, setFormData] = useState<LoginForm>({
        account: '',
        password: ''
    });

    useEffect(() => {
        setOpen(open);
        if (open) {
            resetForm(); // 打开时重置表单
        }
    }, [open]);

    // 验证规则
    const validateField = (name: keyof LoginForm, value: string): string | null => {
        switch (name) {
            case 'account':
                if (!value.trim()) return '请输入账号';
                return null;

            case 'password':
                if (!value.trim()) return '请输入密码';
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

    /**
     * 表单提交
     * @param e
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("提交")
        // 提交前验证
        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        try {
            console.log('提交找回密码数据:', formData);
            // 这里调用实际的找回密码 API
            await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用

            // 找回密码成功后的处理
            console.log('找回密码成功');
            handleClose();

        } catch (error) {
            console.error('找回密码失败:', error);
            // 设置服务器错误
            setErrors(prev => ({
                ...prev
            }));
        } finally {
            setSubmitting(false);
        }
    };

    // 重置表单
    const resetForm = () => {
        setFormData({
            account: '',
            password: ''
        });
        setErrors({});
    };



    /**
     * 关闭
     */
    const handleClose = () => {
        onClose();
        resetForm(); // 关闭时重置表单
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
                        <div className="flex items-center gap-2">找回密码</div>
                    </Dialog.Title>

                    <Dialog.Description className="mb-4">
                        <div className="form">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* 邮箱字段 */}
                                <Field.Root invalid={!!errors.account}>
                                    <Field.Label className="block text-sm font-medium text-gray-700 mb-1">
                                        账号
                                    </Field.Label>
                                    <Field.Input
                                        value={formData.account}
                                        onChange={handleInputChange('account')}
                                        placeholder="your account"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-border-color-focus"
                                    />
                                    <div className="h-4">
                                        <Field.ErrorText className="text-red-500 text-xs mt-1">
                                            {errors.account?.message}
                                        </Field.ErrorText>
                                    </div>
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-border-color-focus"
                                    />
                                    <div className="h-4">
                                        <Field.ErrorText className="text-red-500 text-xs mt-1">
                                            {errors.password?.message}
                                        </Field.ErrorText>
                                    </div>
                                </Field.Root>

                                <div className="w-full pt-10">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`px-6 py-2 text-white rounded-lg transition-colors w-full cursor-pointer ${
                                            isSubmitting
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'theme-bg hover:opacity-90'
                                        }`}
                                    >
                                        {isSubmitting ? '找回密码中...' : '找回密码'}
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