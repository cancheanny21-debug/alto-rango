# GymPro — Plataforma SaaS para Administración de Gimnasios

**GymPro** es una plataforma web orientada a la administración integral de gimnasios. Permite gestionar clientes, membresías, clases, entrenadores, control de asistencia, inventario de productos y una **tienda de productos deportivos y suplementos** con proceso de pago.

## 🚀 Estado Actual: MVP Frontend Funcional

El proyecto se encuentra en fase de **prototipo funcional (Frontend-Only)**.
- **Datos:** Se utiliza `localStorage` para la persistencia de datos (sesión y carrito) y datos simulados para el resto de la aplicación.
- **UI/UX:** Diseño premium con glassmorphism, 100% responsive y en español.
- **Cero Errores:** Aplicación navegable de extremo a extremo sin errores en consola.

## 🛠️ Stack Tecnológico

- **Framework:** Vue.js 3 (Composition API, `<script setup>`)
- **Bundler:** Vite
- **Enrutamiento:** Vue Router (Hash mode)
- **Estado Global:** Pinia
- **Gráficos:** Chart.js
- **Estilos:** CSS Custom (Design System propio)

## 📦 Módulos Implementados (13/13)

1. **🔐 Autenticación:** Login simulado con persistencia.
2. **📊 Dashboard:** KPIs, gráficos y alertas.
3. **👥 Clientes:** CRUD, historial y perfil detallado.
4. **💳 Membresías:** Gestión de planes y estados (Activa, Vencida, Congelada).
5. **📋 Asistencia:** Control de check-in y simulación de lectura QR.
6. **🏋️ Entrenadores:** Perfiles, especialidades y horarios.
7. **📅 Clases:** Calendario de sesiones y reservas de cupos.
8. **🛍️ Tienda:** Catálogo de suplementos, ropa y accesorios.
9. **🛒 Carrito:** Gestión de productos a comprar con cálculo de impuestos.
10. **💳 Checkout:** Pasarela de pago de 3 pasos (Transferencia/Efectivo/Tarjeta) con generación de recibo.
11. **📦 Inventario:** Gestión administrativa de productos y control de stock.
12. **📈 Reportes:** Gráficos interactivos de ingresos, ventas y asistencia.
13. **⚙️ Configuración:** Ajustes del gimnasio y datos bancarios.

## 💻 Instalación y Configuración Local

```bash
# 1. Clonar el repositorio y entrar al directorio
cd gym_app

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

## 🌐 Despliegue en cPanel (Producción)

Dado que el proyecto usa Vue Router en `hash mode`, puede ser desplegado fácilmente en cualquier servidor estático:

```bash
# Generar build para producción
npm run build
```

Los archivos generados en la carpeta `dist/` pueden ser subidos directamente al directorio `public_html` del hosting (no requiere Node.js ni PHP en el servidor para esta versión MVP).
