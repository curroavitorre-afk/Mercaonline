import { Link, useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col">
      {/* ── HEADER sticky ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <span className="font-bold text-white text-lg tracking-tight">
          🍊 MercaOnline
        </span>
        <Link
          to="/login"
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Entrar →
        </Link>
      </header>

      {/* ── HERO — son las 4 de la mañana ─────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center px-6 py-20 bg-slate-950 text-white">
        <div className="max-w-xl mx-auto w-full">
          <p className="text-slate-500 text-sm font-mono tracking-widest uppercase mb-8">
            ☆ &nbsp; &nbsp; ☆ &nbsp; &nbsp; ★
          </p>

          <div className="mb-6">
            <span className="text-8xl font-black text-white leading-none tabular-nums">
              4:00
            </span>
            <span className="block text-slate-500 text-xl mt-1 font-light">
              de la mañana.
            </span>
          </div>

          <h1 className="text-3xl font-bold leading-snug text-white mb-4">
            El despertador suena.
            <br />
            <span className="text-slate-400">Otra vez.</span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Mañana es diferente.
          </p>

          <button
            onClick={() => navigate('/registro', { state: { role: 'frutero' } })}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-7 py-4 rounded-2xl transition-colors text-base"
          >
            Empezar gratis
            <span aria-hidden>↓</span>
          </button>
        </div>
      </section>

      {/* ── EL MADRUGÓN — la verdad sin filtros ───────────────────────── */}
      <section className="bg-slate-900 text-white px-6 py-20">
        <div className="max-w-xl mx-auto space-y-8">
          <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">
            Sabemos lo que es
          </p>

          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-slate-300">
              El frío del parking a las 4:30.
            </p>
            <p className="text-slate-300">
              La lonja medio oscura mientras los demás duermen.
            </p>
            <p className="text-slate-300">
              Puesto 3 para las naranjas.{' '}
              <span className="text-slate-500">Puesto 11 para las peras.</span>{' '}
              <span className="text-slate-600">
                Plátanos, al fondo del todo, si quedan.
              </span>
            </p>
            <p className="text-slate-400">
              Carretilla llena. La furgoneta. La vuelta.
              Y a abrir a las nueve como si nada.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <p className="text-2xl font-bold text-white leading-snug">
              Llevas años haciéndolo así.
              <br />
              <span className="text-slate-500">No tiene que seguir siendo así.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── EL GIRO — la pregunta ──────────────────────────────────────── */}
      <section className="bg-slate-800 text-white px-6 py-20">
        <div className="max-w-xl mx-auto">
          <p className="text-4xl font-bold leading-tight mb-6">
            ¿Y si pudieras pedir
            <br />
            <span className="text-green-400">todo lo que necesitas</span>
            <br />
            la noche anterior,
            <br />
            desde casa?
          </p>
          <p className="text-slate-400 text-lg">
            Todos los puestos. Un solo pedido. Una sola entrega.
          </p>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ─────────────────────────────────────────────── */}
      <section className="bg-white text-slate-900 px-6 py-20">
        <div className="max-w-xl mx-auto">
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-3">
            Así funciona
          </p>
          <h2 className="text-3xl font-bold mb-14 text-slate-900">
            Tres pasos.
            <br />
            Sin madrugones.
          </h2>

          <div className="space-y-12">
            {/* Paso 1 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">
                  Pide la noche anterior
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  Elige productos de todos los puestos que necesitas.
                  Naranjas del puesto 3, peras del 11, plátanos del fondo.
                  En un solo pedido, desde el móvil.
                </p>
              </div>
            </div>

            {/* Conector */}
            <div className="ml-5 w-px h-6 bg-slate-200 -my-6" />

            {/* Paso 2 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">
                  Recogemos de madrugada
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  Nuestro repartidor pasa por cada puesto.
                  Recoge tu pedido completo mientras tú duermes.
                  Sin que muevas un dedo.
                </p>
              </div>
            </div>

            {/* Conector */}
            <div className="ml-5 w-px h-6 bg-slate-200 -my-6" />

            {/* Paso 3 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">
                  Tú abres, la fruta ya está
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  Antes de levantar la persiana, tu pedido está en la puerta.
                  Fresco. Completo. Listo para colocar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LA MAÑANA — el resultado ───────────────────────────────────── */}
      <section className="bg-amber-50 text-slate-900 px-6 py-20">
        <div className="max-w-xl mx-auto">
          <p className="text-amber-600 text-xs font-mono uppercase tracking-widest mb-3">
            A partir de ahora
          </p>
          <h2 className="text-3xl font-bold mb-12 text-slate-900">
            Esta mañana es diferente.
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm">
              <span className="text-3xl">☀️</span>
              <div>
                <p className="font-semibold text-slate-900">Te despiertas a las 7</p>
                <p className="text-slate-500 text-sm mt-0.5">
                  Sin alarma a las 3:45. Sin prisa.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm">
              <span className="text-3xl">☕</span>
              <div>
                <p className="font-semibold text-slate-900">Desayunas tranquilo</p>
                <p className="text-slate-500 text-sm mt-0.5">
                  El primer café del día sin prisa.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm">
              <span className="text-3xl">🍊</span>
              <div>
                <p className="font-semibold text-slate-900">Abres. La fruta ya está.</p>
                <p className="text-slate-500 text-sm mt-0.5">
                  Todo lo que pediste la noche anterior, en la puerta.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <button
              onClick={() => navigate('/registro', { state: { role: 'frutero' } })}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white font-semibold px-7 py-4 rounded-2xl transition-colors text-base"
            >
              Quiero dormir hasta las 7 →
            </button>
          </div>
        </div>
      </section>

      {/* ── SEPARADOR ─────────────────────────────────────────────────── */}
      <div className="h-px bg-slate-100" />

      {/* ── SECCIÓN PROVEEDORES ───────────────────────────────────────── */}
      <section className="bg-green-50 text-slate-900 px-6 py-20">
        <div className="max-w-xl mx-auto">
          <p className="text-green-700 text-xs font-mono uppercase tracking-widest mb-3">
            Para los puestos de la lonja
          </p>

          <h2 className="text-3xl font-bold leading-snug mb-5 text-slate-900">
            ¿Tienes un puesto
            <br />
            en Mercagranada?
          </h2>

          <p className="text-slate-600 text-lg leading-relaxed mb-10">
            Tus clientes te buscan cada madrugada.
            Con MercaOnline te encuentran la noche anterior,
            sin que muevas un dedo.
          </p>

          <div className="space-y-4 mb-10">
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg mt-0.5">✓</span>
              <p className="text-slate-700">
                <strong>Gestiona tu catálogo desde el móvil.</strong>{' '}
                Actualiza precios y stock en cualquier momento.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg mt-0.5">✓</span>
              <p className="text-slate-700">
                <strong>Llega a más fruteros.</strong>{' '}
                Los que antes no llegaban a tu puesto, ahora te encuentran.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg mt-0.5">✓</span>
              <p className="text-slate-700">
                <strong>Pedidos confirmados la noche anterior.</strong>{' '}
                Sabes exactamente qué llevar antes de abrir el puesto.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/registro', { state: { role: 'proveedor' } })}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-7 py-4 rounded-2xl transition-colors text-base"
          >
            Registrar mi puesto →
          </button>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────── */}
      <section className="bg-slate-950 text-white px-6 py-20">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-5xl mb-6">🍊</p>
          <h2 className="text-3xl font-bold mb-3">
            MercaOnline
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            La lonja en tu bolsillo.
            <br />
            El madrugón, historia.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/registro', { state: { role: 'frutero' } })}
              className="bg-green-600 hover:bg-green-500 text-white font-semibold px-7 py-4 rounded-2xl transition-colors text-base"
            >
              Soy frutero — empezar gratis
            </button>
            <button
              onClick={() => navigate('/registro', { state: { role: 'proveedor' } })}
              className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold px-7 py-4 rounded-2xl transition-colors text-base"
            >
              Tengo un puesto en la lonja
            </button>
          </div>

          <p className="mt-8 text-slate-600 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-slate-400 hover:text-white underline">
              Entra aquí
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
