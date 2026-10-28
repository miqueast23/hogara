# CLAUDE.md — Hogara

## Qué es Hogara
App inmobiliaria para Venezuela (empezando por Caracas) para comprar, alquilar y vender
propiedades con confianza. Su experiencia de búsqueda está inspirada en los patrones de Booking.com,
pero con identidad propia. No uses colores, logos ni nombres de Booking (por ejemplo "Genius").

Hogara se diferencia por cuatro cosas:
1. Verificación de usuarios (KYC) y de propiedades (documentos revisados por un moderador).
2. Custodia (escrow): el dinero de reservas y depósitos queda retenido hasta cumplir cada paso.
3. Legal guiado: un abogado IA que orienta y un abogado colegiado que valida.
4. Herramientas de IA para agentes: publicación en bucle a redes sociales y un CRM con prompts.

## Cómo quiero que trabajes
- Trabaja por fases, en orden. No pases a la siguiente fase sin terminar la actual y mostrarme cómo probarla.
- Al iniciar cada fase, propón un plan corto y espera mi aprobación.
- Toda integración externa (KYC, custodia, Meta, WhatsApp, IA, mapas, tasa de cambio) va detrás de
  una interfaz en `src/services/` con una implementación MOCK por defecto. Las implementaciones reales
  se activan con variables de entorno. Nunca hagas hardcode de claves.
- Usa TypeScript estricto, componentes pequeños y nombres en inglés en el código. Los textos de la UI van en español e inglés con i18n.
- Escribe tests para la lógica de negocio: custodia, ofertas, cálculo de crédito y permisos.
- Al terminar cada tarea, actualiza `PROGRESS.md` con lo hecho, lo pendiente y cómo probarlo.
- Si algo es ambiguo, pregúntame antes de inventarlo.

## Despliegue
- Web en Vercel (export web de Expo) con dominio gratis `*.vercel.app`.
- Backend Supabase (plan gratis).

## Stack
- App: Expo (React Native) + Expo Router + TypeScript, con soporte web.
  - Móvil: comprador.
  - Web y móvil: agente y administrador.
- Backend: Supabase (Auth, Postgres, Storage, Realtime, Edge Functions).
- Estado y datos: TanStack Query + Zustand.
- UI: NativeWind (Tailwind), modo claro y oscuro, íconos Tabler o Lucide.
- Mapas: react-native-maps en móvil, Mapbox o Google Maps en web.
- i18n: i18next (es por defecto, en como segundo idioma).
- IA: API de Anthropic (Claude) desde Edge Functions. Nunca llames la API de IA desde el cliente.
- Pagos y custodia: interfaz `EscrowProvider` con un mock. En producción la opera una entidad
  financiera regulada; Hogara solo coordina los pasos y muestra el estado.

## Roles
- `buyer` (comprador o inquilino)
- `agent` (agente, inmobiliaria o vendedor particular)
- `admin` (equipo Hogara: moderación, disputas y métricas)

Todos los permisos se aplican con Row Level Security en Supabase.

## Modelo de datos (Postgres)
- profiles: id, role, full_name, national_id, kyc_status (pending|verified|rejected),
  terms_accepted_at, plus_level (1-3), language, currency_pref
- agencies: id, name, owner_id, plan (basic|pro|enterprise), plan_expires_at, founding_partner bool
- properties: id, agency_id, owner_id, title, operation (sale|rent), type (apartment|house|townhouse|studio|commercial),
  zone, city, lat, lng, bedrooms, bathrooms, area_m2, price_usd, description,
  status (draft|pending_review|published|rejected|sold|rented), verified bool, has_tour360 bool,
  tour_url, units_available int, trust_score int, created_at
- property_media: id, property_id, url, kind (photo|video|tour360), order
- property_documents: id, property_id, kind (deed|tax_clearance|power_of_attorney|other), url, status
- price_history: id, property_id, price_usd, recorded_at
- favorites: user_id, property_id
- recently_viewed: user_id, property_id, viewed_at
- search_alerts: id, user_id, query_text, parsed_filters jsonb, active bool
- conversations / messages: chat entre comprador y agente (Realtime). Los teléfonos quedan ocultos por defecto.
- visits: id, property_id, buyer_id, scheduled_at, status
- offers: id, property_id, buyer_id, amount_usd, status (sent|countered|accepted|rejected|expired),
  counter_amount_usd, parent_offer_id
- transactions: id, property_id, buyer_id, offer_id, kind (purchase|rental), amount_usd,
  escrow_amount_usd, escrow_fee_usd, step (0-5), status (active|completed|disputed|refunded|cancelled)
- transaction_steps: id, transaction_id, step_number, name, completed_at, completed_by
- transfer_checklist: id, transaction_id, item, done bool, verified_by_lawyer bool
- disputes: id, transaction_id, opened_by, reason, status (open|refunded|released), resolved_by, resolved_at
- reviews: id, transaction_id, reviewer_id, agency_id, property_id, score_overall, score_location,
  score_documents, score_service, score_fair_price, comment
  (solo se permite si la transacción está `completed`)
- leads: id, agency_id, name, source (facebook|instagram|whatsapp|tiktok|web|diaspora),
  interactions int, temperature (hot|warm|cold), first_response_minutes, property_id, created_at
- social_posts: id, property_id, channel, external_id, status, published_at
- marketplace_services: id, category (movers|remodel|insurance|furniture|appraisal|tour360), provider, price_from, commission_pct
- notifications: id, user_id, kind, payload jsonb, read bool, created_at
- ai_legal_sources: id, title, content, reviewed_by_lawyer bool, updated_at

## Reglas de negocio (con tests)
1. Solo un usuario con `kyc_status = verified` y `terms_accepted_at` puede ofertar, reservar o alquilar.
2. Ofertas en venta:
   - Mínimo aceptado por el sistema: 70% del precio publicado.
   - En el MOCK: si la oferta es ≥95% del precio, se acepta automáticamente. Si es menor, el vendedor
     contraoferta con el promedio entre la oferta y el precio. En producción, el agente decide.
3. Reserva de compra = 5% del monto acordado. Depósito de alquiler = 2 meses de canon.
4. Comisión de custodia = 1%. Es gratis para usuarios Hogara Plus nivel 3.
5. Pasos de compra: oferta aceptada → reserva en custodia → revisión legal → firma en registro → fondos liberados.
   Pasos de alquiler: solicitud aprobada → depósito en custodia → contrato firmado → entrega de llaves → depósito protegido.
6. Al completar la "revisión legal", los tres primeros ítems del checklist de traspaso quedan marcados.
7. Se puede abrir una disputa desde el paso 2. Mientras esté abierta, los fondos quedan congelados y no
   se puede avanzar. Solo el admin la resuelve, con reembolso o liberación.
8. Garantía: si el traspaso falla por causa del vendedor, el comprador recibe el 100% de la reserva.
9. Las reseñas solo provienen de transacciones completadas. La puntuación mostrada es el promedio con un decimal.
10. Palabra según puntuación: ≥9.5 Excepcional, ≥9 Fantástico, ≥8.5 Muy bien, ≥8 Bien, el resto Correcto.
11. El aviso "Solo queda X" se muestra únicamente si `units_available` es real y ≤3. Nunca uses urgencia falsa.
12. Hogara Plus:
    - Nivel 1: 5% de descuento en el marketplace.
    - Nivel 2: 10% y avalúo gratis.
    - Nivel 3: 15%, abogado prioritario y custodia sin comisión.
    - Se sube de nivel por número de transacciones completadas (1, 2, 3+).
13. Trust score (0-100), calculado en el servidor. Pesos sugeridos y ajustables:
    - KYC del dueño: 25
    - Documentos aprobados: 35
    - Reseñas: 20
    - Antigüedad del agente: 10
    - Tour 360°: 10
14. Una publicación nueva entra como `pending_review`. Solo el admin la pasa a `published` y marca `verified`.
15. Simulador de crédito:
    - Cuota francesa: `c = L·r / (1 − (1+r)^−n)`.
    - Muestra qué porcentaje del ingreso representa la cuota: ≤30% saludable, ≤40% ajustado, más de 40% alto riesgo.
    - Siempre muestra el aviso: "Tasas de referencia; la aprobación final es de cada entidad".
16. Moneda: los precios se guardan en USD. La conversión a Bs usa `ExchangeRateProvider` (mock con tasa fija), redondeada.

## Pantallas

### Comprador
1. **Explorar (estilo Booking)**
   - Pestañas Comprar, Alquilar y Vender.
   - Buscador: zona, tipo, habitaciones y presupuesto máximo.
   - Filtros con conteo en vivo: verificadas, tour 360°, 9+ y zona.
   - Ordenar por: recomendados (puntuación × confianza), precio ascendente, precio descendente, puntuación y confianza.
   - Cambio entre lista y mapa con los precios como pines.
   - Búsqueda en lenguaje natural con IA. Convierte el texto en filtros y ofrece crear una alerta.
2. **Tarjeta de resultado:** foto, sello 360°, nombre, zona, tipo, habitaciones, puntuación con palabra y
   cantidad de reseñas, sello de verificada, "Reserva protegida en custodia", aviso de disponibilidad real,
   precio y botón "Ver disponibilidad".
3. **Detalle:**
   - Galería y tour 360°.
   - Precio con gráfica del historial.
   - Valor estimado por IA y nota de si hay margen para negociar.
   - Trust score.
   - Puntuación por categoría con barras.
   - Chat, agendar visita y favorito.
   - Desglose de reserva: monto, comisión, descuento Plus, total y garantía.
4. **Comparar** dos propiedades lado a lado.
5. **Transacción:** ofertas y contraofertas, pasos de custodia, botón de disputa y calificación al final.
6. **Crédito:** simulador con comparación de tres bancos.
7. **Legal:** chat con el abogado IA y checklist de traspaso.
8. **Cuenta:** KYC, términos, Hogara Plus, favoritos, vistos recientemente, marketplace e idioma y moneda.
9. **Notificaciones.**

### Agente
1. **Panel:**
   - Métricas: leads nuevos, tiempo de respuesta promedio, conversión de visita a oferta y cierres del mes.
   - Consejo de la IA si el tiempo de respuesta supera 15 minutos.
2. **CRM:**
   - Lista de leads con origen, interacciones, temperatura y tiempo de respuesta.
   - Campo de prompt en lenguaje natural que la IA traduce a filtros. Ejemplos: "leads de Facebook con más
     de 3 interacciones", "calientes para llamar hoy", "sin responder a tiempo".
3. **Publicar:**
   - Formulario con fotos, documentos, venta o alquiler.
   - Precio sugerido y descripción generados por IA.
   - Selección de canales para el bucle de redes.
4. **Planes:**
   - Básico $49: 10 publicaciones y CRM.
   - Pro $99: publicaciones ilimitadas, bucle de redes e IA.
   - Empresa $199: equipo, API y reportes.
   - Aliados fundadores: 3 meses gratis.

### Admin
1. **Moderación:** cola de publicaciones y documentos, con las acciones aprobar o pedir documentos.
2. **KYC:** cola de verificaciones.
3. **Disputas:** detalle de cada caso, con las acciones reembolsar o liberar.
4. **Métricas:** usuarios activos, agencias, publicaciones, porcentaje de verificadas, volumen en custodia e ingresos.

## IA (Edge Functions, API de Claude)
- `ai-search`: convierte texto libre a filtros en JSON con un esquema validado (zone, type, operation,
  bedrooms_min, price_max, keywords).
- `ai-legal`: responde solo con base en `ai_legal_sources` revisadas por abogados (RAG).
  - Si no encuentra la respuesta, lo dice y ofrece conectar con un abogado colegiado.
  - Siempre incluye el aviso de que es orientación, no asesoría legal vinculante.
- `ai-listing`: genera la descripción de la propiedad y un rango de precio con datos de la zona.
- `ai-crm`: convierte un prompt en filtros del CRM. Nunca ejecuta SQL libre: solo filtros de una lista permitida.
- `ai-valuation`: en el MVP, promedio por zona y m² de los datos propios. Un modelo más avanzado viene después.

## Bucle de redes
- Interfaz `SocialPublisher` con implementaciones: `MetaPagesPublisher` (Facebook Pages + Instagram Graph API),
  `WhatsAppCatalogPublisher` y `TikTokPublisher`.
- Captura de leads: webhook de Meta Lead Ads hacia `leads`, guardando el canal de origen.
- Nota: Facebook Marketplace no permite publicación automática para particulares. Usa catálogos y páginas,
  más un botón de "compartir asistido".

## Diseño
- Identidad Hogara: color principal azul petróleo o verde azulado (propón una paleta) y tipografía sans moderna.
- Patrones de UX tomados de Booking: buscador prominente, filtros con conteo, insignia de puntuación,
  desglose de precio y garantía visible antes de pagar.
- Accesibilidad: contraste AA, tamaños táctiles de 44px o más y etiquetas en botones de solo ícono.

## Fases
- **Fase 1 — Base:** proyecto Expo + Supabase, auth, roles, i18n, tema, navegación por rol, esquema de base
  de datos con RLS y datos semilla (6 propiedades de Caracas).
- **Fase 2 — Explorar y detalle:** buscador, filtros, orden, mapa, tarjetas, detalle, favoritos, vistos y comparar.
- **Fase 3 — Agente:** publicar, moderación del admin, CRM con datos mock, panel de métricas y planes.
- **Fase 4 — Transacción:** KYC mock, ofertas, custodia mock con pasos, disputas, reseñas y Hogara Plus.
- **Fase 5 — IA:** las cinco Edge Functions con la API de Claude.
- **Fase 6 — Integraciones reales:** Meta, WhatsApp, KYC real, proveedor de custodia y tasa de cambio, todo detrás de feature flags.
- **Fase 7 — Calidad:** tests end-to-end (Maestro o Playwright), analítica de eventos, monitoreo de errores (Sentry) y preparación para tiendas.

## Criterios de aceptación del MVP (fases 1 a 4)
- Un comprador puede registrarse, verificarse (mock), buscar, filtrar, ver el mapa, ofertar, recibir una
  contraoferta, aceptarla, depositar en custodia (mock), avanzar los pasos, abrir una disputa y calificar.
- Un agente puede publicar una propiedad que queda pendiente, y aparece en la búsqueda solo tras la aprobación del admin.
- Un admin puede aprobar publicaciones y resolver disputas, y las notificaciones llegan a las partes.
- Todos los textos están disponibles en español e inglés, y los precios se muestran en USD o Bs.
- Los tests de las reglas de negocio 1 a 16 pasan.

## Fuera de alcance por ahora
- Pagos reales y licencias financieras: requieren una entidad aliada y revisión legal.
- Contenido legal definitivo: los términos y la base de conocimiento legal los entrega un abogado.
