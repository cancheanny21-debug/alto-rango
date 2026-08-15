e # Alto Rango — Gym & Suplementos

Sistema web para administrar **Alto Rango Gym** (membresías, acceso, asistencia, cobros) y la tienda **Alto Rango Suplementos** (ventas e inventario), según el documento de requisitos funcionales.

## Stack

- Vue.js 3 + Vite + Vue Router (hash) + Pinia
- Persistencia demo en `localStorage`
- UI en español

## Roles (RF seguridad)

| Rol                | Credencial demo                          | Acceso                                            |
| ------------------ | ---------------------------------------- | ------------------------------------------------- |
| Administrador      | `admin@altorango.com` / `admin123`       | Todo el panel                                     |
| Empleado/Encargado | `empleado@altorango.com` / `empleado123` | Asistencia, ventas, inventario, control de acceso |
| Usuario            | `usuario@altorango.com` / `usuario123`   | Asistencia propia y rutinas                       |

## Arranque

```bash
npm install
npm run dev
```

Tienda pública (sin login): `/#/public-store`

## Requisitos cubiertos (resumen)

- RF-001/002 Usuarios: crear/eliminar en Configuración
- RF-003 Planes: diario, normal, mensual, personalizado, nutricional (+ pospago)
- RF-004 Cobros con historial y descuentos
- RF-005 Promociones activables
- RF-006 Cambio de plan de membresía
- RF-007 Puerta solo con membresía activa
- RF-008 Verificar/anular asistencia
- RF-009 Activar/desactivar control de acceso
- RF-010 Pospago por tarjeta (30 asistencias → cumplido)
- RF-011 Módulo de ventas (empleado)
- RF-012 Notificaciones de ventas (campana)
- RF-013 Catálogo (Dasani, Powerade, proteína, creatina, etc.)
- RF-014 Tienda online pública
- RF-015 Enlaces a redes sociales
- RF-016 Inventario de equipos (máquinas/pesas)
- RF-017 Rutinas de entrenamiento
