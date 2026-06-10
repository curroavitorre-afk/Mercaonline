// TODO: cargar productos del proveedor autenticado (proveedorId = user que tiene role proveedor)
// TODO: CRUD de productos — crear, editar precio, editar stock, activar/desactivar
export default function MiCatalogoPage() {
  return (
    <main className="flex flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Mi catálogo</h1>
        <button
          disabled
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white opacity-50"
        >
          + Producto
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Gestiona tus productos, precios y stock disponible para el próximo pedido.
      </p>

      {/* TODO: lista de ProductoCard editable */}
      <div className="rounded-xl border border-gray-200 p-4 text-gray-400 text-sm">
        Cargando productos…
      </div>
    </main>
  )
}
