# GymPro — Documentación Técnica

> **Versión:** 1.0.0  
> **Fecha:** 29 de mayo de 2026  
> **Proyecto:** Plataforma SaaS para Administración de Gimnasios  
> **Autores:** Equipo de Desarrollo GymPro

---

## 1. Descripción General

**GymPro** es una plataforma web SaaS diseñada para la administración integral de gimnasios. Permite gestionar clientes, membresías, clases, entrenadores, control de asistencia, inventario de productos y una **tienda de productos deportivos y suplementos** con proceso de pago por transferencia bancaria.

El sistema está construido como una **SPA (Single Page Application)** con Vue.js 3 y Vite, lo que permite su despliegue como archivos estáticos en cualquier hosting tradicional, incluyendo **cPanel**.

---

## 2. Stack Tecnológico

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Vue.js** | 3.5.34 | Framework frontend reactivo |
| **Vite** | 8.0.12 | Bundler y dev server |
| **Vue Router** | 4.6.4 | Enrutamiento SPA (hash mode) |
| **Pinia** | 3.0.4 | Gestión de estado centralizada |
| **Chart.js** | 4.5.1 | Gráficos y visualización de datos |
| **CSS Custom** | — | Design system personalizado |
| **Google Fonts** | — | Inter + Outfit (tipografía) |

### Dependencias de Desarrollo

| Dependencia | Versión | Propósito |
|------------|---------|-----------|
| `@vitejs/plugin-vue` | 6.0.6 | Plugin de Vue para Vite |
| `vite` | 8.0.12 | Build tool |

---

## 3. Requisitos del Entorno

### Desarrollo Local

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- Navegador moderno (Chrome, Firefox, Edge, Safari)

### Producción (cPanel)

- Servidor web con soporte para archivos estáticos (Apache/Nginx)
- SSL recomendado (HTTPS)
- No requiere PHP, Node.js ni base de datos en el servidor

---

## 4. Instalación y Configuración

### Clonar e Instalar

```bash
cd gym_app
npm install
```

### Ejecutar en Desarrollo

```bash
npm run dev
# Servidor disponible en http://localhost:5173/
```

### Build de Producción

```bash
npm run build
# Los archivos se generan en la carpeta /dist
```

### Previsualizar Build

```bash
npm run preview
```

---

## 5. Estructura del Proyecto

```
gym_app/
├── index.html                          # Punto de entrada HTML
├── package.json                        # Dependencias y scripts
├── vite.config.js                      # Configuración de Vite
├── public/
│   └── favicon.svg                     # Ícono de la aplicación
├── src/
│   ├── main.js                         # Bootstrap de la app Vue
│   ├── App.vue                         # Componente raíz (layout)
│   ├── router.js                       # Definición de rutas y guards
│   ├── styles/
│   │   └── index.css                   # Design system completo
│   ├── stores/                         # Estado global (Pinia)
│   │   ├── auth.js                     # Autenticación y sesión
│   │   ├── cart.js                     # Carrito de compras
│   │   └── toast.js                    # Notificaciones toast
│   ├── data/
│   │   └── seed.js                     # Datos de demostración
│   ├── components/                     # Componentes reutilizables
│   │   ├── AppSidebar.vue              # Navegación lateral
│   │   ├── AppHeader.vue               # Barra superior
│   │   └── ToastContainer.vue          # Sistema de notificaciones
│   └── views/                          # Vistas/Páginas (13 total)
│       ├── LoginView.vue               # Autenticación
│       ├── DashboardView.vue           # Panel principal
│       ├── ClientsView.vue             # Gestión de clientes
│       ├── MembershipsView.vue         # Planes y membresías
│       ├── AttendanceView.vue          # Control de asistencia
│       ├── TrainersView.vue            # Gestión de entrenadores
│       ├── ClassesView.vue             # Clases y horarios
│       ├── StoreView.vue               # Tienda de productos
│       ├── CartView.vue                # Carrito de compras
│       ├── CheckoutView.vue            # Proceso de pago
│       ├── InventoryView.vue           # Gestión de inventario
│       ├── ReportsView.vue             # Reportes y analítica
│       └── SettingsView.vue            # Configuración
└── saas_gimnasios_analisis_negocio_arquitectura_despliegue.md  # Análisis original
```

---

## 6. Configuración de Rutas

El router utiliza **hash mode** (`createWebHashHistory`) para compatibilidad total con hosting estático y cPanel, evitando problemas de reescritura de URLs.

### Tabla de Rutas

| Ruta | Nombre | Vista | Pública |
|------|--------|-------|---------|
| `/login` | Login | `LoginView.vue` | ✅ |
| `/` | Dashboard | `DashboardView.vue` | ❌ |
| `/clientes` | Clientes | `ClientsView.vue` | ❌ |
| `/membresias` | Membresias | `MembershipsView.vue` | ❌ |
| `/asistencia` | Asistencia | `AttendanceView.vue` | ❌ |
| `/entrenadores` | Entrenadores | `TrainersView.vue` | ❌ |
| `/clases` | Clases | `ClassesView.vue` | ❌ |
| `/tienda` | Tienda | `StoreView.vue` | ❌ |
| `/carrito` | Carrito | `CartView.vue` | ❌ |
| `/checkout` | Checkout | `CheckoutView.vue` | ❌ |
| `/inventario` | Inventario | `InventoryView.vue` | ❌ |
| `/reportes` | Reportes | `ReportsView.vue` | ❌ |
| `/configuracion` | Configuracion | `SettingsView.vue` | ❌ |

### Guard de Navegación

- Las rutas protegidas redirigen a `/login` si el usuario no está autenticado.
- Si el usuario autenticado visita `/login`, se redirige al Dashboard.
- Se utiliza `lazy loading` (importaciones dinámicas) para optimizar el rendimiento.

---

## 7. Gestión de Estado (Pinia)

### Store: `auth`

| Propiedad/Método | Tipo | Descripción |
|-------------------|------|-------------|
| `user` | `ref` | Objeto del usuario autenticado |
| `gym` | `ref` | Datos del gimnasio actual |
| `isAuthenticated` | `computed` | Indica si hay sesión activa |
| `userName` | `computed` | Nombre del usuario |
| `userRole` | `computed` | Rol del usuario |
| `gymName` | `computed` | Nombre del gimnasio |
| `login(email, pwd)` | `function` | Inicia sesión y persiste en localStorage |
| `logout()` | `function` | Cierra sesión y limpia localStorage |

### Store: `cart`

| Propiedad/Método | Tipo | Descripción |
|-------------------|------|-------------|
| `items` | `ref` | Lista de productos en el carrito |
| `totalItems` | `computed` | Cantidad total de productos |
| `subtotal` | `computed` | Subtotal sin impuestos |
| `tax` | `computed` | Cálculo de IVA (12%) |
| `total` | `computed` | Total con impuestos |
| `addItem(product)` | `function` | Agrega producto al carrito |
| `removeItem(id)` | `function` | Elimina producto del carrito |
| `updateQty(id, qty)` | `function` | Actualiza cantidad |
| `clear()` | `function` | Vacía el carrito |

### Store: `toast`

| Propiedad/Método | Tipo | Descripción |
|-------------------|------|-------------|
| `toasts` | `ref` | Lista de notificaciones activas |
| `success(msg)` | `function` | Notificación de éxito |
| `error(msg)` | `function` | Notificación de error |
| `info(msg)` | `function` | Notificación informativa |

---

## 8. Persistencia de Datos

El sistema utiliza **localStorage** como capa de persistencia:

| Clave | Contenido | Usado por |
|-------|-----------|-----------|
| `gym_user` | Datos del usuario autenticado | `auth.js` |
| `gym_info` | Datos del gimnasio | `auth.js` |
| `gym_cart` | Items del carrito de compras | `cart.js` |

Los datos de demostración (clientes, productos, planes, etc.) se cargan desde `src/data/seed.js` y se mantienen en memoria reactiva durante la sesión.

---

## 9. Design System (CSS)

### Variables CSS Principales

| Variable | Valor | Uso |
|----------|-------|-----|
| `--bg-primary` | `#060b18` | Fondo principal |
| `--bg-secondary` | `#0c1425` | Fondo secundario |
| `--accent` | `#3b82f6` | Color de acento (azul) |
| `--cyan` | `#06b6d4` | Color secundario (cyan) |
| `--gradient-primary` | `135deg, #3b82f6 → #06b6d4` | Gradiente principal |
| `--font-sans` | `Inter` | Tipografía de texto |
| `--font-display` | `Outfit` | Tipografía de títulos |

### Componentes CSS Incluidos

- Botones (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-success`)
- Cards (`.card`, `.stat-card`, `.product-card`)
- Badges (`.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-info`)
- Tablas (`.table-container`, responsive)
- Modales (`.modal-overlay`, `.modal-content`)
- Formularios (`.form-group`, `.form-row`)
- Buscador (`.search-bar`)
- Filtros (`.filter-chip`)
- Checkout steps (`.checkout-steps`, `.checkout-step`)
- Toasts (`.toast-container`, `.toast`)
- Animaciones (`fadeIn`, `slideUp`, `slideInRight`, `pulse`)

---

## 10. Despliegue en cPanel

### Paso 1: Build de producción

```bash
npm run build
```

### Paso 2: Subir archivos

Subir el contenido completo de la carpeta `/dist` al directorio `public_html` del hosting.

### Paso 3: Verificar

- No se requiere configuración adicional de servidor.
- El hash mode del router garantiza que todas las rutas funcionen sin reescritura.
- HTTPS recomendado para producción.

### Estructura en cPanel

```
public_html/
├── index.html
├── favicon.svg
└── assets/
    ├── index-[hash].js
    └── index-[hash].css
```

---

## 11. Datos de Demostración

El archivo `src/data/seed.js` contiene datos realistas precargados:

| Tipo | Cantidad | Detalles |
|------|----------|---------|
| Clientes | 12 | Con datos completos (nombre, email, plan, IMC, visitas) |
| Planes | 5 | Básico, Premium, Trimestral, Anual, Familiar |
| Productos | 16 | Suplementos (6), Ropa (4), Accesorios (6) |
| Entrenadores | 4 | Con especialidades y horarios |
| Clases | 10 | CrossFit, Yoga, Spinning, HIIT, Pilates, etc. |
| Ventas | 5 | Historial de transacciones |
| Revenue | 12 meses | Datos de ingresos mensuales |
| Asistencia | 7 días | Datos de asistencia semanal |

---

## 12. Convenciones de Código

- **Nombres de archivos**: PascalCase para componentes Vue (`ClientsView.vue`), camelCase para JS (`auth.js`)
- **Composition API**: Todos los componentes usan `<script setup>`
- **Estado reactivo**: `ref()` y `computed()` de Vue 3
- **Estilos**: CSS scoped por componente + design system global
- **Idioma de la UI**: Español completo
