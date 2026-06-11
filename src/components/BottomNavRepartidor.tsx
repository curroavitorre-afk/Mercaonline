import { NavLink, useLocation } from 'react-router-dom'

function IconTruck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function IconCheckSquare() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

const TABS = [
  { to: '/app/repartidor', label: 'Mi Ruta', Icon: IconTruck, exact: true },
  { to: '/app/repartidor/estado', label: 'Estados', Icon: IconCheckSquare, exact: false },
]

export default function BottomNavRepartidor() {
  const { pathname } = useLocation()

  return (
    <>
      <div style={{ height: '80px' }} />
      <nav
        className="fixed bottom-0 inset-x-0 z-50"
        style={{
          backgroundColor: '#1B3A2A',
          boxShadow: '0 -2px 16px rgba(0,0,0,0.3)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex items-stretch">
          {TABS.map(({ to, label, Icon, exact }) => {
            const isActive = exact ? pathname === to : pathname.startsWith(to)
            return (
              <NavLink key={to} to={to} className="flex-1 block">
                <div
                  className="flex flex-col items-center justify-center gap-0.5 py-3 relative"
                  style={{ color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.4)' }}
                >
                  <Icon />
                  <span className="text-[10px] font-medium tracking-tight">{label}</span>
                  {isActive && (
                    <span
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: '#F28C28' }}
                    />
                  )}
                </div>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </>
  )
}
