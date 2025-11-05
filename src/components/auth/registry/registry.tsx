"use client"

import { Dialog, Field } from "@ark-ui/react";
import { useEffect, useState } from "react";
import IconPlus from "../../icons/icon-plus";
import { ErrorField } from "../../../types/form";
import IconLoading from "../../icons/icon-loading";
import {validateEmail, validateForm, validatePassword, validateSingleField} from "../../../utils/form-handle";
import BlogInput from "../../form/blog-input";
import {CryptoUtils} from "../../../utils/crypto";
import Toast from "../../toast/toast"
import {blogFetch} from "../../../utils/blog-fetch";

interface LoginForm {
    name: string;
    email: string;
    account: string;
    password: string;
}

interface LoginFormError {
    name: ErrorField;
    email: ErrorField;
    password: ErrorField;
    [k:string]: unknown
}
interface Props {
    open: boolean;
    onOpenLogin: () => void;
    updateOpen: (isOpen: boolean) => void
}


export default function Registry({ open, updateOpen, onOpenLogin }: Props) {
    const [isSubmitting, setSubmitting] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastType, setToastType] = useState("info")
    const [registerMsg, setRegisterMsg] = useState('');
    const [errors, setErrors] = useState<Partial<LoginFormError>>({});
    const initFormData = {
        name: '',
        email: '',
        account: '',
        password: '',
    } // 初始表单数据
    const [formData, setFormData] = useState<LoginForm>({...initFormData});

    useEffect(() => {
        if (open) {
            resetForm(); // 打开时重置表单
        }
    }, [open]);

    /**
     * 验证规则
     * @param name
     * @param value
     */
    const validateField = (name: keyof LoginForm, value: string): string | null => {
        switch (name) {
            case 'name':
                if (!value.trim()) return '请输入姓名';
                return null;
            case 'email':
                return validateEmail( value);
            case 'password':
                return validatePassword(value);
            default:
                return null;
        }
    };


    /**
     * 处理输入变化
     * @param field
     */
    const handleInputChange = (field: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // 实时验证（可选，也可以在提交时验证）
        validateSingleField<LoginForm, LoginFormError>({
            name:field,
            value,
            validateField,
            setErrors
        });
    };
    /**
     * 邮箱输入框变化
     */
    const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 根据邮箱生成账号。规则blog_[邮箱后缀]_[邮箱前缀]
        const email = e.target.value;
        const emailFront = email.split('.')[0];
        const emailFrontSplitArr = emailFront.split('@');
        const account = `blog_${emailFrontSplitArr[1]}_${emailFrontSplitArr[0]}`;
            if(emailFrontSplitArr.length > 1 && emailFrontSplitArr[1]){
            setFormData(prev => ({
                ...prev,
                account
            }))
        }else {
            setFormData(prev => ({
                ...prev,
                account: ''
            }))
        }
        handleInputChange('email')(e)
    }

    /**
     * 表单提交
     * @param e
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("提交")
        // 提交前验证
        if (!validateForm<LoginForm, LoginFormError>({
            formData,
            validateField,
            setErrors
        })) {
            return;
        }
        setSubmitting(true);
        console.log('提交注册数据:', formData);
        blogFetch("/api/auth/register",{
            method: 'POST',
            body: JSON.stringify({
                ...formData,
                password: CryptoUtils.md5(formData.password)
            })
        }).then(data => {
            console.log('注册结果 data:', data)
            const { code, message } = data
            setRegisterMsg(message)
            setToastType(code === 200 ? "success" : "error")
            setToastOpen(true)
            if(code === 200){
                handleClose();
            }
        }).catch( error => {
            console.error('注册失败:', error);
            setToastType("error")
            setRegisterMsg(error)
            setToastOpen(true)
        }).finally(() => {
            setSubmitting(false);
        })
    };

    // 重置表单
    const resetForm = () => {
        setFormData({...initFormData});
        setErrors({});
    };



    /**
     * 关闭
     */
    const handleClose = () => {
        updateOpen(false);
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
                        <div className="flex items-center gap-2">注册</div>
                    </Dialog.Title>

                    <Dialog.Description className="mb-4">
                        <div className="form">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* 邮箱字段 */}
                                <Field.Root invalid={!!errors.name}>
                                    <Field.Label className="block text-sm font-medium text-gray-700 mb-1">
                                        姓名
                                    </Field.Label>
                                    <BlogInput
                                        value={formData.name}
                                        placeholder="your name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-border-color-focus input-placeholder"
                                        onChange={handleInputChange('name')}
                                        onClear={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                name: ''
                                            }))
                                        }}
                                    />
                                    <div className="h-4">
                                        <Field.ErrorText className="text-red-500 text-xs mt-1">
                                            {errors.name?.message}
                                        </Field.ErrorText>
                                    </div>
                                </Field.Root>

                                {/* 邮箱字段 */}
                                <Field.Root invalid={!!errors.email}>
                                    <Field.Label className="block text-sm font-medium text-gray-700 mb-1">
                                        邮箱
                                    </Field.Label>
                                    <BlogInput
                                        type="email"
                                        value={formData.email}
                                        placeholder="your email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-border-color-focus input-placeholder"
                                        onChange={emailChange}
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
                                <Field.Root>
                                    <Field.Label className="block text-sm font-medium text-gray-700 mb-1">
                                        账号
                                    </Field.Label>
                                    <span className="w-full px-3 py-2">{formData.account}</span>
                                </Field.Root>
                                <Field.Root invalid={!!errors.password}>
                                    <Field.Label className="block text-sm font-medium text-gray-700 mb-1 ">
                                        密码
                                    </Field.Label>
                                    <BlogInput    type="password"
                                                  value={formData.password}
                                                  onChange={handleInputChange('password')}
                                                  placeholder="your password"
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-border-color-focus input-placeholder"
                                                  onClear={() => {
                                                      setFormData(prev => ({
                                                          ...prev,
                                                          password: ''
                                                      }))
                                                  }}
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
                                                ? 'theme-bg'
                                                : 'theme-bg hover:opacity-90'
                                        }`}
                                    >
                                        {isSubmitting ? <span className={"flex items-center justify-center gap-2"}>
                                            <IconLoading color={"white"} width={20} height={20} />
                                            注册中...
                                        </span> : '注册'}
                                    </button>
                                </div>
                                <div className={" flex justify-between"}>
                                    <button type={"button"}
                                            className={"cursor-pointer theme-color-hover text-sm"}
                                            onClick={onOpenLogin}
                                    >已有账号，去登录</button>
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
        <Toast open={toastOpen} msg={registerMsg} type={toastType} onClose={() => setToastOpen(false)} />
    </>
}