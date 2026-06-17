import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, type ReactNode } from 'react'

// ─── Animación de entrada por scroll ─────────────────────────────────────────

interface FadeInProps {
  children: ReactNode
  delay?: number
  className?: string
  translateY?: number
}

function FadeIn({ children, delay = 0, className = '', translateY = 18 }: FadeInProps) {
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
        transform: `translateY(${translateY}px)`,
        transition: `opacity 0.65s ease-out ${delay}ms, transform 0.65s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Iconos SVG ───────────────────────────────────────────────────────────────

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12" />
    </svg>
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

// ─── Logo de marca ────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 2 }}>
      <span
        style={{
          fontFamily: 'Fraunces, serif',
          fontWeight: 900,
          fontSize: 18,
          color: 'white',
          letterSpacing: '-0.01em',
        }}
      >
        MERCA
      </span>
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: 9,
          color: '#6F9E7B',
          letterSpacing: '0.22em',
          textTransform: 'uppercase' as const,
        }}
      >
        ONLINE
      </span>
    </div>
  )
}

// ─── Camión animado ───────────────────────────────────────────────────────────

function TruckSVG() {
  return (
    <svg width="220" height="80" viewBox="0 0 220 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="80" y="20" width="118" height="44" rx="4" fill="#2D5A41" />
      <rect x="14" y="16" width="70" height="48" rx="6" fill="#3D7055" />
      <rect x="28" y="24" width="36" height="22" rx="4" fill="#A7D4BC" opacity="0.55" />
      <rect x="9" y="40" width="8" height="5" rx="2" fill="#F28C28" />
      <rect x="9" y="46" width="10" height="3" rx="1" fill="#4A8A62" />
      <line x1="80" y1="20" x2="80" y2="64" stroke="#1B3A2A" strokeWidth="1.5" />
      <circle cx="40" cy="70" r="13" fill="#0D1F17" />
      <circle cx="40" cy="70" r="6" fill="#2D5A41" />
      <circle cx="170" cy="70" r="13" fill="#0D1F17" />
      <circle cx="170" cy="70" r="6" fill="#2D5A41" />
    </svg>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

const HERO_WORDS = ['¿Cansado', 'de', 'levantarte', 'cada', 'día', 'a', 'las', '04:00?']
const HERO_ORANGE = new Set(['cada', 'día', 'a', 'las', '04:00?'])

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col">
      {/* ── Keyframes ─────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes wordAppear {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes truckDrive {
          from { transform: translateX(110vw); }
          to   { transform: translateX(-110vw); }
        }
      `}</style>

      {/* ── S1: HERO (100vh, navbar integrado) ───────────────────────────── */}
      <section
        className="relative flex flex-col"
        style={{
          height: '100vh',
          backgroundImage: 'url(https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(27,58,42,0.85)' }} />

        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-5">
          <Logo />
          <Link
            to="/login"
            className="text-sm font-medium"
            style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif' }}
          >
            Entrar →
          </Link>
        </nav>

        {/* Contenido hero */}
        <div className="relative z-10 flex flex-col justify-center flex-1 px-6 pb-16 max-w-2xl mx-auto w-full">
          <h1
            className="mb-6 leading-none"
            style={{
              fontFamily: 'Clash Display, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(3rem, 11vw, 7.5rem)',
            }}
          >
            {HERO_WORDS.map((word, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  color: HERO_ORANGE.has(word) ? '#F28C28' : 'white',
                  marginRight: '0.25em',
                  animation: 'wordAppear 0.65s ease-out both',
                  animationDelay: `${i * 0.09}s`,
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          <p
            className="text-base mb-10"
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'Inter, sans-serif',
              animation: 'wordAppear 0.65s ease-out both',
              animationDelay: '0.85s',
            }}
          >
            MercaOnline lo resuelve.
          </p>

          <div
            style={{
              animation: 'wordAppear 0.65s ease-out both',
              animationDelay: '1s',
            }}
          >
            <button
              onClick={() => navigate('/registro', { state: { role: 'frutero' } })}
              className="inline-flex items-center gap-2 text-white font-semibold px-7 py-4 text-base transition-colors"
              style={{ backgroundColor: '#F28C28', borderRadius: 12, fontFamily: 'Inter, sans-serif' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D97A1E')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F28C28')}
            >
              Quiero dormir más →
            </button>
          </div>
        </div>
      </section>

      {/* ── S2: EL DOLOR ──────────────────────────────────────────────────── */}
      <section className="text-white px-6 py-20 overflow-hidden" style={{ backgroundColor: '#1B3A2A' }}>
        <div className="max-w-xl mx-auto space-y-12">

          <FadeIn>
            <h2
              className="text-3xl sm:text-4xl leading-tight"
              style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: 'white' }}
            >
              Tu jornada empieza cuando la ciudad duerme.
            </h2>
          </FadeIn>

          <FadeIn delay={80}>
            <div className="space-y-5 text-base leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              <p style={{ color: 'rgba(255,255,255,0.85)' }}>
                El despertador a las 3:30. El frío del coche en mitad de la noche. La lonja a oscuras, el olor a fruta mojada, las carretillas chocando contra el suelo.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                Puesto 3 para las naranjas. Puesto 11 para las peras. Al fondo de todo, si quedan, los plátanos. Cuatro viajes con la carretilla. Negociar el precio a las 4 de la mañana con los ojos medio cerrados.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.35)' }}>
                De vuelta a las 6. Furgoneta cargada, cuerpo cargado. A las 8 colocando el género antes de abrir. Diez horas de pie. Cerrar, cuadrar, repasar el pedido de mañana. Y vuelta a empezar.
              </p>
            </div>
          </FadeIn>

          {/* Animación camión */}
          <FadeIn delay={130}>
            <div className="relative" style={{ height: 96, overflow: 'hidden' }}>
              <div
                style={{
                  position: 'absolute',
                  bottom: 14,
                  animation: 'truckDrive 4s linear infinite',
                }}
              >
                <TruckSVG />
              </div>
              <div
                className="absolute bottom-4 left-0 right-0"
                style={{ height: 2, backgroundColor: 'rgba(111,158,123,0.25)' }}
              />
            </div>
          </FadeIn>

          <FadeIn delay={170}>
            <div className="pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p
                className="text-2xl sm:text-3xl leading-tight"
                style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: 'white' }}
              >
                Llevas años haciéndolo así.
                <br />
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>No tiene que seguir siendo así.</span>
              </p>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* ── S3: EL GIRO ───────────────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ backgroundColor: '#F8F7F3' }}>
        <div className="max-w-xl mx-auto">
          <FadeIn>
            <h2
              className="text-3xl sm:text-4xl leading-tight mb-4"
              style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, color: '#1B3A2A' }}
            >
              ¿Y si tu pedido{' '}
              <span style={{ color: '#F28C28' }}>llegara solo?</span>
            </h2>
            <p
              className="text-base leading-relaxed mb-12"
              style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}
            >
              La noche anterior, desde el sofá, haces tu pedido de todos los puestos en un único carrito. Sin madrugar, sin carretillas, sin furgoneta.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <PhoneMockup />
          </FadeIn>
        </div>
      </section>

      {/* ── S4: CÓMO FUNCIONA ─────────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-xl mx-auto">
          <FadeIn>
            <h2
              className="text-3xl sm:text-4xl leading-tight mb-16"
              style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#222222' }}
            >
              Simple por diseño.
            </h2>
          </FadeIn>

          <div className="relative">
            <div
              className="absolute top-10 bottom-10"
              style={{ left: 20, width: 2, backgroundColor: '#6F9E7B', opacity: 0.35 }}
            />

            <div className="space-y-12">
              {([
                {
                  num: '1',
                  title: 'Noche anterior',
                  desc: 'Abre la app. Elige lo que necesitas de cada puesto. Un solo carrito.',
                },
                {
                  num: '2',
                  title: 'Antes del amanecer',
                  desc: 'Tu pedido se prepara en cada puesto exactamente como lo pediste.',
                },
                {
                  num: '3',
                  title: 'Al abrir tu tienda',
                  desc: 'Todo listo. Sin haber madrugado.',
                },
              ] as const).map((step, i) => (
                <FadeIn key={step.num} delay={i * 150} translateY={30}>
                  <div className="flex gap-6">
                    <div
                      className="shrink-0 w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm z-10"
                      style={{ backgroundColor: '#F28C28' }}
                    >
                      {step.num}
                    </div>
                    <div className="pt-1.5">
                      <h3
                        className="text-xl mb-2"
                        style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#222222' }}
                      >
                        {step.title}
                      </h3>
                      <p
                        className="text-base leading-relaxed"
                        style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}
                      >
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
      <section className="px-6 py-24" style={{ backgroundColor: '#F8F7F3' }}>
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <h2
              className="leading-none mb-8"
              style={{
                fontFamily: 'Clash Display, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(80px, 15vw, 140px)',
                lineHeight: 0.92,
              }}
            >
              <span style={{ color: '#1B3A2A', display: 'block' }}>Descansa</span>
              <span style={{ color: '#F28C28', display: 'block' }}>con MercaOnline.</span>
            </h2>
            <p
              className="text-lg sm:text-xl leading-relaxed"
              style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif', maxWidth: 380 }}
            >
              Sin alarma a las 3.
              <br />
              Sin frío. Sin prisas.
              <br />
              Tu género ya está.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── S6: PARA PUESTOS ──────────────────────────────────────────────── */}
      <section className="text-white px-6 py-16" style={{ backgroundColor: '#1B3A2A' }}>
        <div className="max-w-xl mx-auto">
          <FadeIn>
            <h2
              className="text-2xl sm:text-3xl leading-snug mb-4"
              style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: 'white' }}
            >
              ¿Tienes un puesto en Mercagranada?
            </h2>
            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter, sans-serif' }}
            >
              Sube tu stock del día siguiente.
              Menos merma. Pedidos confirmados
              antes de que llegue el género.
            </p>
          </FadeIn>

          <FadeIn delay={80}>
            <div className="space-y-4 mb-8">
              {[
                'Gestiona tu catálogo desde el móvil',
                'Pedidos confirmados la noche anterior',
                'Menos merma. Más previsibilidad.',
              ].map((texto) => (
                <div key={texto} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5" style={{ color: '#6F9E7B' }}>
                    <IconCheck />
                  </span>
                  <p
                    className="text-sm leading-snug"
                    style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif' }}
                  >
                    {texto}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={140}>
            <button
              onClick={() => navigate('/registro', { state: { role: 'proveedor' } })}
              className="font-semibold px-7 py-4 transition-colors text-base"
              style={{
                border: '1.5px solid white',
                color: 'white',
                backgroundColor: 'transparent',
                borderRadius: 12,
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Registra tu puesto →
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ── S7: CTA FINAL ─────────────────────────────────────────────────── */}
      <section
        className="text-white px-6 py-24"
        style={{ background: 'linear-gradient(to bottom, #1B3A2A, #0A1510)' }}
      >
        <div className="max-w-xl mx-auto text-center">
          <FadeIn>
            <h2
              className="leading-tight mb-4"
              style={{
                fontFamily: 'Clash Display, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(2.5rem, 9vw, 4.5rem)',
                color: 'white',
              }}
            >
              Empieza esta noche.
            </h2>
            <p
              className="text-base mb-10"
              style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter, sans-serif' }}
            >
              Tu primer pedido, sin complicaciones.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/registro?rol=frutero')}
                className="text-white font-semibold px-7 py-4 transition-colors text-base"
                style={{ backgroundColor: '#F28C28', borderRadius: 12, fontFamily: 'Inter, sans-serif' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D97A1E')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F28C28')}
              >
                Soy frutero
              </button>
              <button
                onClick={() => navigate('/registro?rol=proveedor')}
                className="font-semibold px-7 py-4 transition-colors text-base"
                style={{
                  border: '1.5px solid white',
                  color: 'white',
                  backgroundColor: 'transparent',
                  borderRadius: 12,
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Tengo un puesto
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-8 text-center" style={{ backgroundColor: '#0A1510' }}>
        <div className="flex justify-center mb-3">
          <Logo />
        </div>
        <p
          className="text-xs"
          style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter, sans-serif' }}
        >
          © 2025 MercaOnline · Granada
        </p>
      </footer>
    </div>
  )
}
