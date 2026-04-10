import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tags,
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart2,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

import { useState } from 'react'
import useAuthStore from '../store/AuthStore'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/categories', icon: Tags, label: 'Categories' },
  { to: '/stock-in', icon: ArrowDownToLine, label: 'Stock in' },
  { to: '/stock-out', icon: ArrowUpFromLine, label: 'Stock out' },
  { to: '/reports', icon: BarChart2, label: 'Reports' },
  { to: '/users', icon: Users, label: 'Users', roles: ['admin'] },
]

export default function AppLayout() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const visibleNav = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-100 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-14 flex items-center px-5 border-b border-gray-100">
          <span className="font-medium text-gray-900 text-sm">Inventory</span>
          <span className="ml-1.5 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
            v1
          </span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {visibleNav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-100 p-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
              {user?.name?.[0]?.toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                {user?.role}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-gray-700"
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3">
          <button
            className="lg:hidden text-gray-500"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>

          <span className="text-sm text-gray-500 flex-1">
            Welcome back, {user?.name}
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}