// src/app/auth/update-password/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import BlogInput from "../../../components/form/blog-input";
import IconLoading from "../../../components/icons/icon-loading";
import {ErrorField} from "../../../types/form";
import {validateForm, validatePassword, validateSingleField} from "../../../utils/form-handle";
import {Field} from "@ark-ui/react";
import {CryptoUtils} from "../../../utils/crypto";

interface ResetForm {
  confirmPassword: string;
  password: string;
}

interface ResetFormError {
  confirmPassword: ErrorField;
  password: ErrorField;
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function UpdatePassword() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [pageDisabled, setPageDisabled] = useState(false) // 禁用页面，重置链接失效时使用
  const router = useRouter()
  const [errors, setErrors] = useState<Partial<ResetFormError>>({});
  const [formData, setFormData] = useState<ResetForm>({
    confirmPassword: '',
    password: ''
  });

  useEffect(() => {
    // 检查是否有有效的重置token
    const checkResetToken = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setMessage('重置链接已失效，请重新申请')
        setPageDisabled(true)
      }
    }
    checkResetToken()
  }, [])

  /**
   * 验证规则
   * @param name
   * @param value
   */
  const validateField = (name: keyof ResetForm, value: string): string | null => {
    switch (name) {
      case 'confirmPassword':
        return validatePassword(value, '确认新密码');
      case 'password':
        return validatePassword(value, '新密码');
      default:
        return null;
    }
  };
  /**
   * 处理输入变化
   * @param field
   */
  const handleInputChange = (field: keyof ResetForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // 实时验证（可选，也可以在提交时验证）
    validateSingleField<ResetForm>({
      name:field,
      value,
      validateField,
      setErrors
    });
  }
  /**
   * 提交密码充值
   * @param e
   */
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    // 提交前验证
    if (!validateForm<ResetForm, ResetFormError>({
      formData,
      validateField,
      setErrors
    })) {
      return;
    }
    const { password, confirmPassword } = formData
    if (password !== confirmPassword) {
      setMessage('两次输入的密码不一致')
      return
    }

    setLoading(true)
    setMessage('')
    supabase.auth.updateUser({
      password: CryptoUtils.md5(CryptoUtils.md5(formData.password))
    }).then(({ error }) => {
      if (error) {
        setMessage(`更新密码失败: ${error.message}`)
      } else {
        setMessage('密码更新成功，正在跳转到登录页...')
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  /**
   * 清空字段
   * @param field
   */
  const clearField = (field: keyof ResetForm) => {
    setFormData(prev => ({
      ...prev,
      [field]: ''
    }));
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
    setMessage("")
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              设置新密码
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleUpdatePassword}>
            <Field.Root  invalid={!!errors.password}>
              <BlogInput
                  type="password"
                  value={formData.password}
                  disabled={pageDisabled}
                  onChange={handleInputChange('password')}
                  onClear={() => clearField('password')}
                  placeholder="新密码"
                  className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none theme-border-color-focus"
              />
              <div className="h-4">
                <Field.ErrorText className="text-red-500 text-xs mt-1">
                  {errors.password?.message}
                </Field.ErrorText>
              </div>
            </Field.Root>
            <Field.Root  invalid={!!errors.confirmPassword}>
              <BlogInput
                  type="password"
                  value={formData.confirmPassword}
                  disabled={pageDisabled}
                  onChange={handleInputChange('confirmPassword')}
                  onClear={() => clearField('confirmPassword')}
                  placeholder="确认新密码"
                  className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none theme-border-color-focus"
              />
              <div className="h-4">
                <Field.ErrorText className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword?.message}
                </Field.ErrorText>
              </div>
            </Field.Root>
            <div>
              <button
                  type="submit"
                  disabled={pageDisabled || loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium theme-bg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white cursor-pointer"
              >
                {loading && <IconLoading width={20} height={20} color={"#fff"}/>}
                {loading ? '更新中...' : '更新密码'}
              </button>
            </div>
            <div className={`h-4 flex justify-center items-center text-center ${message.includes('成功') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          </form>
        </div>
      </div>
  )
}