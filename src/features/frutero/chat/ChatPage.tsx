import { useState } from 'react'
import { MOCK_PROVEEDORES } from '@/lib/mock-data'
import BottomNav from '@/components/BottomNav'
import CartIcon from '@/components/CartIcon'

interface MensajeMock {
  proveedorId: string
  texto: string
  hora: string
  leido: boolean
}

const MENSAJES_MOCK: MensajeMock[] = [
  { proveedorId: 'p1', texto: '¿Cuántos kilos de naranja necesitas para el lunes?', hora: '22:14', leido: false },
  { proveedorId: 'p2', texto: 'Los tomates de esta semana son de cosecha propia.', hora: '21:05', leido: true },
  { proveedorId: 'p3', texto: 'Perfecto, te los guardo sin problema.', hora: 'Ayer', leido: true },
]

function IconChatEmpty() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function IconChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9,18 15,12 9,6" />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export default function ChatPage() {
  const [busqueda, setBusqueda] = useState('')

  const conversaciones = MOCK_PROVEEDORES.filter((p) =>
    busqueda === '' || p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F7F3', paddingBottom: '80px' }}>
      {/* Cabecera */}
      <div className="sticky top-0 z-40 bg-white px-4 pt-4 pb-3" style={{ boxShadow: '0 1px 0 #E5E7EB' }}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold font-serif" style={{ color: '#222222' }}>
            Chats
          </h1>
          <CartIcon />
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2.5"
          style={{ backgroundColor: '#F8F7F3', border: '1px solid #E5E7EB', borderRadius: 12 }}
        >
          <IconSearch />
          <input
            type="search"
            placeholder="Buscar puesto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: '#222222' }}
          />
        </div>
      </div>

      {conversaciones.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4" style={{ color: '#D1D5DB' }}>
            <IconChatEmpty />
          </div>
          <h2 className="text-lg font-bold font-serif mb-2" style={{ color: '#222222' }}>
            Sin resultados
          </h2>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            No hay puestos que coincidan con tu búsqueda.
          </p>
        </div>
      ) : (
        <div className="bg-white" style={{ borderBottom: '1px solid #E5E7EB' }}>
          {conversaciones.map((proveedor, i) => {
            const mensaje = MENSAJES_MOCK.find((m) => m.proveedorId === proveedor.id)
            const iniciales = proveedor.nombre
              .split(' ')
              .slice(0, 2)
              .map((w) => w[0])
              .join('')
              .toUpperCase()
            const esUltimo = i === conversaciones.length - 1

            return (
              <button
                key={proveedor.id}
                className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-gray-50"
                style={{ borderBottom: esUltimo ? 'none' : '1px solid #F3F4F6' }}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold font-serif"
                    style={{ backgroundColor: '#F0F5F1', color: '#1B3A2A' }}
                  >
                    {iniciales}
                  </div>
                  {mensaje && !mensaje.leido && (
                    <span
                      className="absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                      style={{ backgroundColor: '#F28C28' }}
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-0.5">
                    <p
                      className="text-sm truncate"
                      style={{ color: '#222222', fontWeight: mensaje && !mensaje.leido ? 700 : 500 }}
                    >
                      {proveedor.nombre}
                    </p>
                    {mensaje && (
                      <span className="text-xs ml-2 shrink-0" style={{ color: '#9CA3AF' }}>
                        {mensaje.hora}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-sm truncate"
                    style={{
                      color: mensaje && !mensaje.leido ? '#374151' : '#9CA3AF',
                      fontWeight: mensaje && !mensaje.leido ? 500 : 400,
                    }}
                  >
                    {mensaje?.texto ?? 'Inicia una conversación'}
                  </p>
                </div>

                <span style={{ color: '#D1D5DB' }}>
                  <IconChevron />
                </span>
              </button>
            )
          })}
        </div>
      )}

      <BottomNav />
    </div>
  )
}
