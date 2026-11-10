import { useState } from 'react'
import type { ReactNode } from 'react'
import type { IconType } from 'react-icons'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa'
import { useSettings } from '../../context/SettingsContext'

export const inputClass =
  'w-full min-w-0 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-violet-400 dark:placeholder:text-violet-300/50'

/** صندوق حقل بأيقونة على الجنب + رسالة الخطأ تحته */
export default function AuthField({
  icon: Icon,
  error,
  children,
}: {
  icon: IconType
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <div
        className={`flex items-stretch overflow-hidden rounded-xl border bg-violet-50/70 transition-shadow focus-within:ring-2 focus-within:ring-violet-500
        dark:bg-white/5 ${error ? 'border-red-400' : 'border-violet-200 dark:border-violet-400/20'}`}
      >
        <span className="flex w-12 shrink-0 items-center justify-center border-e border-violet-200 bg-violet-100/60 text-violet-700 dark:border-violet-400/20 dark:bg-white/5 dark:text-violet-300">
          <Icon />
        </span>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      {error && <p className="mt-1 px-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

/** حقل باسورد فيه زرار إظهار/إخفاء */
export function PasswordField({
  id,
  placeholder,
  autoComplete,
  error,
  registration,
}: {
  id: string
  placeholder: string
  autoComplete: 'current-password' | 'new-password'
  error?: string
  registration: UseFormRegisterReturn
}) {
  const { t } = useSettings()
  const [show, setShow] = useState(false)

  return (
    <AuthField icon={FaLock} error={error}>
      <div className="flex items-center">
        <input
          {...registration}
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-label={placeholder}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? t('hidePassword') : t('showPassword')}
          title={show ? t('hidePassword') : t('showPassword')}
          className="px-3 text-violet-500 hover:text-violet-700 dark:text-violet-300 cursor-pointer"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </AuthField>
  )
}

/** رسالة نجاح / خطأ جوه الكارت */
export function StatusBanner({ status }: { status: { type: 'success' | 'error'; text: string } | null }) {
  if (!status) return null
  return (
    <p
      role="alert"
      className={`rounded-xl px-4 py-3 text-sm font-medium ${
        status.type === 'success'
          ? 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300'
          : 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300'
      }`}
    >
      {status.text}
    </p>
  )
}
