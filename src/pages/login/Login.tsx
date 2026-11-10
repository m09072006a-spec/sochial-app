import { useForm } from 'react-hook-form'
import { useContext, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { isAxiosError } from 'axios'
import { Spinner } from '@heroui/react'
import { FaArrowRight, FaEnvelope } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import type { loginType } from './login.type'
import { loginSchema } from '../../schema/login.schema'
import { authCreatedContext } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import AuthShell from '../../components/auth/AuthShell'
import AuthField, { PasswordField, StatusBanner, inputClass } from '../../components/auth/AuthField'

export default function Login() {
  const { t } = useSettings()
  const { addDataToToken } = useContext(authCreatedContext)
  const nav = useNavigate()

  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  })

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function myHandleSubmit(values: loginType) {
    if (loading) return
    setStatus(null)
    setLoading(true)

    try {
      const { data } = await axios.post('https://route-posts.routemisr.com/users/signin', values)

      addDataToToken(data.data.token)
      setStatus({ type: 'success', text: data.message ?? t('loginSuccess') })

      // لازم الفورم يتبعت وبعدها ننتقل، وده اللي بيخلي المتصفح يعرض "Save password?"
      nav('/home')
    } catch (error) {
      const serverMsg = isAxiosError(error) ? error.response?.data?.message : null
      setStatus({ type: 'error', text: typeof serverMsg === 'string' ? serverMsg : t('loginFailed') })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell mode="login" title={t('welcomeBack')}>
      <form onSubmit={handleSubmit(myHandleSubmit)} className="space-y-4" noValidate>
        <AuthField icon={FaEnvelope} error={formState.errors.email?.message}>
          <input
            {...register('email')}
            id="email"
            type="email"
            autoComplete="username"
            inputMode="email"
            placeholder={t('fieldEmail')}
            aria-label={t('fieldEmail')}
            className={inputClass}
          />
        </AuthField>

        <PasswordField
          id="password"
          placeholder={t('fieldPassword')}
          autoComplete="current-password"
          error={formState.errors.password?.message}
          registration={register('password')}
        />

        <StatusBanner status={status} />

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-500 py-3 font-semibold text-white shadow-lg shadow-violet-500/40 transition-opacity disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <Spinner size="sm" color="current" />
          ) : (
            <>
              {t('btnLogin')} <FaArrowRight className="rtl:rotate-180" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  )
}
