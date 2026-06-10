// TODO: leer useCartStore y mostrar líneas agrupadas por proveedor
export default function CarritoPage() {
  return (
    <main className="flex flex-col gap-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Tu pedido</h1>
      <p className="text-sm text-gray-500">Productos de varios puestos — una sola entrega</p>

      {/* TODO: subtotales por proveedor, tarifa de servicio, total */}
      {/* TODO: botón "Confirmar pedido" → createOrder() */}
      <div className="rounded-xl border border-gray-200 p-4 text-gray-400 text-sm">
        El carrito está vacío
      </div>
    </main>
  )
}
