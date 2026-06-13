import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react'

// ─── Animación de entrada por scroll ─────────────────────────────────────────

interface FadeInProps {
  children: ReactNode
  delay?: number
  className?: string
}

function FadeIn({ children, delay = 0, className = '' }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: 'translateY(18px)',
        transition: `opacity 0.65s ease-out ${delay}ms, transform 0.65s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Iconos SVG ───────────────────────────────────────────────────────────────

function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  )
}

function IconMoon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function IconPackage() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  )
}

function IconKey() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  )
}

function IconSleep() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 7l-10 10" />
      <path d="M8 7h9v4" />
      <path d="M7 17h9v-4" />
    </svg>
  )
}

function IconSun() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="7.05" y2="7.05" />
      <line x1="16.95" y1="16.95" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="7.05" y2="16.95" />
      <line x1="16.95" y1="7.05" x2="19.78" y2="4.22" />
    </svg>
  )
}

function IconHeart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function IconStore() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  )
}

function IconLeaf() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 20.26L5.71 21l1-2.3A4.49 4.49 0 0 0 8 19c8 0 13-8 11-16z" />
      <path d="M3.82 20.26L8 16" />
    </svg>
  )
}

// ─── Línea de tiempo ──────────────────────────────────────────────────────────

const TIMELINE_ITEMS = [
  { time: '03:00', label: 'Despertador', Icon: IconClock },
  { time: '04:00', label: 'Mercagranada', Icon: IconMoon },
  { time: '05:30', label: 'Carga y vuelta', Icon: IconPackage },
  { time: '07:00', label: 'Abrir tienda', Icon: IconKey },
  { time: '15:00', label: 'Cierre', Icon: IconSleep },
]

function Timeline() {
  return (
    <div
      className="overflow-x-auto -mx-6 px-6 pb-2"
      style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as CSSProperties}
    >
      <div className="flex items-start w-max">
        {TIMELINE_ITEMS.map((item, i) => (
          <div key={item.time} className="flex items-start">
            <div className="flex flex-col items-center w-[80px]">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: '#F28C28' }}
              >
                <item.Icon />
              </div>
              <p
                className="text-[11px] font-bold mt-2 tabular-nums"
                style={{ color: '#F28C28' }}
              >
                {item.time}
              </p>
              <p className="text-[10px] mt-0.5 text-center leading-tight px-1" style={{ color: '#9CA3AF' }}>
                {item.label}
              </p>
            </div>
            {i < TIMELINE_ITEMS.length - 1 && (
              <div className="h-px mt-5 shrink-0 w-6" style={{ backgroundColor: '#6F9E7B' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Mockup del móvil ─────────────────────────────────────────────────────────

function PhoneMockup() {
  return (
    <div className="relative mx-auto" style={{ width: 208 }}>
      <div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(111,158,123,0.15)', transform: 'scale(0.8) translateY(10%)' }}
      />

      <div
        className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
        style={{ width: 208, height: 424, backgroundColor: '#1B3A2A', border: '3px solid #2D5A41' }}
      >
        {/* Notch */}
        <div
          className="absolute top-0 inset-x-0 h-7 flex items-end justify-center pb-1 z-20"
          style={{ backgroundColor: '#0F2018' }}
        >
          <div className="w-16 h-4 rounded-b-xl" style={{ backgroundColor: '#1B3A2A' }} />
        </div>

        {/* Pantalla */}
        <div className="absolute inset-0 top-7 flex flex-col" style={{ backgroundColor: '#F8F7F3' }}>
          {/* Topbar */}
          <div className="px-4 py-2.5 flex items-center justify-between" style={{ backgroundColor: '#1B3A2A' }}>
            <span className="text-white text-[11px] font-bold tracking-tight">MercaOnline</span>
            <span className="text-[10px] font-bold" style={{ color: '#F28C28' }}>3 artículos</span>
          </div>

          {/* Carrito preview */}
          <div className="flex-1 overflow-hidden px-3 py-3 space-y-2">
            <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
              Tu pedido de mañana
            </p>

            {[
              { puesto: 'Frutas Macías Vera', items: [{ nombre: 'Naranjas Valencia', qty: '50 kg' }, { nombre: 'Limones', qty: '20 kg' }] },
              { puesto: 'Hortalizas del Sur', items: [{ nombre: 'Tomates rama', qty: '30 kg' }] },
              { puesto: 'Finca Los Arrayanes', items: [{ nombre: 'Melocotones', qty: '15 kg' }] },
            ].map((grupo) => (
              <div key={grupo.puesto} className="bg-white rounded-xl p-2.5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#6F9E7B' }} />
                  <p className="text-[10px] font-bold" style={{ color: '#222222' }}>{grupo.puesto}</p>
                </div>
                <div className="space-y-0.5">
                  {grupo.items.map((item) => (
                    <div key={item.nombre} className="flex justify-between">
                      <span className="text-[9px]" style={{ color: '#6B7280' }}>{item.nombre}</span>
                      <span className="text-[9px] font-semibold" style={{ color: '#222222' }}>{item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Barra de total */}
          <div className="bg-white border-t px-3 py-2.5" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px]" style={{ color: '#6B7280' }}>Total pedido</span>
              <span className="text-[11px] font-bold" style={{ color: '#222222' }}>124,50 €</span>
            </div>
            <div className="rounded-lg py-2 text-center" style={{ backgroundColor: '#F28C28' }}>
              <span className="text-white text-[10px] font-bold">Confirmar para mañana</span>
            </div>
          </div>
        </div>

        {/* Indicador home */}
        <div className="absolute bottom-1.5 inset-x-0 flex justify-center z-20">
          <div className="w-16 h-1 rounded-full" style={{ backgroundColor: '#2D5A41' }} />
        </div>
      </div>
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col">
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 backdrop-blur-md"
        style={{ backgroundColor: 'rgba(27,58,42,0.92)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <span className="font-bold text-white text-base tracking-tight font-serif">MercaOnline</span>
        <Link
          to="/login"
          className="text-sm font-medium transition-colors"
          style={{ color: 'rgba(255,255,255,0.7)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
        >
          Entrar →
        </Link>
      </header>

      {/* ── S1: HERO ──────────────────────────────────────────────────────── */}
      <section
        className="min-h-screen flex flex-col justify-center px-6 py-20 text-white relative overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(27,58,42,0.85)' }} />

        <div className="max-w-xl mx-auto w-full relative z-10">
          <FadeIn>
            <p className="text-xs uppercase tracking-widest mb-6" style={{ color: '#6F9E7B', fontFamily: 'var(--font-sans)', letterSpacing: '0.15em' }}>
              Para fruteros de barrio
            </p>
          </FadeIn>

          <FadeIn delay={80}>
            <div className="mb-6">
              <span
                className="font-black text-white leading-none tabular-nums block font-serif"
                style={{ fontSize: 'clamp(5rem, 28vw, 7.5rem)', fontWeight: 900 }}
              >
                04:00
              </span>
              <span className="block text-lg mt-1 font-light" style={{ color: 'rgba(255,255,255,0.55)' }}>
                de la mañana.
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={180}>
            <h1 className="text-2xl sm:text-3xl font-bold leading-snug text-white mb-4 font-serif">
              Llevas 12 horas trabajando.
              <br />
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Y aún no has comido.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={270}>
            <p className="text-base leading-relaxed mb-10 max-w-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Los fruteros de barrio se levantan antes del amanecer cada día para ir a Mercagranada.
              MercaOnline lo cambia.
            </p>
          </FadeIn>

          <FadeIn delay={360}>
            <button
              onClick={() => navigate('/registro', { state: { role: 'frutero' } })}
              className="inline-flex items-center gap-2 text-white font-semibold px-7 py-4 transition-colors text-base"
              style={{ backgroundColor: '#F28C28', borderRadius: 12 }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D97A1E')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F28C28')}
            >
              Quiero dormir más
              <span aria-hidden>→</span>
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ── S2: EL DOLOR ──────────────────────────────────────────────────── */}
      <section className="text-white px-6 py-20" style={{ backgroundColor: '#1B3A2A' }}>
        <div className="max-w-xl mx-auto space-y-10">
          <FadeIn>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#6F9E7B', letterSpacing: '0.15em' }}>
              Cada día. Todos los días.
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold leading-snug font-serif">
              Tu jornada empieza
              <br />
              cuando la ciudad duerme.
            </h2>
          </FadeIn>

          <FadeIn delay={80}>
            <div className="space-y-4 text-base leading-relaxed">
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                El despertador a las 3. El frío del coche, la lonja medio a oscuras.
                Puesto 3 para las naranjas, puesto 11 para las peras,
                al fondo para los plátanos si quedan.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.55)' }}>
                Carretilla. Furgoneta. El atasco de vuelta.
                Y a las 8 ya tienes que estar colocando el género antes de abrir.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.35)' }}>
                Diez horas de pie atendiendo. Cerrar, cuadrar, repasar el pedido de mañana.
                Y a empezar otra vez.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold mb-5" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>
                Tu día, en números
              </p>
              <Timeline />
            </div>
          </FadeIn>

          <FadeIn delay={160}>
            <div className="pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-xl font-bold text-white leading-snug font-serif">
                Llevas años haciéndolo así.
                <br />
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>No tiene que seguir siendo así.</span>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── S3: EL GIRO ───────────────────────────────────────────────────── */}
      <section className="text-white px-6 py-20" style={{ backgroundColor: '#152D20' }}>
        <div className="max-w-xl mx-auto">
          <FadeIn>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#6F9E7B', letterSpacing: '0.15em' }}>
              La idea es sencilla
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold leading-snug mb-4 font-serif">
              ¿Y si tu pedido
              <br />
              <span style={{ color: '#6F9E7B' }}>llegara solo?</span>
            </h2>
            <p className="text-base leading-relaxed mb-12" style={{ color: 'rgba(255,255,255,0.65)' }}>
              La noche anterior, desde el sofá, eliges lo que necesitas de cada puesto
              en un único carrito. Nosotros lo recogemos. Tú abres la tienda con todo listo.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <PhoneMockup />
          </FadeIn>
        </div>
      </section>

      {/* ── S4: CÓMO FUNCIONA ─────────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ backgroundColor: '#F8F7F3' }}>
        <div className="max-w-xl mx-auto">
          <FadeIn>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#6B7280', letterSpacing: '0.15em' }}>
              Tres pasos
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-14 font-serif" style={{ color: '#222222' }}>
              Simple por diseño.
            </h2>
          </FadeIn>

          <div className="relative">
            <div className="absolute left-5 top-10 bottom-10 w-px" style={{ backgroundColor: '#E5E7EB' }} />

            <div className="space-y-10">
              {[
                {
                  num: '1',
                  sub: 'La noche anterior',
                  title: 'Haz tu pedido en 5 minutos',
                  desc: 'Elige productos de todos los puestos en un único carrito. Sin llamadas. Sin notas de papel. Sin madrugar.',
                  accent: false,
                },
                {
                  num: '2',
                  sub: 'A las 4AM',
                  title: 'Nuestro repartidor recoge en Mercagranada',
                  desc: 'Mientras tú duermes, nuestro equipo pasa por cada puesto y recoge exactamente lo que pediste.',
                  accent: false,
                },
                {
                  num: '3',
                  sub: 'A las 7AM',
                  title: 'Tu género en la puerta antes de abrir',
                  desc: 'Llegas a tu tienda, lo encuentras todo. Fresco. Solo queda colocarlo y levantar la persiana.',
                  accent: true,
                },
              ].map((step, i) => (
                <FadeIn key={step.num} delay={i * 100}>
                  <div className="flex gap-5">
                    <div
                      className="shrink-0 w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm z-10"
                      style={{ backgroundColor: step.accent ? '#F28C28' : '#1B3A2A' }}
                    >
                      {step.num}
                    </div>
                    <div className="pt-1">
                      <p className="text-xs font-mono mb-1" style={{ color: '#6B7280' }}>{step.sub}</p>
                      <h3 className="font-bold text-lg mb-1.5 font-serif" style={{ color: '#222222' }}>
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── S5: EL RESULTADO ──────────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ backgroundColor: '#F8F7F3' }}>
        <div className="max-w-xl mx-auto">
          <FadeIn>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#F28C28', letterSpacing: '0.15em' }}>
              A partir de ahora
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 font-serif" style={{ color: '#222222' }}>
              Tu mañana, por fin.
            </h2>
            <p className="text-base leading-relaxed mb-10" style={{ color: '#6B7280' }}>
              Desayuna tranquilo. Lleva a los niños al cole.
              Llega descansado a tu tienda. Tu género ya está ahí.
            </p>
          </FadeIn>

          <div className="space-y-4">
            {[
              { Icon: IconSun, title: 'Te despiertas a las 7', desc: 'Sin alarma a las 3. Sin prisa. El primer café como debe ser.' },
              { Icon: IconHeart, title: 'Tiempo para lo que importa', desc: 'Los niños al cole, un rato de tranquilidad. Cosas que antes no existían.' },
              { Icon: IconStore, title: 'Abres. El género ya está.', desc: 'Todo lo que pediste anoche, en la puerta. Fresco. Completo.' },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 80}>
                <div
                  className="flex items-start gap-4 bg-white p-5"
                  style={{ borderRadius: 16, border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                >
                  <div
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#FEF0DC', color: '#F28C28' }}
                  >
                    <item.Icon />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#222222' }}>{item.title}</p>
                    <p className="text-sm mt-0.5 leading-snug" style={{ color: '#6B7280' }}>{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={260}>
            <div className="mt-10">
              <button
                onClick={() => navigate('/registro', { state: { role: 'frutero' } })}
                className="w-full text-white font-semibold px-7 py-4 transition-colors text-base"
                style={{ backgroundColor: '#F28C28', borderRadius: 12 }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D97A1E')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F28C28')}
              >
                Quiero dormir más →
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SEPARADOR ─────────────────────────────────────────────────────── */}
      <div className="h-px" style={{ backgroundColor: 'rgba(27,58,42,0.15)' }} />

      {/* ── S6: PARA PUESTOS ──────────────────────────────────────────────── */}
      <section className="text-white px-6 py-16" style={{ backgroundColor: '#1B3A2A' }}>
        <div className="max-w-xl mx-auto">
          <FadeIn>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#6F9E7B', letterSpacing: '0.15em' }}>
              Para los puestos de la lonja
            </p>
            <h2 className="text-2xl font-bold leading-snug mb-4 font-serif">
              ¿Tienes un puesto
              <br />
              en Mercagranada?
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Sube tu stock del día siguiente y vende lo que ya sabes que tienes.
              Menos merma. Más previsibilidad.
              Pedidos confirmados antes de que llegue el género.
            </p>
          </FadeIn>

          <FadeIn delay={80}>
            <div className="space-y-3 mb-8">
              {[
                'Gestiona tu catálogo desde el móvil. Precios y stock en tiempo real.',
                'Pedidos confirmados la noche anterior. Sabes exactamente qué preparar.',
                'Menos merma. Menos sorpresas. Más rentabilidad.',
              ].map((texto) => (
                <div key={texto} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5" style={{ color: '#6F9E7B' }}>
                    <IconCheck />
                  </span>
                  <p className="text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.8)' }}>{texto}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={140}>
            <button
              onClick={() => navigate('/registro', { state: { role: 'proveedor' } })}
              className="w-full text-white font-semibold px-7 py-4 transition-colors text-base"
              style={{ backgroundColor: '#F28C28', borderRadius: 12 }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D97A1E')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F28C28')}
            >
              Registra tu puesto →
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ── S7: CTA FINAL ─────────────────────────────────────────────────── */}
      <section className="text-white px-6 py-20" style={{ backgroundColor: '#1B3A2A' }}>
        <div className="max-w-xl mx-auto text-center">
          <FadeIn>
            <div className="flex justify-center mb-5" style={{ color: '#6F9E7B' }}>
              <IconLeaf />
            </div>
            <h2 className="text-3xl font-bold mb-2 font-serif">
              El primer envío es gratis.
            </h2>
            <p className="text-lg mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Sin permanencia. Sin complicaciones.
            </p>
            <p className="text-sm mb-10" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Cancela cuando quieras.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/registro', { state: { role: 'frutero' } })}
                className="text-white font-semibold px-7 py-4 transition-colors text-base"
                style={{ backgroundColor: '#F28C28', borderRadius: 12 }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D97A1E')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F28C28')}
              >
                Soy frutero — empezar gratis
              </button>
              <button
                onClick={() => navigate('/registro', { state: { role: 'proveedor' } })}
                className="font-semibold px-7 py-4 transition-colors text-base"
                style={{
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'rgba(255,255,255,0.7)',
                  backgroundColor: 'transparent',
                  borderRadius: 12,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                }}
              >
                Tengo un puesto en la lonja
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={160}>
            <p className="mt-8 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="underline transition-colors" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Entra aquí
              </Link>
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
