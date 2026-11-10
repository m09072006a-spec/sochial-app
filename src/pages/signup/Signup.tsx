import { useForm } from 'react-hook-form'
import { useState } from 'react'
import type { SignUpDataType } from './Signup.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { schema } from '../../schema/signup.schema'
import axios, { isAxiosError } from 'axios'
import { Spinner } from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import { FaArrowRight, FaEnvelope, FaUser, FaUserFriends, FaUserTag } from 'react-icons/fa'
import { useSettings } from '../../context/SettingsContext'
import AuthShell from '../../components/auth/AuthShell'
import AuthField, { PasswordField, StatusBanner, inputClass } from '../../components/auth/AuthField'

export default function SignUp() {
  const { t } = useSettings()
  const nav = useNavigate()

  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      dateOfBirth: '',
      gender: 'null' as SignUpDataType['gender'],
      password: '',
      rePassword: '',
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  })

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const errors = formState.errors

  async function myHandleSubmit(formValues: unknown) {
  const values = formValues as SignUpDataType
    if (loading) return
    setStatus(null)
    setLoading(true)

    try {
      const { data } = await axios.post('https://route-posts.routemisr.com/users/signup', values)

      setStatus({ type: 'success', text: data.message ?? t('signupSuccess') })
      setTimeout(() => nav('/login'), 1500)
    } catch (error) {
      const serverMsg = isAxiosError(error) ? error.response?.data?.message : null
      setStatus({ type: 'error', text: typeof serverMsg === 'string' ? serverMsg : t('signupFailed') })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell mode="signup" title={t('createAccount')}>
      <form onSubmit={handleSubmit(myHandleSubmit)} className="space-y-3" noValidate>
        <AuthField icon={FaUser} error={errors.name?.message}>
          <input
            {...register('name')}
            id="name"
            type="text"
            autoComplete="name"
            placeholder={t('fieldName')}
            aria-label={t('fieldName')}
            className={inputClass}
          />
        </AuthField>

        <AuthField icon={FaUserTag} error={errors.username?.message}>
          <input
            {...register('username')}
            id="username"
            type="text"
            autoComplete="username"
            placeholder={t('fieldUsername')}
            aria-label={t('fieldUsername')}
            className={inputClass}
          />
        </AuthField>

        <AuthField icon={FaEnvelope} error={errors.email?.message}>
          <input
            {...register('email')}
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={t('fieldEmail')}
            aria-label={t('fieldEmail')}
            className={inputClass}
          />
        </AuthField>

        <AuthField icon={FaUser} error={errors.dateOfBirth?.message}>
          <label htmlFor="dateOfBirth" className="block px-3 pt-2 text-xs text-violet-700/80 dark:text-violet-300/80">
            {t('fieldDob')}
          </label>
          <input
            {...register('dateOfBirth')}
            id="dateOfBirth"
            type="date"
            autoComplete="bday"
            className={`${inputClass} pt-1 dark:[color-scheme:dark]`}
          />
        </AuthField>

        <div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1 py-1 text-sm">
            <FaUserFriends className="text-violet-700 dark:text-violet-300" />
            <span className="font-semibold">{t('fieldGender')}</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('gender')} type="radio" value="male" id="male" className="accent-violet-600" />
              {t('fieldMale')}
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('gender')} type="radio" value="female" id="female" className="accent-violet-600" />
              {t('fieldFemale')}
            </label>
          </div>
          {errors.gender?.message && <p className="mt-1 px-1 text-xs text-red-500">{errors.gender.message}</p>}
        </div>

        <PasswordField
          id="password"
          placeholder={t('fieldPassword')}
          autoComplete="new-password"
          error={errors.password?.message}
          registration={register('password')}
        />

        <PasswordField
          id="rePassword"
          placeholder={t('fieldRePassword')}
          autoComplete="new-password"
          error={errors.rePassword?.message}
          registration={register('rePassword')}
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
              {t('btnSignup')} <FaArrowRight className="rtl:rotate-180" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  )
}
