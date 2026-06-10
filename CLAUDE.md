# MercaFruit — Contexto para Claude

## Qué es MercaFruit

PWA marketplace que agrega la compra de un frutero en Mercagranada en un único pedido y una única entrega. El frutero pide la noche anterior; el repartidor recoge de todos los puestos de madrugada y entrega antes de que la frutería abra.

**Problema que resuelve:** un frutero necesita productos de 5-10 puestos distintos de la lonja. Hoy lo hace a pie, puesto a puesto. MercaFruit lo hace en un solo pedido digital.

---

## Los 4 actores (`role`)

| Role | Quién es | Qué hace en la app |
|---|---|---|
| `frutero` | Comprador. Dueño de la frutería. | Navega puestos, añade productos de varios puestos a UN carrito, confirma pedido. |
| `proveedor` | Puesto en la lonja (Mercagranada). | Gestiona **directamente** su catálogo, stock y precios. Es el dueño de sus productos. |
| `repartidor` | Recoge en el mercado y entrega. | App **no construida aún** — solo sitio en el modelo de datos. |
| `admin` | Equipo interno. | Placeholder de ruta, sin desarrollar. |

---

## Stack y por qué

| Tecnología | Decisión |
|---|---|
| **React + Vite + TypeScript** | Ecosistema estándar, DX rápida, TypeScript estricto desde el inicio |
| **Tailwind CSS v4** | Mobile-first, sin CSS custom, colores de marca como tokens en `@theme` |
| **vite-plugin-pwa** | `display: standalone` — la app se instala como nativa en iOS/Android |
| **React Router v7** | Enrutado con rutas protegidas por role |
| **Zustand** | Estado global mínimo: auth (persistido) + carrito (persistido) |
| **Sin backend todavía** | Datos mock en memoria (`src/lib/mock-data.ts`), capa API aislada para enchufar backend |

---

## Estructura de carpetas

```
src/
  features/
    landing/          # Página pública de marketing
    auth/             # Login (teléfono) + Registro (selector de role)
    frutero/
      catalogo/       # Lista de puestos y productos
      carrito/        # Carrito multi-puesto
      pedidos/        # Historial y seguimiento
    proveedor/
      catalogo/       # CRUD catálogo del proveedor
    admin/            # Placeholder
  components/         # Componentes compartidos (ProtectedRoute, etc.)
  lib/
    types.ts          # Tipos TypeScript del dominio
    api.ts            # Stubs de API (reemplazar por fetch real)
    mock-data.ts      # Datos de prueba en memoria
    stores/
      auth.ts         # Zustand: sesión de usuario
      cart.ts         # Zustand: carrito multi-proveedor
  routes/
    index.tsx         # createBrowserRouter con todas las rutas
  main.tsx
  App.tsx             # Solo <RouterProvider>
  index.css           # Tailwind @import + tokens @theme
```

---

## Convenciones de código

- **TypeScript estricto** — `strict: true`, `noUncheckedIndexedAccess: true`. Nunca usar `any`.
- **Componentes funcionales** — sin class components.
- **Dominio en español**: `frutero`, `proveedor`, `pedido`, `carrito`, `linea`. Términos técnicos en inglés: `store`, `router`, `handler`, `props`.
- **Props tipadas** — siempre `interface Props { ... }` explícita, nunca inferida de `React.FC`.
- **Sin comentarios de código obvios** — solo cuando el WHY no es obvio.
- **Imports con alias `@/`** — `import X from '@/lib/types'` nunca `'../../../lib/types'`.

---

## Estilo visual

- **Tailwind mobile-first** — breakpoints de menor a mayor. La app está diseñada para móvil (PWA standalone).
- **Color de marca**: `brand-600` (`#16a34a`) definido en `@theme` de `index.css`.
- **Safe area iOS**: `padding-bottom: env(safe-area-inset-bottom)` en `body`.
- Sin librerías de componentes por ahora — HTML semántico + Tailwind.

---

## Auth (mock)

- Login por **número de teléfono** (sin email). Campo presente, mock sin SMS real.
- Store Zustand en `src/lib/stores/auth.ts` — persistido en `localStorage` con `zustand/middleware/persist`.
- Estado: `{ user, isAuthenticated, isLoading, error }` + `login()`, `register()`, `logout()`.
- `ProtectedRoute` redirige a `/login` si no hay sesión; si el role no coincide, redirige al home del role.
- **Para enchufar backend**: modificar solo `src/lib/api.ts` → `loginUser()` y `registerUser()`.

---

## Capa API (`src/lib/api.ts`)

Stubs que simulan latencia (300ms). Firmas a mantener cuando haya backend real:

```ts
registerUser(telefono, nombre, role) → Promise<User>
loginUser(telefono) → Promise<User>
getProveedores() → Promise<Proveedor[]>
getProveedorById(id) → Promise<Proveedor | null>
getProductos(proveedorId?) → Promise<Producto[]>
getProductoById(id) → Promise<Producto | null>
createOrder(order) → Promise<Order>
getOrdersByFrutero(fruteroId) → Promise<Order[]>
getOrderById(id) → Promise<Order | null>
```

---

## Máquina de estados de pedidos (`OrderStatus`)

```
confirmado → en_recogida → recogido → en_reparto → entregado
                                                  ↘ incidencia
```

`incidencia` puede llegar desde cualquier estado post-`confirmado`. Una vez en `entregado` o `incidencia`, el estado es terminal.

---

## Carrito multi-puesto

- Un `Order` contiene `OrderLine[]` de **varios proveedores** simultáneamente.
- El store calcula `getSubtotalPorProveedor()` — subtotales agrupados por puesto.
- `getTarifaServicio()` devuelve una tarifa única por pedido (ahora fija a 5€).
- `getTotal()` = suma de subtotales + tarifa de servicio.

---

## TODOs vivos

### Inmediatos (antes de primera versión)
- [ ] Iconos PWA reales — reemplazar placeholders en `public/icons/` (192px, 512px, 512px maskable)
- [ ] Login real con OTP SMS (Twilio o Firebase Auth Phone)
- [ ] Backend real — enchufar `src/lib/api.ts` a endpoints reales
- [ ] UI del carrito — implementar `CarritoPage` con líneas agrupadas por proveedor

### Funcionalidades futuras
- [ ] **App del repartidor** — role `repartidor` tiene sitio en el modelo pero sin UI
- [ ] **Split payment** — la pasarela divide el cobro: importe del puesto → proveedor, tarifa → plataforma. Ver `TODO` en `src/lib/types.ts` en `Order`.
- [ ] **Chat frutero ↔ dependiente** — por puesto, en tiempo real
- [ ] **Asistente IA** — ayuda en la creación del pedido
- [ ] **Foto del producto** — el repartidor fotografía la mercancía a la salida del mercado

---

## Comandos

```bash
npm run dev       # Servidor de desarrollo (http://localhost:5173)
npm run build     # Build de producción (tsc + vite build)
npm run preview   # Previsualiza el build
npm run lint      # ESLint
```

---

## Instrucciones para Claude

- **Ediciones mínimas y dirigidas**: no reescribir archivos completos si solo hay que cambiar una parte.
- **Preguntar antes de decisiones de arquitectura** que afecten a más de un feature o cambien convenciones.
- **No implementar lógica de negocio** sin que el usuario lo haya confirmado explícitamente.
- **Mantener el modelo de datos en `types.ts`** como fuente de verdad — los stores y la API derivan de él.
- Al añadir un nuevo feature, seguir la estructura `src/features/<nombre>/<Pantalla>.tsx`.
- La tarifa de servicio (`TARIFA_SERVICIO`) en `cart.ts` es una constante temporal — no hardcodear ese valor en otros sitios.
