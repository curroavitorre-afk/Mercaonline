import { NavLink, useLocation } from 'react-router-dom'

function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  )
}

function IconTag() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}

function IconClipboard() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  )
}

function IconPerson() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

const TABS = [
  { to: '/app/proveedor', label: 'Inicio', Icon: IconHome, exact: true },
  { to: '/app/proveedor/catalogo', label: 'Catálogo', Icon: IconTag, exact: false },
  { to: '/app/proveedor/pedidos', label: 'Pedidos', Icon: IconClipboard, exact: false },
  { to: '/app/proveedor/perfil', label: 'Perfil', Icon: IconPerson, exact: false },
]

export default function BottomNavProveedor() {
  const { pathname } = useLocation()

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 bg-white"
      style={{
        boxShadow: '0 -1px 0 rgba(0,0,0,0.06), 0 -4px 16px rgba(0,0,0,0.05)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-stretch">
        {TABS.map(({ to, label, Icon, exact }) => {
          const isActive = exact ? pathname === to : pathname.startsWith(to)
          return (
            <NavLink key={to} to={to} className="flex-1 block">
              <div
                className="flex flex-col items-center justify-center gap-0.5 py-2.5 relative"
                style={{ color: isActive ? '#1B3A2A' : '#9CA3AF' }}
              >
                <Icon />
                <span className="text-[10px] font-medium tracking-tight">{label}</span>
                {isActive && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                    style={{ backgroundColor: '#F28C28' }}
                  />
                )}
              </div>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
