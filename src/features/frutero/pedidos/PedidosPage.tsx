// TODO: cargar pedidos del frutero con api.getOrdersByFrutero(user.id)
export default function PedidosPage() {
  return (
    <main className="flex flex-col gap-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Mis pedidos</h1>

      {/* TODO: lista de OrderCard con estado y seguimiento */}
      {/* TODO: pantalla de detalle de pedido con OrderStatus timeline */}
      {/* TODO: foto del producto a la salida del mercado (futura feature) */}
      <div className="rounded-xl border border-gray-200 p-4 text-gray-400 text-sm">
        No tienes pedidos aún
      </div>
    </main>
  )
}
