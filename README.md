# TusPlanos3D — web (réplica estructural de spaceplanner.com)

Sitio de tipo portfolio construido con **Next.js (App Router) + TypeScript + Tailwind**, exportado
estáticamente para **GitHub Pages**, con **Supabase** como base de datos y **Resend** (vía una
Edge Function de Supabase) para los avisos por email.

- Marca: **TusPlanos3D** (`src/content/site.json`; logo a mano en `public/img/logo.svg`)
- Dominio previsto: **msoft1.com.es** (registrado en Harsys, pendiente de apuntar a GitHub Pages)
- Herramienta: **generador de planos** en `/herramientas/plano/` — estancias, mobiliario (31 piezas)
  y elementos de construcción (tabiques, puertas, ventanas, columnas, escalera) con descarga en
  **PDF (A4 apaisado), JSON editable y SVG**. Revisión local: `node scripts/preview-server.mjs`
  → `http://localhost:4173/herramientas/plano/`

## Estructura

```
src/
  app/
    page.tsx            Inicio (portada, destacados, método, CTA)
    proceso/page.tsx    Método de trabajo (ejes + fases)
    proyectos/page.tsx  Galería con filtro y lightbox + tableros de diseño
    credenciales/page.tsx  Formación, premios, publicaciones (plantilla sin claims)
    contacto/page.tsx   Datos de contacto + formulario
    privacidad/page.tsx Información de tratamiento de datos (enlazado desde el formulario)
    layout.tsx          Cabecera, barra lateral de accesos y pie
  components/           SiteHeader, SiteFooter, SideRail, ProjectGallery, ContactForm
  content/*.json        Contenido editable (sitio, proyectos, método, credenciales)
  lib/                  data.ts (lectura de datos), supabase.ts, base.ts, nav.ts
scripts/generate-placeholders.mjs   Genera las imágenes de muestra en public/img
supabase/migrations/*.sql           Esquema + RLS
supabase/functions/contact-notify   Edge Function que envía el email con Resend
.github/workflows/deploy.yml        Build + despliegue en GitHub Pages
```

## Arrancar en local

```bash
npm install
npm run placeholders   # genera las imágenes de muestra (solo la primera vez)
npm run dev
npm run typecheck && npm run lint && npm run build
```

## Contenido

Todo el texto visible procede de `src/content/*.json` y es **estructura de muestra**:
sustitúyelo por tus contenidos reales. Las imágenes de `public/img` son marcadores SVG con el
mismo nombre que se espera en producción (`cocina-01.svg`, `bano-02.svg`, `board-01.svg`…):
pon tus fotos con esos nombres o actualiza `projects.json`.

La página de credenciales no muestra cifras, premios ni publicaciones hasta que aportes
documentación verificable; el método de trabajo indica en cada fase que honorarios, plazos y
disponibilidad se confirman por caso.

## Supabase

1. Crea un proyecto y aplica `supabase/migrations/20261029000000_init.sql`
   (SQL Editor → New query → pega el contenido → Run).
2. Copia `.env.example` a `.env` y rellena:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. RLS: `contact_requests` solo admite inserción desde el cliente; `projects` es de lectura
   pública sólo si `published = true`. La escritura se hace con el service role.

La web construye sin credenciales: si no hay Supabase, se usan los JSON de `src/content`.

## Resend (avisos por email)

```bash
supabase secrets set RESEND_API_KEY=... CONTACT_TO_EMAIL=... CONTACT_FROM_EMAIL=...
supabase functions deploy contact-notify
```

Y en `.env`: `NEXT_PUBLIC_CONTACT_FUNCTION_URL=https://<ref>.supabase.co/functions/v1/contact-notify`.

El envío del email es **mejor esfuerzo**: si falla, la solicitud ya está guardada y el usuario
no ve un error falso.

## Despliegue en GitHub Pages

1. Repo en GitHub → *Settings → Pages → Source: GitHub Actions*.
2. El workflow `.github/workflows/deploy.yml` ejecuta `typecheck`, `lint` y `build` y publica
   `out/`. Detecta solo si el repo es `usuario.github.io` (raíz) o de proyecto (`/nombre-repo`).
3. **Dominio propio (msoft1.com.es):** define la *Actions variable* `CUSTOM_DOMAIN=msoft1.com.es`
   en *Settings → Secrets and variables → Actions → Variables*. El workflow deja `basePath` vacío
   y escribe `out/CNAME`. En Harsys, apunta el dominio a GitHub Pages:
   - Registro **A** con las IP de GitHub: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - o registro **CNAME** (si Harsys lo permite) hacia `usuario.github.io`
   - marca el dominio como verificado en *Settings → Pages → Custom domain* y activa **Enforce HTTPS**
4. Para usar Supabase en producción, añade en *Settings → Secrets and variables → Actions*:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `NEXT_PUBLIC_CONTACT_FUNCTION_URL`.

No se ha desplegado ni publicado nada desde este entorno.

## Antes de publicar

- Revisar `/privacidad/` con asesoramiento legal (responsable, base jurídica, plazos,
  destinatarios).
- Sustituir teléfono, email y dirección de `src/content/site.json`.
- Aportar fotos y textos reales de proyectos.
