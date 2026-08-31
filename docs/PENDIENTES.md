# CriptoUNAM - Lista de Pendientes

**Ultima actualizacion:** 3 de Febrero, 2026

---

## Completadas

| # | Tarea |
|---|-------|
| 4 | Agregar cursos a la plataforma con su contenido estructurado |
| 5 | Enlazar/configurar almacenamiento de videos de clases (+1 hora) |
| 6 | Revisar integracion con Supabase - verificar tablas, autenticacion y conexiones |
| 10 | Agregar hackathones proximos a la pagina de eventos con imagenes |

---

## Pendientes

### Contenido / Imagenes

| # | Tarea | Prioridad |
|---|-------|-----------|
| 1 | Anadir fotos de los proyectos (Utonoma, Verifica.xyz, La Kiniela, PumaPay, etc.) | Alta |
| 2 | Anadir fotos/imagenes para los proximos eventos (Binance University Tour, Labitconf) | Alta |
| 3 | Anadir fotos de los colaboradores/embajadores del equipo | Media |
| 14 | Agregar banners/imagenes para CriptoUNAM Connect (X Spaces) en /images/spaces/ | Media |

### Equipo y Roles

| # | Tarea | Prioridad |
|---|-------|-----------|
| 11 | Agregar links de redes personales (LinkedIn, Twitter, GitHub) de los miembros del equipo | Media |
| 12 | Actualizar lista de embajadores y embajadoras (agregar nuevos, actualizar roles) | Media |
| 13 | Reorganizar roles del equipo: mover algunos embajadores a Core Team, actualizar etiquetas de Founders y Core Team | Media |

### Landing Pages y Marketing

| # | Tarea | Prioridad |
|---|-------|-----------|
| 7 | Crear landing pages para embudos de promocion de eventos | Baja |
| 8 | Crear landing pages para embudos de promocion de cursos | Baja |
| 9 | Configurar analytics y tracking para las landing pages de conversion | Baja |

---

## Rutas importantes

- Imagenes de proyectos: /public/images/Proyectos/
- Imagenes de eventos: /public/images/eventos/
- Banners de CriptoUNAM Connect: /public/images/spaces/
- Imagenes del equipo: /public/images/Equipo/
- Datos de eventos: /src/data/eventosData.ts
- Datos del equipo: /src/pages/Home.tsx (array teamMembers)
- Schema Supabase (tablas y cursos): supabase/schema.sql
- Servicio de cursos: /src/services/cursos.service.ts

---

## Notas tecnicas

1. Banners de CriptoUNAM Connect necesarios:
   - ethereum-future.png
   - starknet-l2s.png

2. Eventos sin foto fueron removidos - agregar fotos antes de re-anadirlos

3. Sistema de cursos listo en Supabase - ejecutar supabase/schema.sql en el SQL Editor
