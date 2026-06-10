// TODO: cargar proveedores desde api.getProveedores() y listar productos por puesto
export default function CatalogoPage() {
  return (
    <main className="flex flex-col gap-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Puestos del mercado</h1>
      <p className="text-sm text-gray-500">
        Añade productos de varios puestos a tu pedido. Se envían juntos en una sola entrega.
      </p>

      {/* TODO: lista de ProveedorCard con sus productos */}
      <div className="flex flex-col gap-3">
        <div className="rounded-xl border border-gray-200 p-4 text-gray-400 text-sm">
          Cargando puestos…
        </div>
      </div>
    </main>
  )
}
