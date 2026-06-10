import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Producto, Proveedor, OrderLine, SubtotalPorProveedor } from '../types'

const TARIFA_SERVICIO = 4.99 // euros fijos por pedido — TODO: lógica real (% o tramos)

interface CartLine {
  producto: Producto
  proveedor: Proveedor
  cantidad: number
}

interface CartState {
  lineas: CartLine[]

  // Mutaciones
  addLine: (producto: Producto, proveedor: Proveedor, cantidad?: number) => void
  removeLine: (productoId: string) => void
  updateCantidad: (productoId: string, cantidad: number) => void
  clear: () => void

  // Derivados (calculados, no almacenados)
  getSubtotalPorProveedor: () => SubtotalPorProveedor[]
  getSubtotalBruto: () => number
  getTarifaServicio: () => number
  getTotal: () => number
  getTotalLineas: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lineas: [],

      addLine: (producto, proveedor, cantidad = 1) => {
        set((state) => {
          const existente = state.lineas.find((l) => l.producto.id === producto.id)
          if (existente) {
            return {
              lineas: state.lineas.map((l) =>
                l.producto.id === producto.id
                  ? { ...l, cantidad: l.cantidad + cantidad }
                  : l,
              ),
            }
          }
          return { lineas: [...state.lineas, { producto, proveedor, cantidad }] }
        })
      },

      removeLine: (productoId) => {
        set((state) => ({
          lineas: state.lineas.filter((l) => l.producto.id !== productoId),
        }))
      },

      updateCantidad: (productoId, cantidad) => {
        if (cantidad <= 0) {
          get().removeLine(productoId)
          return
        }
        set((state) => ({
          lineas: state.lineas.map((l) =>
            l.producto.id === productoId ? { ...l, cantidad } : l,
          ),
        }))
      },

      clear: () => set({ lineas: [] }),

      getSubtotalPorProveedor: () => {
        const { lineas } = get()
        const map = new Map<string, SubtotalPorProveedor>()

        for (const { producto, proveedor, cantidad } of lineas) {
          const subtotal = producto.precio * cantidad
          const entry = map.get(proveedor.id)

          const line: OrderLine = {
            productoId: producto.id,
            proveedorId: proveedor.id,
            nombreProducto: producto.nombre,
            cantidad,
            precioUnitario: producto.precio,
            subtotal,
          }

          if (entry) {
            entry.subtotal += subtotal
            entry.lineas.push(line)
          } else {
            map.set(proveedor.id, {
              proveedorId: proveedor.id,
              nombreProveedor: proveedor.nombre,
              subtotal,
              lineas: [line],
            })
          }
        }

        return Array.from(map.values())
      },

      getSubtotalBruto: () =>
        get().lineas.reduce((acc, { producto, cantidad }) => acc + producto.precio * cantidad, 0),

      getTarifaServicio: () => (get().lineas.length > 0 ? TARIFA_SERVICIO : 0),

      getTotal: () => get().getSubtotalBruto() + get().getTarifaServicio(),

      getTotalLineas: () => get().lineas.reduce((acc, l) => acc + l.cantidad, 0),
    }),
    {
      name: 'mercafruit-cart',
    },
  ),
)
