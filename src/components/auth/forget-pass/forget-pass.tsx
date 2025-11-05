// "use client"

import { Dialog, Field } from "@ark-ui/react";
import { useEffect, useState } from "react";
import IconPlus from "../../icons/icon-plus";
import { ErrorField } from "../../../types/form";
import BlogInput from "../../form/blog-input";
import {validateEmail} from "../../../utils/form-handle";
import BlogAlert, {AlertConfig} from "../../blog-alert/blog-alert";
import IconLoading from "../../icons/icon-loading";
import {blogFetch} from "../../../utils/blog-fetch";
import {RequestResult} from "../../../types/request";

interface LoginForm {
    email: string;
}

interface LoginFormError {
    email: ErrorField;
}
interface Props {
    open: boolean;
    updateOpen: () => void;
    onOpenLogin: () => void;
}

export default function ForgetPass({ open, updateOpen, onOpenLogin }: Props) {
    const [isSubmitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<LoginFormError>>({});
    const [formData, setFormData] = useState<LoginForm>({
        email: '',
    });
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertConfig, setAlertConfig] = useState<AlertConfig>({
        title: "",
        message: "",
        type: 'warning'
    })

    useEffect(() => {
        if (open) {
            resetForm(); // 打开时重置表单
        }
    }, [open]);

    // 验证规则
    const validateField = (name: keyof LoginForm, value: string): string | null => {
        switch (name) {
            case 'email':
                return validateEmail( value);
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
     * 显示错误信息
     * @param message
     */
    const showError = (message: string) => {
        setAlertConfig({
            title: "找回密码失败",
            message: message,
            type: 'error'
        })
        setAlertOpen(true)
    }
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
        blogFetch("/api/auth/reset-password",{
            method: 'POST',
            body: JSON.stringify({
                ...formData,
            })
        }).then((result) => {
            const { code, message } = result
            if(code === 200){
                handleClose()

                setAlertConfig({
                    title: "密码重置邮件已发送",
                    message,
                    type: 'info'
                })
                setAlertOpen(true)
            } else {
                showError(message)
            }
        }).catch((error) => {
            showError(error)
        }).finally(() => {
            setSubmitting(false);
            resetForm()
        })
    };

    // 重置表单
    const resetForm = () => {
        setFormData({
            email: '',
        });
        setErrors({});
    };


    /**
     * 关闭
     */
    const handleClose = () => {
        updateOpen();
        resetForm(); // 关闭时重置表单
    };


    return <>
        <Dialog.Root open={open}>
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
                            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                                {/* 邮箱字段 */}
                                <Field.Root invalid={!!errors.email}>
                                    <Field.Label className="block text-sm font-medium text-gray-700 mb-1">
                                        邮箱
                                    </Field.Label>
                                    <BlogInput   value={formData.email}
                                                 placeholder="your email"
                                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-border-color-focus input-placeholder"
                                                 onChange={handleInputChange('email')}
                                                 onClear={() => {
                                                     setFormData(prev => ({
                                                         ...prev,
                                                         email: ''
                                                     }))
                                                 }}
                                    />
                                    <div className="h-4">
                                        <Field.ErrorText className="text-red-500 text-xs mt-1">
                                            {errors.email?.message}
                                        </Field.ErrorText>
                                    </div>
                                </Field.Root>

                                <div className="w-full pt-10">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`px-6 h-10 text-white rounded-lg transition-colors w-full cursor-pointer flex justify-center items-center theme-bg hover:opacity-90 ${
                                            isSubmitting ? 'cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {isSubmitting ? <IconLoading width={20} height={20} color={"#fff"}/> : null}
                                        下一步
                                    </button>
                                </div>
                                <div className={"flex justify-between"}>
                                    <button type={"button"}
                                            className={"cursor-pointer theme-color-hover text-sm"}
                                            onClick={onOpenLogin}
                                    >我记得密码，去登录</button>
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
        <BlogAlert  open={alertOpen} updateOpen={setAlertOpen} config={alertConfig} footer={true}/>
    </>
}