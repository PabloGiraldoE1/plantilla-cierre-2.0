
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Project Overview

**Plantilla de Gestión de Incidentes** — an Angular 21.1 / TypeScript 5.9 web application for logging and closing support incidents. Users fill a form, generate a formatted closure text (plain-text template), and optionally save it to a browsable history. A second form generates a technical template (`PlantillaTecnica`). All data is persisted in **localStorage only** — there is no active backend connection.

### Key Paths

| Path | Purpose |
|------|---------|
| `src/app/app.routes.ts` | Route definitions (hash routing, lazy-loaded) |
| `src/app/app.config.ts` | `ApplicationConfig` — `withHashLocation()` for GitHub Pages |
| `src/app/components/` | One directory per routed component |
| `src/app/services/` | Seven singleton services |
| `src/app/components/icon/` | `Icon` — inline SVG icon component (`<app-icon name="…" />`) |
| `src/app/models/` | `Incidente` and `PlantillaTecnica` interfaces |
| `src/environments/environment.ts` | Groq credentials (API key or proxy URL) and model id |
| `proxy-groq/` | Optional Cloudflare Worker that keeps the Groq key server-side |
| `backend-api/` | Optional PHP/MySQL backend — **NOT currently connected** |

## Architecture

### Routes

All routes are **lazy-loaded** via `loadComponent` and carry a `title`. Keep that pattern for new routes.

| Route | Component | Description |
|-------|-----------|-------------|
| `/formulario` | `FormularioIncidente` | Main incident closure form |
| `/plantilla-tecnica` | `PlantillaTecnicaComponent` | Technical template form |
| `/historial` | `HistorialIncidentes` | History, search, export |
| `/agrupadores` | `ListaAgrupadores` | Grouper catalogue + external ticket generator |

### Services

| Service file | Class | Responsibility |
|---|---|---|
| `services/incidente.ts` | `IncidenteService` | Read-only reference data: `agrupadoresPorCategoria`, `aplicativos`, `procesos`; helper methods `filtrarAgrupadores`, `generarExternalTicket`, `validarHURaizal`, `extraerNumeroRaizal` |
| `services/storage.ts` | `Storage` | localStorage CRUD for `Incidente` and `PlantillaTecnica` |
| `services/backend-api.ts` | `BackendApiService` | localStorage CRUD for `HURaizal` (predefined list + custom) and `ExternalTicketHistorial`; also houses the `HURaizal` and `ExternalTicketHistorial` interfaces |
| `services/agrupador-seleccionado.ts` | `AgrupadorSeleccionado` | Signal-based one-shot cross-component state: value is cleared after first `getAgrupador()` call |
| `services/incidente-compartido.ts` | `IncidenteCompartido` | Signal-based state for passing an `Incidente` (recover to form) or `Partial<Incidente>` draft across routes |
| `services/theme.ts` | `ThemeService` | Signal-based light/dark/system theme; persists to `tema_preferido` and writes `data-theme` on `<html>` |
| `services/groq.ts` | `GroqService` | Rewrites the incident solution text through Groq; throws `GroqError` with a ready-to-show Spanish message |

### Models

```typescript
// src/app/models/incidente.ts
interface Incidente { id?, fecha?, causaError, huRaizal, causaRaiz, descripcionSolucion, confirmacionUsuario }

// src/app/models/plantilla-tecnica.ts
interface PlantillaTecnica { id?, fecha?, aplicacionAfectada, po, contextoTecnico, codigoIncidentes,
  incidentesPorMes, impactoNegocio, solucionPuntual, afectaCanalAsesor, requiereBarrido, descripcionError }

// HURaizal and ExternalTicketHistorial interfaces live in services/backend-api.ts, NOT in models/
```

### localStorage Keys

| Key | Content |
|-----|---------|
| `incidentes_historial` | `Incidente[]` |
| `plantillas_tecnicas` | `PlantillaTecnica[]` |
| `raizales_custom_cache` | `HURaizal[]` (user-added only; predefined list is in `IncidenteService`) |
| `external_tickets_cache` | `ExternalTicketHistorial[]` (max 10) |
| `tema_preferido` | `light` \| `dark` \| `system` — theme preference |

## SSR & Browser APIs

The project uses **Angular SSR** (`@angular/ssr`). All routes are set to `RenderMode.Prerender` (`src/app/app.routes.server.ts`).

**Any code that uses browser-only APIs (localStorage, navigator, window, document) MUST be guarded:**

```typescript
// Follow the pattern in Storage and BackendApiService:
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class MyService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  doSomething(): void {
    if (!this.isBrowser) return;
    // safe to use localStorage, navigator, etc.
  }
}
```

## Development Workflow

```powershell
npm start              # ng serve — dev server at http://localhost:4200
npm run build          # ng build (development)
ng build --configuration production  # production build
npm test               # ng test via vitest + jsdom
.\deploy.ps1           # deploy to GitHub Pages (requires git remote configured)
```

**Formatter**: Prettier is configured in `package.json` (`singleQuote: true`, `printWidth: 100`). Run `npx prettier --write .` before committing.

## Known Deviations from Best Practices

The following existing code diverges from the guidelines above. **Apply the correct pattern when creating new code or modifying these files:**

- **Constructor injection** — the four routed components still use constructor injection instead of `inject()`. Use `inject()` for all new code (`App`, `Icon` and `ThemeService` already do).
- **Missing `ChangeDetectionStrategy.OnPush`** — the four routed components lack it (`App` and `Icon` have it). Add it when touching a component.

Already aligned: routes are lazy, templates use native control flow (`@if` / `@for`), and no component imports `CommonModule`.

## Design System

`src/styles.scss` defines every color, spacing, radius, shadow and typography token, with a light and a dark palette. **Components must never hardcode colors** — always `var(--token)`:

- Text on a surface: `--text-primary` / `--text-strong` / `--text-secondary` / `--text-tertiary` / `--text-muted`
- Brand as text: `--brand-text` (never `--color-indigo`, which is tuned for fills)
- Brand as fill: `--brand-solid` / `--brand-gradient` with `--on-brand` for the label
- Surfaces: `--bg-page` / `--bg-surface` / `--bg-subtle` / `--bg-muted`, plus `--border`
- Neutral (secondary) buttons: `--btn-neutral-from` / `--btn-neutral-to` / `--on-btn-neutral`
- Headings with a gradient: `--heading-gradient`

Dark mode activates from `data-theme="dark"` on `<html>` (set by `ThemeService`) or from `prefers-color-scheme` when the user has not chosen. `src/index.html` carries a small inline script that applies the stored theme before first paint.

### Icons

Use `<app-icon name="…" />` (see `components/icon/icon.ts`) instead of emojis. Icons are decorative by default; pass `label` when the icon is the only content of a control, or give the control an `aria-label`. To add an icon, add its name to `IconName` and its path to `PATHS` (24×24 grid, stroke style).

### Accessibility checks

All four routes pass axe-core with zero violations in both themes. Keep it that way: clickable elements are `<button>`, sortable table headers carry `aria-sort`, modals use `role="dialog"` + `aria-modal` + `aria-labelledby`, toasts use `role="status"`, and every form control has an associated `<label for>` (radio groups use `<fieldset><legend>`).

## Groq — mejora automática de la redacción

`FormularioIncidente.generarTexto()` sends the solution field to Groq and uses the rewrite directly in the generated closure text — there is no separate "improve" button or preview step; it happens as part of clicking "Generar Texto". While Groq responds, the button shows a spinner ("Mejorando con IA…") and is disabled. If Groq fails or isn't configured, `generarTexto()` falls back to the analyst's original text and still produces the closing text — it never blocks on Groq.

Configure **one** of the two fields in `src/environments/environment.ts`:

- `groqApiKey` — the browser calls Groq directly. **The key ends up in the published bundle and is readable by anyone who opens the site.** Groq's free tier needs no credit card, so the exposure costs no money, but a leaked key can be used until it is rotated, and GitHub's secret scanning may revoke it if it is committed to a public repo.
- `groqProxyUrl` — the browser calls your own proxy, which holds the key. `proxy-groq/worker.js` is a ready Cloudflare Worker; its header comment has the deploy steps. When this field is set, `GroqService` never sends an `Authorization` header.

With both fields empty `iaDisponible` is `false`, `generarTexto()` skips Groq entirely, and the rest of the app works normally. Rate limits live at `console.groq.com/settings/limits`; the free tier resets on its own (no monthly quota to renew) and returns HTTP 429 when exhausted.

Model ids change: check `console.groq.com/docs/models` before switching `groqModelo`. As of September 2026 the Llama models are Enterprise-only and `openai/gpt-oss-20b` is the fast production model.

## Optional PHP Backend

`backend-api/` contains a PHP/MySQL backend (requires XAMPP). It is **not connected** to the Angular app — `BackendApiService` currently reads/writes localStorage only. See `backend-api/README.md` for setup instructions if integration is needed.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
