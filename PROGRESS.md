# PROGRESS — Hogara

## 2026-10-28 · Fase 1 (parcial) + UI estilo Booking del comprador

### Hecho
- Expo SDK 58 + Expo Router (`src/app`) + TypeScript estricto + NativeWind v5 (Tailwind 4) con paleta Hogara
  (petróleo `#0F5C6E` + ámbar `#F2A93B`), modo claro/oscuro por sistema.
- i18n es/en (`src/i18n`), conmutadores de idioma y moneda (USD/Bs) en el header.
- UX tomado de Booking, identidad propia:
  - Inicio: pestañas Comprar/Alquilar/Vender, hero, buscador con marco ámbar (zona, tipo, habitaciones, presupuesto),
    "Explora Caracas", "Busca por tipo", "Las mejor valoradas", "¿Por qué Hogara?".
  - Resultados `/search`: filtros con conteo en vivo (verificadas, 360°, 9+, zona, tipo), orden (5 criterios),
    tarjetas con insignia de puntuación, sello verificada, custodia, aviso real de unidades, precio y "Ver disponibilidad".
    Filtros en la URL (enlaces compartibles). En móvil, filtros en hoja modal.
  - Detalle v0 `/property/[id]`: galería, datos, puntuación, caja de precio con custodia y garantía.
- Reglas con tests (vitest, 17 pasan): 9 (promedio), 10 (palabra), 11 (escasez real), 16 (USD→Bs), búsqueda/orden.
- Servicios mock: `ExchangeRateProvider` (tasa fija `EXPO_PUBLIC_MOCK_USD_BS`, 220 por defecto), propiedades desde la semilla (6 de Caracas).
- `vercel.json` listo (export web + reescritura SPA).

### Pendiente Fase 1
- Supabase: proyecto, migración con todas las tablas + RLS por rol, trigger de perfil, semilla en BD.
- Auth (registro/ingreso, rol comprador/agente; admin solo por SQL) y navegación por rol.
- Header: "Publica tu propiedad", "Inicia sesión", "Regístrate" (entran con auth).
- Despliegue a Vercel (tras `pre-lanzamiento` y el "sube" de Óscar).

### Adelantado de Fase 2 (falta)
- Mapa con pines de precio, favoritos, vistos, comparar, detalle completo (historial, IA, trust, chat, visita).
- Buscador colapsado en resultados móviles (como Booking).

### Cómo probar
```bash
npm install
npm test              # reglas de negocio
npm run typecheck
npx expo start --web  # o: npm run build:web && npx serve dist -s
```
- Inicio → elegir zona "Altamira" → Buscar → resultados filtrados.
- En resultados, marcar "Verificadas": el número de cada filtro se recalcula y la URL lleva `verified=1`.
- Header: `US$` ↔ `Bs` cambia todos los precios; `ES` ↔ `EN` cambia los textos.
