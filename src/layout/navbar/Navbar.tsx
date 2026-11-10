import { useContext, useState } from 'react'
import {
  FaHome,
  FaUser,
  FaBell,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { authCreatedContext } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import NotificationsPanel, { useUnreadCount } from '../../components/notifications/NotificationsPanel'

const item =
  'w-11 h-11 rounded-full flex items-center justify-center text-lg cursor-pointer transition-colors hover:bg-[var(--field)]'

export default function Navbar() {
  const { token, removeToken } = useContext(authCreatedContext)
  const { t, theme, toggleTheme, lang, toggleLang } = useSettings()
  const [notifOpen, setNotifOpen] = useState(false)
  const { data: unread = 0 } = useUnreadCount(!!token)

  const links = [
    { key: 'home', icon: FaHome, path: '/home' },
    { key: 'profile', icon: FaUser, path: '/' },
  ] as const

  // className كـ function بتمنع NavLink يضيف كلاس "active" بتاع App.css
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${item} ${isActive ? 'bg-[var(--field)] text-[var(--text)]' : 't-muted'}`

  return (
    <>
    <nav
      className="glass fixed z-50 flex items-center justify-around gap-1 rounded-full p-2 shadow-xl
                 bottom-3 inset-x-4
                 lg:inset-x-auto lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:start-4 lg:flex-col lg:justify-center"
    >
      {links.map(({ key, icon: Icon, path }) => (
        <NavLink key={key} to={path} className={linkClass} aria-label={t(key)} title={t(key)}>
          <Icon />
        </NavLink>
      ))}

      {token && (
        <button
          onClick={() => setNotifOpen((o) => !o)}
          className={`${item} relative ${notifOpen ? 'bg-[var(--field)] text-[var(--text)]' : 't-muted'}`}
          aria-label={t('notifications')}
          title={t('notifications')}
        >
          <FaBell />
          {unread > 0 && (
            <span className="absolute top-1 end-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </button>
      )}

      <span className="hidden lg:block w-6 border-t border-[var(--glass-border)] my-1" />

      <button
        onClick={toggleTheme}
        className={`${item} t-muted`}
        aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')}
        title={theme === 'dark' ? t('lightMode') : t('darkMode')}
      >
        {theme === 'dark' ? <FaSun /> : <FaMoon />}
      </button>

      <button onClick={toggleLang} className={`${item} t-muted text-sm font-bold`} aria-label="Language" title="Language">
        {lang === 'en' ? 'ع' : 'EN'}
      </button>

      {token ? (
        <button onClick={removeToken} className={`${item} text-red-500`} aria-label={t('logout')} title={t('logout')}>
          <FaSignOutAlt />
        </button>
      ) : (
        <>
          <NavLink to="/login" className={linkClass} aria-label={t('login')} title={t('login')}>
            <FaSignInAlt />
          </NavLink>
          <NavLink to="/signup" className={linkClass} aria-label={t('signup')} title={t('signup')}>
            <FaUserPlus />
          </NavLink>
        </>
      )}
    </nav>

    {token && notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
    </>
  )
}
