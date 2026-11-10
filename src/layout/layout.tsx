import Navbar from './navbar/Navbar'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="app-bg min-h-screen text-[var(--text)] transition-colors">
      <Navbar />
      <Outlet />
    </div>
  )
}
