# GymPro — Arquitectura del Sistema

> **Versión:** 1.0.0  
> **Fecha:** 29 de mayo de 2026  
> **Proyecto:** Plataforma SaaS para Administración de Gimnasios

---

## 1. Visión General de la Arquitectura

GymPro implementa una arquitectura **SPA (Single Page Application)** basada en componentes, con separación clara de responsabilidades entre la capa de presentación, la lógica de negocio y la gestión de datos.

### Tipo de Arquitectura

- **Frontend-Only (Prototipo funcional)**
- Patrón: **Component-Based Architecture** con **Flux Pattern** (Pinia)
- Renderizado: **Client-Side Rendering (CSR)**
- Enrutamiento: **Hash-based SPA routing**
- Persistencia: **localStorage** (sin backend)

---

## 2. Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVEGADOR                            │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Vue.js 3 App                      │   │
│  │                                                      │   │
│  │  ┌─────────┐   ┌──────────┐   ┌─────────────────┐   │   │
│  │  │ Router  │──▶│  Views   │──▶│   Components    │   │   │
│  │  │ (13     │   │ (13      │   │ (Sidebar,       │   │   │
│  │  │ rutas)  │   │ páginas) │   │  Header, Toast) │   │   │
│  │  └─────────┘   └────┬─────┘   └─────────────────┘   │   │
│  │                     │                                 │   │
│  │              ┌──────▼──────┐                          │   │
│  │              │   Stores    │                          │   │
│  │              │  (Pinia)    │                          │   │
│  │              │             │                          │   │
│  │              │ ┌─────────┐ │                          │   │
│  │              │ │  Auth   │ │                          │   │
│  │              │ │  Cart   │ │                          │   │
│  │              │ │  Toast  │ │                          │   │
│  │              │ └────┬────┘ │                          │   │
│  │              └──────┼──────┘                          │   │
│  │                     │                                 │   │
│  │              ┌──────▼──────┐                          │   │
│  │              │ localStorage│                          │   │
│  │              │ (Datos)     │                          │   │
│  │              └─────────────┘                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐   │
│  │   Chart.js     │  │  Google Fonts  │  │  CSS Design  │   │
│  │  (Gráficos)    │  │ (Inter/Outfit) │  │   System     │   │
│  └────────────────┘  └────────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Arquitectura de Capas

### Capa 1: Presentación (Views + Components)

Responsable de la interfaz de usuario y la experiencia visual.

```
┌──────────────────────────────────────────┐
│              CAPA DE PRESENTACIÓN        │
│                                          │
│  App.vue (Layout raíz)                   │
│  ├── AppSidebar.vue (Navegación)         │
│  ├── AppHeader.vue (Barra superior)      │
│  ├── ToastContainer.vue (Notificaciones) │
│  └── <router-view> (Vista activa)        │
│       ├── LoginView.vue                  │
│       ├── DashboardView.vue              │
│       ├── ClientsView.vue               │
│       ├── MembershipsView.vue            │
│       ├── AttendanceView.vue             │
│       ├── TrainersView.vue               │
│       ├── ClassesView.vue                │
│       ├── StoreView.vue                  │
│       ├── CartView.vue                   │
│       ├── CheckoutView.vue              │
│       ├── InventoryView.vue             │
│       ├── ReportsView.vue               │
│       └── SettingsView.vue              │
└──────────────────────────────────────────┘
```

### Capa 2: Lógica de Negocio (Stores)

Gestiona el estado global y las reglas de negocio.

```
┌──────────────────────────────────────────┐
│          CAPA DE LÓGICA DE NEGOCIO       │
│                                          │
│  Pinia Stores                            │
│  ├── auth.js                             │
│  │   ├── login() / logout()              │
│  │   ├── isAuthenticated (computed)      │
│  │   └── user, gym (estado)              │
│  ├── cart.js                             │
│  │   ├── addItem() / removeItem()        │
│  │   ├── updateQty() / clear()           │
│  │   ├── subtotal, tax, total (computed) │
│  │   └── items (estado)                  │
│  └── toast.js                            │
│      ├── success() / error() / info()    │
│      └── toasts (estado)                 │
└──────────────────────────────────────────┘
```

### Capa 3: Datos (Seed + localStorage)

Provee los datos de la aplicación.

```
┌──────────────────────────────────────────┐
│            CAPA DE DATOS                 │
│                                          │
│  seed.js (Datos estáticos)               │
│  ├── seedClients (12 clientes)           │
│  ├── seedPlans (5 planes)                │
│  ├── seedProducts (16 productos)         │
│  ├── seedTrainers (4 entrenadores)       │
│  ├── seedClasses (10 clases)             │
│  ├── seedSales (5 ventas)                │
│  ├── monthlyRevenue (12 meses)           │
│  ├── monthlyMembers (12 meses)           │
│  └── weeklyAttendance (7 días)           │
│                                          │
│  localStorage (Datos persistentes)       │
│  ├── gym_user (sesión de usuario)        │
│  ├── gym_info (datos del gimnasio)       │
│  └── gym_cart (carrito de compras)       │
└──────────────────────────────────────────┘
```

---

## 4. Flujo de Navegación

```
                    ┌───────────┐
                    │   Login   │
                    └─────┬─────┘
                          │ (autenticación)
                          ▼
                    ┌───────────┐
                    │ Dashboard │
                    └─────┬─────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
    ┌─────▼─────┐   ┌────▼────┐   ┌──────▼──────┐
    │  Gestión  │   │ Fitness │   │   Comercio  │
    │           │   │         │   │             │
    │ • Clientes│   │ • Clases│   │ • Tienda    │
    │ • Membr.  │   │ • Entren│   │ • Carrito   │
    │ • Asist.  │   │         │   │ • Checkout  │
    └───────────┘   └─────────┘   │ • Inventario│
                                  └──────┬──────┘
                                         │
                          ┌──────────────┤
                          │              │
                    ┌─────▼─────┐  ┌─────▼─────┐
                    │ Reportes  │  │  Config.   │
                    └───────────┘  └───────────┘
```

---

## 5. Flujo del Proceso de Compra (Tienda)

```
┌────────────┐     ┌────────────┐     ┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│   Tienda   │────▶│  Agregar   │────▶│   Carrito   │────▶│  Checkout   │────▶│ Confirmación │
│ (Catálogo) │     │ al Carrito │     │ (Resumen)   │     │ (3 pasos)   │     │  (Recibo)    │
└────────────┘     └────────────┘     └─────────────┘     └──────┬──────┘     └──────────────┘
                                                                  │
                                                     ┌────────────┼────────────┐
                                                     │            │            │
                                                ┌────▼───┐  ┌────▼───┐  ┌────▼───┐
                                                │ Paso 1 │  │ Paso 2 │  │ Paso 3 │
                                                │ Datos  │  │ Método │  │ Confir │
                                                │Cliente │  │ Pago   │  │ mación │
                                                └────────┘  └────┬───┘  └────────┘
                                                                  │
                                                     ┌────────────┼────────────┐
                                                     │            │            │
                                                ┌────▼────┐ ┌────▼────┐ ┌────▼────┐
                                                │Transfer.│ │Efectivo │ │ Tarjeta │
                                                │Bancaria │ │         │ │ Crédito │
                                                │(datos   │ │         │ │(simulad)│
                                                │ banco)  │ │         │ │         │
                                                └─────────┘ └─────────┘ └─────────┘
```

---

## 6. Arquitectura del Layout

```
┌────────────────────────────────────────────────────────────┐
│                     VENTANA DEL NAVEGADOR                  │
│                                                            │
│  ┌─────────┐  ┌─────────────────────────────────────────┐  │
│  │         │  │              AppHeader                   │  │
│  │         │  │  [☰] Saludo · Gym  ·  [🛒] [Avatar]     │  │
│  │   App   │  ├─────────────────────────────────────────┤  │
│  │ Sidebar │  │                                         │  │
│  │         │  │           <router-view />               │  │
│  │ [Logo]  │  │                                         │  │
│  │ ──────  │  │        (Vista activa según ruta)        │  │
│  │ 📊 Dash │  │                                         │  │
│  │ 👥 Clien│  │   ┌─────────────────────────────────┐   │  │
│  │ 💳 Memb │  │   │     Contenido de la página      │   │  │
│  │ 📋 Asist│  │   │                                 │   │  │
│  │ 🏋️ Entre│  │   │  • Stats grid                   │   │  │
│  │ 📅 Clases│  │   │  • Tablas / Cards / Gráficos   │   │  │
│  │ 🛍️ Tiend│  │   │  • Modales                      │   │  │
│  │ 📦 Inven│  │   │                                 │   │  │
│  │ 📈 Repor│  │   └─────────────────────────────────┘   │  │
│  │ ⚙️ Config│  │                                         │  │
│  │ ──────  │  │                                         │  │
│  │ 🚪 Salir│  │                                         │  │
│  └─────────┘  └─────────────────────────────────────────┘  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            ToastContainer (notificaciones)            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### Dimensiones del Layout

| Elemento | Valor | Variable CSS |
|----------|-------|--------------|
| Ancho del Sidebar | 260px | `--sidebar-width` |
| Altura del Header | 64px | `--header-height` |
| Sidebar colapsado | 72px | Clase `.collapsed` |
| Breakpoint mobile | 768px | `@media` |

---

## 7. Arquitectura Multi-Tenant (Diseño Futuro)

El documento original define una arquitectura multi-tenant con **Shared Database + Tenant ID**. La estructura actual está preparada para esta evolución:

```
┌──────────────────────────────────────────────┐
│                ARQUITECTURA FUTURA           │
│                                              │
│  ┌──────────┐    ┌──────────┐    ┌────────┐  │
│  │ Frontend │───▶│ API REST │───▶│  DB    │  │
│  │ Vue SPA  │    │ Laravel  │    │ Postgr │  │
│  └──────────┘    └──────────┘    └────────┘  │
│                                              │
│  Cada tabla incluye tenant_id:               │
│  • tenants (gimnasios)                       │
│  • users (tenant_id, role_id)                │
│  • clients (tenant_id)                       │
│  • memberships (tenant_id)                   │
│  • products (tenant_id)                      │
│  • sales (tenant_id)                         │
│  • classes (tenant_id)                       │
│  • attendances (tenant_id)                   │
└──────────────────────────────────────────────┘
```

---

## 8. Patrón de Diseño de Componentes

Cada vista sigue un patrón consistente:

```vue
<template>
  <!-- 1. Page Header (título + botón de acción) -->
  <!-- 2. Stats Grid (KPIs opcionales) -->
  <!-- 3. Filter Bar (búsqueda + filtros) -->
  <!-- 4. Content (tabla/cards/gráficos) -->
  <!-- 5. Modal (crear/editar formulario) -->
</template>

<script setup>
  // 1. Importar stores y datos
  // 2. Estado reactivo local (ref)
  // 3. Computed properties (filtros)
  // 4. Funciones CRUD
</script>

<style scoped>
  /* Estilos específicos del componente */
</style>
```

---

## 9. Seguridad Actual

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Autenticación | ⚠️ Simulada | localStorage (sin backend) |
| Guard de rutas | ✅ Implementado | Redirección a login |
| Datos sensibles | ⚠️ Frontend only | Sin cifrado real |
| CSRF | ❌ No aplica | Sin backend |
| HTTPS | ⏳ En deploy | Recomendado en producción |

> **Nota:** Para producción real, se debe implementar un backend (Laravel) con autenticación JWT/Sanctum, como se especifica en el documento de análisis original.

---

## 10. Escalabilidad y Evolución

### Fase Actual → Fase Backend

```
ACTUAL (Prototipo)              FUTURO (Producción)
──────────────────              ────────────────────
Vue SPA                    →    Vue SPA
localStorage               →    API REST (Laravel 12)
Datos en seed.js           →    PostgreSQL + Redis
Sin autenticación real     →    JWT / Sanctum
Sin multi-tenant           →    Stancl/Tenancy
Sin pagos reales           →    Stripe / MercadoPago
Sin notificaciones         →    WhatsApp API / Email
Deploy estático            →    Docker + VPS
```
