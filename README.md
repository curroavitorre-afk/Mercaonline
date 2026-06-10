# MercaFruit

PWA marketplace para fruteros de Mercagranada. Agrega la compra de un frutero en múltiples puestos de la lonja en un único pedido y una única entrega, antes de que la frutería abra.

## Comandos

```bash
npm run dev       # Servidor de desarrollo → http://localhost:5173
npm run build     # Build de producción
npm run preview   # Previsualiza el build en local
npm run lint      # ESLint
```

## Actores

| Role | Descripción |
|---|---|
| `frutero` | Navega puestos, añade productos de varios puestos al carrito, confirma pedido |
| `proveedor` | Gestiona su catálogo, stock y precios directamente |
| `repartidor` | Recoge en el mercado y entrega (UI pendiente) |
| `admin` | Panel interno (placeholder) |

## Estructura

```
src/
  features/
    landing/          # Página pública
    auth/             # Login por teléfono + Registro con selector de role
    frutero/          # Catálogo de puestos, carrito multi-puesto, pedidos
    proveedor/        # Gestión de catálogo
    admin/            # Placeholder
  components/         # Compartidos (ProtectedRoute)
  lib/
    types.ts          # Modelo de datos TypeScript
    api.ts            # Capa de API (stubs → reemplazar por backend)
    mock-data.ts      # Datos de prueba en memoria
    stores/
      auth.ts         # Zustand: sesión
      cart.ts         # Zustand: carrito multi-proveedor
  routes/
    index.tsx         # React Router config
```

## Modelo de datos

```
User         id · telefono · nombre · role
Proveedor    id · userId · nombre · descripcion · activo
Producto     id · proveedorId · nombre · precio · unidad · stockDisponible · activo
Order        id · fruteroId · estado · lineas[] · tarifaServicio · total
OrderLine    productoId · proveedorId · cantidad · precioUnitario · subtotal
```

**Estados del pedido:** `confirmado → en_recogida → recogido → en_reparto → entregado | incidencia`

## Rutas

| Ruta | Acceso | Pantalla |
|---|---|---|
| `/` | Pública | Landing |
| `/login` | Pública | Login por teléfono |
| `/registro` | Pública | Registro con selector de role |
| `/app/frutero` | `frutero` | Catálogo de puestos |
| `/app/frutero/carrito` | `frutero` | Carrito multi-puesto |
| `/app/frutero/pedidos` | `frutero` | Historial y seguimiento |
| `/app/proveedor` | `proveedor` | Gestión de catálogo |
| `/app/admin` | `admin` | Panel admin (placeholder) |

## TODOs

- [ ] Iconos PWA reales en `public/icons/` (192px, 512px, 512px maskable)
- [ ] Backend real — reemplazar stubs en `src/lib/api.ts`
- [ ] Login real con OTP SMS
- [ ] App del repartidor
- [ ] Split payment en pasarela
- [ ] Chat frutero ↔ dependiente por puesto
- [ ] Asistente IA de pedido
- [ ] Foto del producto a la salida del mercado

## Stack

- React 19 + Vite 8 + TypeScript 6 (strict)
- Tailwind CSS v4
- vite-plugin-pwa (display: standalone)
- React Router v7
- Zustand v5

---

Ver `CLAUDE.md` para el contexto completo del proyecto y convenciones de código.
