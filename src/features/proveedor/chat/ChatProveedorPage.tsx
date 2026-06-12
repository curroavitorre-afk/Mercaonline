import { useState, useEffect, useRef, useCallback } from 'react'
import type { RefObject } from 'react'
import { useAuthStore } from '@/lib/stores/auth'
import { getProveedorByUserId, getConversacionesDeProveedor, getMensajes, enviarMensaje } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import type { Mensaje, ConversacionResumen, RoleMensaje } from '@/lib/types'
import BottomNavProveedor from '@/components/BottomNavProveedor'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffH = (now.getTime() - d.getTime()) / 3600000
  if (diffH < 24) return d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
  if (diffH < 48) return 'Ayer'
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short' })
}

function iniciales(nombre: string): string {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,18 9,12 15,6" />
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

function IconChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9,18 15,12 9,6" />
    </svg>
  )
}

function IconSend() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22,2 15,22 11,13 2,9" />
    </svg>
  )
}

function IconChatEmpty() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#E5E7EB" strokeWidth="2.5" />
      <path d="M12 3a9 9 0 0 1 9 9" stroke="#1B3A2A" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

// ─── Burbuja de mensaje ───────────────────────────────────────────────────────

function BurbujaMensaje({ mensaje, miRole }: { mensaje: Mensaje; miRole: RoleMensaje }) {
  if (mensaje.remitenteRole === 'sistema') {
    return (
      <div className="flex justify-center px-4">
        <div
          className="px-4 py-2 text-xs text-center max-w-xs"
          style={{
            backgroundColor: '#F8F7F3',
            color: '#6B7280',
            borderRadius: 10,
            border: '1px solid #E5E7EB',
          }}
        >
          {mensaje.contenido}
        </div>
      </div>
    )
  }

  const esMio = mensaje.remitenteRole === miRole
  return (
    <div className={`flex px-4 ${esMio ? 'justify-end' : 'justify-start'}`}>
      <div
        className="px-4 py-2.5 text-sm max-w-[75%]"
        style={{
          backgroundColor: esMio ? '#1B3A2A' : '#FFFFFF',
          color: esMio ? '#FFFFFF' : '#222222',
          borderRadius: esMio ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}
      >
        <p style={{ wordBreak: 'break-word' }}>{mensaje.contenido}</p>
        <p
          className="text-[10px] mt-1"
          style={{
            color: esMio ? 'rgba(255,255,255,0.55)' : '#9CA3AF',
            textAlign: esMio ? 'right' : 'left',
          }}
        >
          {formatTime(mensaje.createdAt)}
        </p>
      </div>
    </div>
  )
}

// ─── Vista de conversación abierta ────────────────────────────────────────────

interface VistaChatProps {
  conv: ConversacionResumen
  mensajes: Mensaje[]
  cargando: boolean
  texto: string
  enviando: boolean
  onVolver: () => void
  onTextoChange: (v: string) => void
  onEnviar: () => void
  bottomRef: RefObject<HTMLDivElement | null>
}

function VistaChat({ conv, mensajes, cargando, texto, enviando, onVolver, onTextoChange, onEnviar, bottomRef }: VistaChatProps) {
  return (
    <div className="flex flex-col" style={{ height: '100dvh', backgroundColor: '#F8F7F3' }}>
      {/* Cabecera */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-white shrink-0"
        style={{ boxShadow: '0 1px 0 #E5E7EB' }}
      >
        <button
          onClick={onVolver}
          className="flex items-center justify-center w-8 h-8 shrink-0"
          style={{ color: '#222222' }}
        >
          <IconBack />
        </button>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-serif shrink-0"
          style={{ backgroundColor: '#F0F5F1', color: '#1B3A2A' }}
        >
          {iniciales(conv.otroNombre)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate" style={{ color: '#222222' }}>
            {conv.otroNombre}
          </p>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>Fruteria</p>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
        {cargando ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : mensajes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              Aun no hay mensajes
            </p>
          </div>
        ) : (
          mensajes.map((m) => (
            <BurbujaMensaje key={m.id} mensaje={m} miRole="proveedor" />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Barra de entrada */}
      <div
        className="shrink-0 bg-white px-4 py-3 flex items-center gap-3"
        style={{
          boxShadow: '0 -1px 0 #E5E7EB',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        }}
      >
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={texto}
          onChange={(e) => onTextoChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onEnviar()
            }
          }}
          className="flex-1 px-4 py-2.5 text-sm outline-none"
          style={{
            backgroundColor: '#F8F7F3',
            borderRadius: 20,
            border: '1px solid #E5E7EB',
            color: '#222222',
          }}
        />
        <button
          onClick={onEnviar}
          disabled={!texto.trim() || enviando}
          className="w-9 h-9 flex items-center justify-center rounded-full shrink-0 transition-opacity"
          style={{
            backgroundColor: '#1B3A2A',
            opacity: !texto.trim() || enviando ? 0.4 : 1,
          }}
        >
          <IconSend />
        </button>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ChatProveedorPage() {
  const { user } = useAuthStore()
  const [proveedorId, setProveedorId] = useState<string | null>(null)
  const [conversaciones, setConversaciones] = useState<ConversacionResumen[]>([])
  const [conversacionActiva, setConversacionActiva] = useState<ConversacionResumen | null>(null)
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [texto, setTexto] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [cargandoLista, setCargandoLista] = useState(true)
  const [cargandoMensajes, setCargandoMensajes] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Obtiene el proveedorId del usuario actual
  useEffect(() => {
    if (!user) return
    getProveedorByUserId(user.id)
      .then((p) => { if (p) setProveedorId(p.id) })
      .catch(console.error)
  }, [user])

  const cargarConversaciones = useCallback(async () => {
    if (!proveedorId) return
    try {
      const data = await getConversacionesDeProveedor(proveedorId)
      setConversaciones(data)
    } catch (e) {
      console.error(e)
    } finally {
      setCargandoLista(false)
    }
  }, [proveedorId])

  useEffect(() => {
    if (proveedorId) cargarConversaciones()
  }, [proveedorId, cargarConversaciones])

  // Suscripción realtime cuando hay conversación abierta
  useEffect(() => {
    if (!conversacionActiva) return

    const channel = supabase
      .channel(`chat-proveedor:${conversacionActiva.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensajes',
          filter: `conversacion_id=eq.${conversacionActiva.id}`,
        },
        (payload) => {
          const r = payload.new
          const nuevo: Mensaje = {
            id: r.id as string,
            conversacionId: r.conversacion_id as string,
            remitenteId: r.remitente_id as string,
            remitenteRole: r.remitente_role as RoleMensaje,
            contenido: r.contenido as string,
            leido: r.leido as boolean,
            createdAt: r.created_at as string,
          }
          setMensajes((prev) =>
            prev.some((m) => m.id === nuevo.id) ? prev : [...prev, nuevo],
          )
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversacionActiva])

  // Scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  const abrirChat = async (conv: ConversacionResumen) => {
    setConversacionActiva(conv)
    setCargandoMensajes(true)
    try {
      const msgs = await getMensajes(conv.id)
      setMensajes(msgs)
    } finally {
      setCargandoMensajes(false)
    }
  }

  const volverALista = () => {
    setConversacionActiva(null)
    setMensajes([])
    setTexto('')
    cargarConversaciones()
  }

  const handleEnviar = async () => {
    if (!texto.trim() || !conversacionActiva || !user || enviando) return
    const contenido = texto.trim()
    setTexto('')
    setEnviando(true)
    try {
      await enviarMensaje(conversacionActiva.id, user.id, 'proveedor', contenido)
    } catch (e) {
      console.error(e)
      setTexto(contenido)
    } finally {
      setEnviando(false)
    }
  }

  // Vista de conversación abierta
  if (conversacionActiva) {
    return (
      <VistaChat
        conv={conversacionActiva}
        mensajes={mensajes}
        cargando={cargandoMensajes}
        texto={texto}
        enviando={enviando}
        onVolver={volverALista}
        onTextoChange={setTexto}
        onEnviar={handleEnviar}
        bottomRef={bottomRef}
      />
    )
  }

  // Lista de conversaciones
  const filtradas = conversaciones.filter(
    (c) => busqueda === '' || c.otroNombre.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F7F3' }}>
      {/* Cabecera */}
      <div className="sticky top-0 z-40 bg-white px-4 pt-4 pb-3" style={{ boxShadow: '0 1px 0 #E5E7EB' }}>
        <div className="mb-3">
          <h1 className="text-xl font-bold font-serif" style={{ color: '#222222', fontFamily: 'Fraunces, serif' }}>
            Chats
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Mensajes de tus fruiteros</p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2.5"
          style={{ backgroundColor: '#F8F7F3', border: '1px solid #E5E7EB', borderRadius: 12 }}
        >
          <IconSearch />
          <input
            type="search"
            placeholder="Buscar fruteria..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: '#222222' }}
          />
        </div>
      </div>

      {/* Contenido */}
      {cargandoLista ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : filtradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4" style={{ color: '#D1D5DB' }}>
            <IconChatEmpty />
          </div>
          <h2 className="text-lg font-bold font-serif mb-2" style={{ color: '#222222' }}>
            {busqueda ? 'Sin resultados' : 'Sin mensajes'}
          </h2>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            {busqueda
              ? 'No hay fruterias que coincidan con tu busqueda.'
              : 'Cuando un frutero haga un pedido en tu puesto, su mensaje aparecera aqui.'}
          </p>
        </div>
      ) : (
        <div className="bg-white" style={{ borderBottom: '1px solid #E5E7EB' }}>
          {filtradas.map((conv, i) => {
            const esUltimo = i === filtradas.length - 1
            return (
              <button
                key={conv.id}
                className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-gray-50"
                style={{ borderBottom: esUltimo ? 'none' : '1px solid #F3F4F6' }}
                onClick={() => abrirChat(conv)}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold font-serif"
                    style={{ backgroundColor: '#FFF4EB', color: '#F28C28' }}
                  >
                    {iniciales(conv.otroNombre)}
                  </div>
                  {conv.hayNoLeidos && (
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
                      style={{
                        color: '#222222',
                        fontWeight: conv.hayNoLeidos ? 700 : 500,
                      }}
                    >
                      {conv.otroNombre}
                    </p>
                    {conv.ultimoMensaje && (
                      <span className="text-xs ml-2 shrink-0" style={{ color: '#9CA3AF' }}>
                        {formatTime(conv.ultimoMensaje.createdAt)}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-sm truncate"
                    style={{
                      color: conv.hayNoLeidos ? '#374151' : '#9CA3AF',
                      fontWeight: conv.hayNoLeidos ? 500 : 400,
                    }}
                  >
                    {conv.ultimoMensaje?.contenido ?? 'Sin mensajes'}
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

      <BottomNavProveedor />
    </div>
  )
}
