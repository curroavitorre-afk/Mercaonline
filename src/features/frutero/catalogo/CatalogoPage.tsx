import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import CartIcon from '@/components/CartIcon'
import { useBottomNavHeight } from '@/hooks/useBottomNavHeight'
import { useAuthStore } from '@/lib/stores/auth'

interface Puesto {
  id: number
  nombre: string
  especialidad: string
  pabellon: string
  numPuesto: string
  foto: string
  disponibilidad: 'mañana' | 'pocas'
}

const PUESTOS: Puesto[] = [
  {
    id: 1,
    nombre: 'Frutas Macías Vera',
    especialidad: 'Frutas y verduras variadas, cítricos y tropicales',
    pabellon: '',
    numPuesto: '117 · 137',
    foto: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=800&q=90&fit=crop',
    disponibilidad: 'mañana',
  },
  {
    id: 2,
    nombre: 'Frutas Martín Mariscal',
    especialidad: 'Fruta de temporada nacional',
    pabellon: '',
    numPuesto: '113 · 114 · 115 · 116',
    foto: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=90&fit=crop',
    disponibilidad: 'mañana',
  },
  {
    id: 3,
    nombre: 'Hermanos Gallegos e Hijos',
    especialidad: 'Verdura de hoja y hortalizas',
    pabellon: '',
    numPuesto: '111 · 131 · 132 · 133',
    foto: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=90&fit=crop',
    disponibilidad: 'mañana',
  },
  {
    id: 4,
    nombre: 'Importpatata',
    especialidad: 'Patata, cebolla y tubérculos',
    pabellon: '',
    numPuesto: '105 · 106 · 107',
    foto: 'https://images.unsplash.com/photo-1518977676405-d4b5e4c55f8e?w=800&q=90&fit=crop',
    disponibilidad: 'mañana',
  },
  {
    id: 5,
    nombre: 'Frutas del Pino',
    especialidad: 'Plátano de Canarias y fruta tropical importada',
    pabellon: '',
    numPuesto: '139',
    foto: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=800&q=90&fit=crop',
    disponibilidad: 'pocas',
  },
  {
    id: 6,
    nombre: 'Hortifrut Granada',
    especialidad: 'Producto local Granada — verdura de la Vega',
    pabellon: '',
    numPuesto: '101 · 120 · 228-230',
    foto: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=800&q=90&fit=crop',
    disponibilidad: 'mañana',
  },
]

const FILTROS = ['Todos', 'Cítricos', 'Verdura', 'Tropical', 'Hueso', 'Local']

function IconClock() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconLocation() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export default function CatalogoPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const bottomNavHeight = useBottomNavHeight()
  const [busqueda, setBusqueda] = useState('')
  const [filtroActivo, setFiltroActivo] = useState('Todos')

  const puestosFiltrados = PUESTOS.filter((p) =>
    busqueda === '' ||
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.especialidad.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F7F3', paddingBottom: bottomNavHeight }}>
      {/* Saludo */}
      <div className="px-4 pt-5 pb-5" style={{ backgroundColor: '#1B3A2A' }}>
        <h1 className="text-2xl font-bold text-white font-serif mb-1">
          Buenos días, {user?.nombre ?? 'frutero'}
        </h1>
        <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
          ¿Qué necesitas para mañana?
        </p>
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5"
          style={{ backgroundColor: 'rgba(242,140,40,0.15)', borderRadius: 20, border: '1px solid rgba(242,140,40,0.35)' }}
        >
          <span style={{ color: '#F28C28' }}><IconClock /></span>
          <span className="text-xs font-semibold" style={{ color: '#F28C28' }}>
            Haz tu pedido antes de las 23:00
          </span>
        </div>
      </div>

      {/* Cabecera */}
      <div className="sticky top-0 z-40 bg-white px-4 pt-4 pb-3" style={{ boxShadow: '0 1px 0 #E5E7EB' }}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold font-serif" style={{ color: '#222222' }}>
            Puestos del mercado
          </h1>
          <CartIcon />
        </div>

        {/* Buscador */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 mb-3"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12 }}
        >
          <span style={{ color: '#6B7280' }}>
            <IconSearch />
          </span>
          <input
            type="search"
            placeholder="Buscar puestos o productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: '#222222' }}
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {FILTROS.map((f) => {
            const activo = filtroActivo === f
            return (
              <button
                key={f}
                onClick={() => setFiltroActivo(f)}
                className="shrink-0 px-3 py-1.5 text-xs font-medium transition-colors"
                style={{
                  borderRadius: 20,
                  backgroundColor: activo ? '#1B3A2A' : '#F8F7F3',
                  color: activo ? '#FFFFFF' : '#6B7280',
                  border: activo ? 'none' : '1px solid #E5E7EB',
                }}
              >
                {f}
              </button>
            )
          })}
        </div>
      </div>

      {/* Lista de puestos */}
      <div className="px-4 py-4 space-y-4">
        {puestosFiltrados.map((puesto) => (
          <div
            key={puesto.id}
            className="bg-white overflow-hidden"
            style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            {/* Foto */}
            <div className="relative overflow-hidden" style={{ height: 160 }}>
              <img
                src={puesto.foto}
                alt={puesto.nombre}
                className="w-full h-full object-cover"
                style={{ borderRadius: '16px 16px 0 0' }}
              />
              {/* Badge de disponibilidad */}
              <div className="absolute top-3 right-3">
                {puesto.disponibilidad === 'mañana' ? (
                  <span
                    className="text-[11px] font-semibold px-2.5 py-1"
                    style={{ backgroundColor: '#1B3A2A', color: '#FFFFFF', borderRadius: 20 }}
                  >
                    Disponible mañana
                  </span>
                ) : (
                  <span
                    className="text-[11px] font-semibold px-2.5 py-1"
                    style={{ backgroundColor: '#F28C28', color: '#FFFFFF', borderRadius: 20 }}
                  >
                    Pocas unidades
                  </span>
                )}
              </div>
            </div>

            {/* Contenido */}
            <div className="p-4">
              <h2 className="text-lg font-bold font-serif mb-0.5" style={{ color: '#222222' }}>
                {puesto.nombre}
              </h2>
              <p className="text-sm mb-3" style={{ color: '#6B7280' }}>
                {puesto.especialidad}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1" style={{ color: '#6B7280' }}>
                  <IconLocation />
                  <span className="text-xs">Puestos {puesto.numPuesto}</span>
                </div>
                <button
                  onClick={() => navigate(`/app/frutero/catalogo/${puesto.id}`)}
                  className="text-xs font-semibold px-4 py-2 text-white transition-colors"
                  style={{ backgroundColor: '#1B3A2A', borderRadius: 10 }}
                >
                  Ver productos
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
