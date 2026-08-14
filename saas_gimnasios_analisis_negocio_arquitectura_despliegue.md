# Plataforma SaaS para Administración de Gimnasios

## Índice
1. Introducción
2. Objetivos del Sistema
3. Análisis de Requerimientos
4. Funcionalidades Principales
5. Modelo SaaS Multi-Gimnasio
6. Plan de Negocios
7. Arquitectura de Software
8. Arquitectura de Base de Datos
9. Seguridad y Escalabilidad
10. Tecnologías Recomendadas
11. Despliegue en cPanel con Laravel
12. Alternativas Tecnológicas
13. Roadmap de Desarrollo
14. Modelo de Monetización
15. Riesgos y Estrategias
16. Conclusiones

---

# 1. Introducción

El presente documento describe el análisis funcional, técnico y comercial para el desarrollo de una plataforma SaaS (Software as a Service) orientada a la administración de gimnasios.

La plataforma permitirá gestionar múltiples gimnasios desde un único sistema centralizado, ofreciendo herramientas para:

- Gestión de membresías
- Control de asistencia
- Administración de entrenadores
- Horarios y clases
- Facturación
- Inventario
- Rutinas y entrenamientos
- Reportes administrativos
- Gestión financiera
- Portal para clientes
- Aplicación móvil futura

El objetivo principal es optimizar la operación administrativa y operativa de gimnasios pequeños, medianos y grandes.

---

# 2. Objetivos del Sistema

## Objetivo General

Desarrollar una plataforma SaaS multiempresa para la administración integral de gimnasios, orientada a mejorar la gestión operativa, administrativa y comercial.

## Objetivos Específicos

- Centralizar la información de múltiples gimnasios.
- Automatizar procesos administrativos.
- Mejorar el control de membresías y pagos.
- Optimizar la gestión de entrenadores y horarios.
- Facilitar el seguimiento del progreso de clientes.
- Proveer reportes financieros y operativos.
- Implementar una arquitectura escalable en la nube.

---

# 3. Análisis de Requerimientos

# 3.1 Requerimientos Funcionales

## 3.1.1 Gestión de Gimnasios

El sistema deberá permitir:

- Registrar múltiples gimnasios.
- Configurar sucursales.
- Gestionar usuarios por gimnasio.
- Personalizar logo, colores y datos.
- Configurar moneda e impuestos.
- Configurar horarios de atención.

## 3.1.2 Gestión de Usuarios

Roles:

- Super Administrador
- Administrador de Gimnasio
- Recepcionista
- Entrenador
- Cliente

Funciones:

- Registro y autenticación.
- Recuperación de contraseña.
- Gestión de permisos.
- Control de accesos.
- Bitácora de actividad.

## 3.1.3 Gestión de Clientes

El sistema deberá permitir:

- Registro de clientes.
- Fotografía del cliente.
- Historial de membresías.
- Estado físico.
- IMC y medidas corporales.
- Historial médico básico.
- Seguimiento de progreso.
- Control de asistencia.
- Generación de QR o código de acceso.

## 3.1.4 Planes y Membresías

Funciones:

- Crear planes mensuales.
- Planes trimestrales.
- Planes anuales.
- Membresías familiares.
- Membresías corporativas.
- Congelamiento de membresía.
- Renovación automática.
- Recordatorios de vencimiento.
- Descuentos y promociones.
- Pagos recurrentes.

Datos:

- Precio
- Duración
- Beneficios
- Acceso a clases
- Acceso a sedes
- Estado

## 3.1.5 Gestión de Entrenadores

El sistema deberá permitir:

- Registro de entrenadores.
- Especialidades.
- Horarios.
- Asignación de clientes.
- Evaluaciones.
- Seguimiento de rutinas.
- Control de asistencia laboral.
- Gestión de pagos/comisiones.

## 3.1.6 Horarios y Clases

Funciones:

- Crear horarios.
- Reservas online.
- Cupos limitados.
- Clases grupales.
- Calendario.
- Notificaciones.
- Cancelación de clases.
- Reprogramaciones.

Tipos de clases:

- CrossFit
- Yoga
- Cardio
- Spinning
- Funcional
- Pesas
- HIIT
- Pilates
- Box
- Artes marciales

## 3.1.7 Tipos de Entrenamiento

El sistema deberá manejar:

- Entrenamiento de fuerza.
- Hipertrofia.
- Pérdida de peso.
- Rehabilitación.
- Resistencia.
- Cross training.
- Cardio.
- Rutinas personalizadas.

Funciones:

- Creación de rutinas.
- Videos explicativos.
- Asignación de ejercicios.
- Seguimiento de progreso.
- Registro de pesos.
- Estadísticas.

## 3.1.8 Gestión de Inventario

El sistema deberá permitir:

- Gestión de productos.
- Suplementos.
- Ropa deportiva.
- Accesorios.
- Equipos.
- Control de stock.
- Alertas de inventario bajo.
- Proveedores.
- Compras.
- Ventas.
- Kardex.
- Reportes.

## 3.1.9 Facturación y Pagos

Funciones:

- Facturación electrónica.
- Pagos online.
- Control de caja.
- Ingresos y egresos.
- Reportes financieros.
- Integración con pasarelas.
- Recibos.
- Historial de pagos.
- Cuentas por cobrar.

## 3.1.10 Reportes y Analítica

Reportes:

- Clientes activos.
- Membresías vencidas.
- Ingresos mensuales.
- Clases más populares.
- Rendimiento de entrenadores.
- Asistencia.
- Inventario.
- Rentabilidad.
- Retención de clientes.

## 3.1.11 Notificaciones

Canales:

- Correo electrónico
- WhatsApp
- SMS
- Push notifications

Eventos:

- Vencimiento de membresía
- Reserva de clase
- Pago exitoso
- Promociones
- Cambios de horarios

---

# 3.2 Requerimientos No Funcionales

## Rendimiento

- Tiempo de respuesta menor a 3 segundos.
- Soporte para múltiples gimnasios simultáneos.
- Alta disponibilidad.

## Seguridad

- Cifrado de contraseñas.
- Autenticación JWT/Sanctum.
- Roles y permisos.
- Protección CSRF.
- Backups automáticos.
- Auditoría.

## Escalabilidad

- Arquitectura multi-tenant.
- Escalabilidad horizontal.
- Servicios desacoplados.

## Compatibilidad

- Responsive.
- Compatible con móviles.
- API REST.

## Mantenibilidad

- Código modular.
- Arquitectura limpia.
- Documentación técnica.

---

# 4. Funcionalidades Principales

# 4.1 Panel Administrativo

- Dashboard general.
- Estadísticas.
- Alertas.
- Gestión completa.

# 4.2 Portal del Cliente

- Ver membresías.
- Reservar clases.
- Ver rutinas.
- Historial de pagos.
- Seguimiento físico.

# 4.3 Aplicación Móvil (Futuro)

- Acceso QR.
- Rutinas.
- Notificaciones.
- Reservas.
- Integración con wearables.

# 4.4 Control de Acceso

Opciones:

- QR.
- RFID.
- Huella.
- Reconocimiento facial.

---

# 5. Modelo SaaS Multi-Gimnasio

# 5.1 Concepto Multi-Tenant

Un único sistema alojará múltiples gimnasios.

Cada gimnasio tendrá:

- Usuarios independientes.
- Configuración independiente.
- Datos aislados.
- Facturación independiente.

## Beneficios

- Menor costo operativo.
- Actualizaciones centralizadas.
- Escalabilidad.
- Mantenimiento simplificado.

---

# 5.2 Tipos de Suscripción SaaS

## Plan Básico

- 1 sucursal.
- Hasta 200 clientes.
- Facturación básica.
- Inventario básico.

## Plan Profesional

- Varias sucursales.
- Reportes avanzados.
- WhatsApp.
- Clases y reservas.

## Plan Enterprise

- Multi sede.
- API.
- Aplicación móvil.
- Integraciones.
- Soporte prioritario.

---

# 6. Plan de Negocios

# 6.1 Resumen Ejecutivo

La plataforma buscará cubrir la necesidad creciente de digitalización de gimnasios y centros fitness.

Mercado objetivo:

- Gimnasios pequeños.
- Cadenas de gimnasios.
- Centros de entrenamiento.
- CrossFit.
- Estudios fitness.

---

# 6.2 Problema del Mercado

Muchos gimnasios administran:

- Membresías en Excel.
- Control manual.
- Inventarios sin sistema.
- Pagos desorganizados.
- Horarios poco eficientes.

Problemas:

- Pérdida de ingresos.
- Mala experiencia del cliente.
- Baja retención.
- Falta de reportes.

---

# 6.3 Propuesta de Valor

La plataforma ofrecerá:

- Automatización.
- Acceso desde cualquier lugar.
- Escalabilidad.
- Gestión integral.
- Bajo costo mensual.
- Implementación rápida.

---

# 6.4 Segmentación de Clientes

## Segmento 1
Pequeños gimnasios.

## Segmento 2
Cadenas medianas.

## Segmento 3
Centros premium.

## Segmento 4
Entrenadores independientes.

---

# 6.5 Estrategia Comercial

## Marketing Digital

- Facebook Ads.
- Instagram Ads.
- TikTok.
- SEO.
- Google Ads.

## Ventas

- Demo gratuita.
- Prueba de 15 días.
- Plan freemium.
- Soporte onboarding.

---

# 6.6 Modelo de Ingresos

## Suscripciones Mensuales

- Básico: $19 - $39
- Profesional: $49 - $99
- Enterprise: personalizado

## Ingresos Adicionales

- Implementación.
- Capacitación.
- App móvil.
- Integraciones.
- Soporte premium.

---

# 6.7 Costos Operativos

## Infraestructura

- Hosting cloud.
- Base de datos.
- Backups.
- CDN.

## Desarrollo

- Backend.
- Frontend.
- QA.
- DevOps.

## Marketing

- Publicidad.
- Branding.
- CRM.

---

# 6.8 Proyección Inicial

## Año 1

- 20 gimnasios.
- Ingreso promedio mensual: $50.
- MRR aproximado: $1,000.

## Año 2

- 100 gimnasios.
- MRR aproximado: $5,000.

## Año 3

- 300 gimnasios.
- MRR aproximado: $15,000.

---

# 7. Arquitectura de Software

# 7.1 Arquitectura Recomendada

Arquitectura:

- Backend API REST.
- Frontend SPA.
- Base de datos relacional.
- Arquitectura multi-tenant.

---

# 7.2 Arquitectura General

## Frontend

Responsable de:

- Interfaces.
- Dashboard.
- Formularios.
- Reportes.

## Backend

Responsable de:

- Lógica de negocio.
- Autenticación.
- API.
- Procesos.

## Base de Datos

Responsable de:

- Persistencia.
- Multi tenancy.
- Reportes.

## Servicios Externos

- Pasarelas de pago.
- WhatsApp API.
- Correos.
- Facturación.

---

# 7.3 Arquitectura Multi-Tenant

## Opción Recomendada

Shared Database + Tenant ID.

Ejemplo:

- gyms
- users
- memberships
- classes
- inventory

Cada tabla contiene:

- tenant_id

Ventajas:

- Menor costo.
- Escalable.
- Fácil mantenimiento.

---

# 7.4 Módulos del Sistema

## Módulo de Seguridad

- Login.
- Roles.
- Permisos.

## Módulo Financiero

- Pagos.
- Facturación.
- Caja.

## Módulo Fitness

- Rutinas.
- Clases.
- Progreso.

## Módulo Inventario

- Stock.
- Compras.
- Ventas.

## Módulo Reportes

- KPI.
- Estadísticas.
- Exportaciones.

---

# 7.5 Arquitectura API

## Endpoints Principales

### Auth

- POST /login
- POST /register
- POST /logout

### Clientes

- GET /clients
- POST /clients
- PUT /clients/{id}

### Membresías

- GET /memberships
- POST /memberships

### Clases

- GET /classes
- POST /reservations

### Inventario

- GET /inventory
- POST /products

---

# 8. Arquitectura de Base de Datos

# 8.1 Tablas Principales

## gyms

- id
- name
- logo
- address
- phone
- email

## users

- id
- tenant_id
- role_id
- name
- email
- password

## clients

- id
- tenant_id
- personal_data
- physical_data

## memberships

- id
- tenant_id
- plan_id
- start_date
- end_date

## trainers

- id
- tenant_id
- specialty

## classes

- id
- tenant_id
- trainer_id
- schedule

## inventory

- id
- tenant_id
- stock
- price

---

# 9. Seguridad y Escalabilidad

# 9.1 Seguridad

## Recomendaciones

- HTTPS.
- JWT.
- Sanctum.
- Hash Bcrypt.
- Rate limiting.
- Logs.
- Auditoría.

---

# 9.2 Escalabilidad

## Recomendaciones

- Redis cache.
- Queue workers.
- CDN.
- Load balancer.
- Docker.

---

# 10. Tecnologías Recomendadas

# 10.1 Opción Recomendada

## Backend

Laravel 12.

## Frontend

Vue.js o React.

## Base de Datos

PostgreSQL.

## Cache

Redis.

## Infraestructura

DigitalOcean / AWS / Hetzner.

---

# 10.2 ¿Por qué Laravel?

Ventajas:

- Desarrollo rápido.
- Ecosistema maduro.
- Seguridad.
- Multi tenancy.
- Facturación.
- Jobs.
- Colas.
- Excelente para SaaS.

Paquetes:

- Spatie Permission.
- Laravel Cashier.
- Tenancy for Laravel.
- Horizon.

---

# 10.3 Alternativa Node.js

## Stack

- NestJS.
- PostgreSQL.
- React.

Ventajas:

- Alta concurrencia.
- Microservicios.
- Tiempo real.

Desventajas:

- Mayor complejidad.
- Más tiempo de desarrollo.

---

# 10.4 Alternativa Fullstack Moderna

## Stack

- Next.js.
- Supabase.
- Prisma.

Ventajas:

- Desarrollo rápido.
- Escalable.
- Tiempo real.

Desventajas:

- Menor compatibilidad con cPanel.

---

# 11. Despliegue en cPanel con Laravel

# 11.1 Requisitos del Hosting

## Mínimos

- PHP 8.3+
- MySQL/PostgreSQL
- SSH
- Composer
- Cron Jobs
- SSL

---

# 11.2 Estructura Recomendada

/public_html
/app_saas_gym

Laravel se instala fuera de public_html.

Solo public apunta a public_html.

---

# 11.3 Pasos de Despliegue

## Paso 1
Subir proyecto.

## Paso 2
Instalar dependencias.

composer install --optimize-autoloader --no-dev

## Paso 3
Configurar .env

## Paso 4
Migraciones.

php artisan migrate --seed

## Paso 5
Optimización.

php artisan optimize

## Paso 6
Configurar cron.

* * * * * php /home/user/app/artisan schedule:run

---

# 11.4 Configuración Recomendada

## Queue

Usar Redis.

## Cache

Redis.

## Archivos

Amazon S3 o Wasabi.

---

# 11.5 Limitaciones de cPanel

Problemas:

- Escalabilidad limitada.
- Workers limitados.
- Websockets complejos.
- Recursos compartidos.

---

# 11.6 Recomendación Real

## Etapa Inicial

Puede usarse:

- cPanel VPS.

## Etapa Crecimiento

Migrar a:

- Docker.
- VPS dedicado.
- Kubernetes.

---

# 12. Alternativas Tecnológicas

# 12.1 Arquitectura Inicial Recomendada

## MVP

- Laravel.
- Vue.js.
- PostgreSQL.
- Redis.
- cPanel VPS.

---

# 12.2 Arquitectura Escalable

## Producción Grande

- Backend Laravel API.
- Frontend React.
- Mobile Flutter.
- PostgreSQL.
- Redis.
- Docker.
- Nginx.
- Cloudflare.
- AWS.

---

# 13. Roadmap de Desarrollo

# Fase 1 - MVP

Duración: 2 meses.

## Módulos

- Login.
- Clientes.
- Membresías.
- Pagos.
- Dashboard.

---

# Fase 2

Duración: 2 meses.

## Módulos

- Clases.
- Reservas.
- Inventario.
- Reportes.

---

# Fase 3

Duración: 2 meses.

## Módulos

- Multi sucursal.
- App móvil.
- WhatsApp.
- IA.

---

# 14. Modelo de Monetización

# Opciones

## Suscripción mensual

## Suscripción anual

## Comisión por pagos online

## White label

## Venta de app móvil personalizada

---

# 15. Riesgos y Estrategias

# Riesgos

- Competencia.
- Costos cloud.
- Seguridad.
- Abandono de clientes.

---

# Estrategias

- Buen soporte.
- Actualizaciones constantes.
- Automatización.
- UX sencilla.
- Integraciones.

---

# 16. Plan de Construcción Paso a Paso

# Etapa 1 — Definición del MVP

## Objetivo

Construir una primera versión funcional que permita validar el negocio rápidamente.

## Funcionalidades mínimas del MVP

### Autenticación

- Login
- Registro
- Recuperación de contraseña
- Roles y permisos

### Gestión de Gimnasios

- Registro de gimnasios
- Configuración básica
- Multi tenant

### Gestión de Clientes

- CRUD de clientes
- Foto
- Estado de membresía

### Membresías

- Crear planes
- Asignar membresías
- Renovaciones
- Vencimientos

### Control de Acceso

- QR
- Registro de asistencia

### Dashboard

- Clientes activos
- Ingresos
- Membresías vencidas

---

# Etapa 2 — Definición Tecnológica

# Stack recomendado

## Backend

- Laravel 12
- Laravel Sanctum
- Spatie Permission
- Stancl Tenancy

## Frontend

- Vue 3
- Pinia
- Vue Router
- TailwindCSS

## Base de Datos

- PostgreSQL

## Infraestructura

- VPS con cPanel inicialmente

---

# Etapa 3 — Arquitectura Inicial

# Arquitectura sugerida

Frontend SPA → API Laravel → PostgreSQL

---

# Estructura Backend

/app

/modules

- Auth
- Gym
- Membership
- Client
- Trainer
- Inventory
- Billing

---

# Etapa 4 — Diseño de Base de Datos

# Tablas Iniciales

## tenants

- id
- name
- slug
- domain

## users

- id
- tenant_id
- role_id
- name
- email
- password

## gyms

- id
- tenant_id
- name
- address

## clients

- id
- tenant_id
- first_name
- last_name
- phone
- email
- qr_code

## plans

- id
- tenant_id
- name
- duration_days
- price

## memberships

- id
- client_id
- plan_id
- start_date
- end_date
- status

## attendances

- id
- client_id
- checkin_at

---

# Etapa 5 — Configuración del Proyecto Laravel

# Crear proyecto

composer create-project laravel/laravel gym-saas

---

# Instalar paquetes

composer require laravel/sanctum

composer require spatie/laravel-permission

composer require stancl/tenancy

---

# Configurar autenticación

php artisan install:api

---

# Configurar tenancy

php artisan tenancy:install

---

# Crear migraciones

php artisan make:migration

---

# Etapa 6 — Backend API

# Orden recomendado

## 1. Auth

Endpoints:

- POST /login
- POST /logout
- POST /register

---

## 2. Clientes

CRUD completo.

---

## 3. Planes

CRUD completo.

---

## 4. Membresías

Asignación y vencimiento.

---

## 5. Asistencias

Registro QR.

---

# Etapa 7 — Frontend Vue

# Estructura

/src

/modules

- auth
- dashboard
- clients
- memberships
- plans

/components

/layouts

/services

---

# Pantallas Iniciales

## Login

## Dashboard

## Clientes

## Membresías

## Planes

---

# Etapa 8 — Multi Tenant

# Estrategia Recomendada

Tenant por gimnasio.

Ejemplo:

fitnesspro.tudominio.com

powergym.tudominio.com

---

# Beneficios

- Aislamiento lógico
- Escalabilidad
- Personalización

---

# Etapa 9 — Facturación y Pagos

# Integraciones recomendadas

## Stripe

Para pagos recurrentes.

## PayPhone

Ecuador.

## MercadoPago

Latinoamérica.

---

# Etapa 10 — Inventario

# Funciones iniciales

- Productos
- Categorías
- Stock
- Compras
- Ventas

---

# Etapa 11 — Reportes

# Reportes iniciales

- Ingresos mensuales
- Clientes activos
- Membresías vencidas
- Asistencias

---

# Etapa 12 — Despliegue Inicial

# VPS cPanel

## Requisitos

- PHP 8.3
- PostgreSQL
- Redis
- SSL

---

# Flujo recomendado

## Desarrollo local

Docker o Laragon.

## Testing

Staging VPS.

## Producción

cPanel VPS.

---

# Etapa 13 — Escalabilidad Futura

# Migración futura

## Infraestructura moderna

- Docker
- Nginx
- CI/CD
- Kubernetes
- Cloudflare

---

# Etapa 14 — Aplicación Móvil

# Tecnología recomendada

Flutter.

Funciones:

- QR
- Rutinas
- Reservas
- Notificaciones

---

# Etapa 15 — IA y Automatización

# Ideas futuras

- Rutinas automáticas.
- Predicción de abandono.
- Chatbot fitness.
- Recomendación de planes.

---

# 17. Conclusiones

El desarrollo de una plataforma SaaS para administración de gimnasios representa una oportunidad de negocio escalable y sostenible.

La recomendación técnica principal es utilizar:

- Laravel + Vue.js.
- PostgreSQL.
- Redis.
- Arquitectura multi-tenant.

Para iniciar:

- cPanel VPS es suficiente.

Para crecimiento:

- Docker + VPS dedicado o cloud.

La plataforma puede evolucionar hacia:

- Aplicaciones móviles.
- Inteligencia artificial.
- Integración con wearables.
- Automatización avanzada.
- Marketplace fitness.

