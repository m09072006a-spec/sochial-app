import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { FaComment, FaHeart, FaMoon, FaSun, FaUserFriends, FaUser, FaUserPlus } from 'react-icons/fa'
import { useSettings } from '../../context/SettingsContext'

export default function AuthShell({
  mode,
  title,
  children,
}: {
  mode: 'login' | 'signup'
  title: string
  children: ReactNode
}) {
  const { t, theme, toggleTheme, lang, toggleLang } = useSettings()

  const tab = (active: boolean) =>
    `flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all ${
      active
        ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/40'
        : 'bg-violet-100 text-violet-900 hover:bg-violet-200 dark:bg-white/10 dark:text-violet-100 dark:hover:bg-white/15'
    }`

  const ctrl =
    'flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 cursor-pointer text-sm font-bold'

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0830] text-white">
      {/* بقع الإضاءة */}
      <div className="pointer-events-none absolute -top-40 -start-40 h-[30rem] w-[30rem] rounded-full bg-violet-600/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -end-32 h-[32rem] w-[32rem] rounded-full bg-indigo-500/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 start-1/3 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" />

      {/* لغة + ثيم */}
      <div className="absolute top-4 end-4 z-10 flex gap-2">
        <button onClick={toggleLang} className={ctrl} aria-label="Language">
          {lang === 'en' ? 'ع' : 'EN'}
        </button>
        <button onClick={toggleTheme} className={ctrl} aria-label="Theme">
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-14 lg:grid-cols-2 lg:gap-12">
        {/* ---------- الجزء الشمال ---------- */}
        <section className="text-center lg:text-start">
          <div className="relative mx-auto h-36 w-36 sm:h-44 sm:w-44 lg:mx-0">
            <div className="absolute inset-4 flex items-center justify-center rounded-[2rem] border border-white/30 bg-gradient-to-br from-indigo-400/50 to-violet-700/80 shadow-[0_0_60px_rgba(139,92,246,0.6)] backdrop-blur">
              <span className="bg-gradient-to-b from-white to-fuchsia-400 bg-clip-text text-6xl font-black text-transparent sm:text-7xl">
                S
              </span>
            </div>
            <div className="absolute inset-x-[-12%] top-1/2 h-14 -translate-y-1/2 -rotate-12 rounded-[50%] border-2 border-fuchsia-400/80 shadow-[0_0_20px_rgba(217,70,239,0.6)]" />
            <span className="absolute -top-1 start-0 flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 shadow-lg">
              <FaUserFriends />
            </span>
            <span className="absolute -top-2 end-0 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 shadow-lg">
              <FaComment />
            </span>
            <span className="absolute -bottom-1 end-2 flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-500 shadow-lg">
              <FaHeart />
            </span>
          </div>

          <p className="mt-6 text-lg font-bold sm:text-2xl">{t('heroBrand')}</p>
          <h1 className="mt-2 text-5xl font-black leading-none sm:text-6xl lg:text-7xl">
            Route
            <span className="block bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              Poste
            </span>
          </h1>
          <p className="mt-6 hidden max-w-lg text-base leading-relaxed text-white/85 lg:block">{t('heroText')}</p>
        </section>

        {/* ---------- الكارت ---------- */}
        <section className="mx-auto w-full max-w-md rounded-3xl bg-white/95 p-5 text-slate-900 shadow-2xl shadow-violet-900/40 backdrop-blur sm:p-7 dark:bg-[#1b1838]/95 dark:text-slate-100 lg:max-w-lg">
          <div className="grid grid-cols-2 gap-3">
            <Link to="/login" className={tab(mode === 'login')}>
              <FaUser /> {t('tabLogin')}
            </Link>
            <Link to="/signup" className={tab(mode === 'signup')}>
              <FaUserPlus /> {t('tabSignup')}
            </Link>
          </div>

          <h2 className="mt-6 text-xl font-bold">{title}</h2>
          <div className="mt-1 mb-5 h-1 w-14 rounded-full bg-violet-600" />

          {children}
        </section>
      </div>
    </div>
  )
}
