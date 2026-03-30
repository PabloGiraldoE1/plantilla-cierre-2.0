
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Project Overview

**Plantilla de Gestión de Incidentes** — an Angular 21.1 / TypeScript 5.9 web application for logging and closing support incidents. Users fill a form, generate a formatted closure text (plain-text template), and optionally save it to a browsable history. A second form generates a technical template (`PlantillaTecnica`). All data is persisted in **localStorage only** — there is no active backend connection.

### Key Paths

| Path | Purpose |
|------|---------|
| `src/app/app.routes.ts` | Route definitions (hash routing, all eager-loaded) |
| `src/app/app.config.ts` | `ApplicationConfig` — `withHashLocation()` for GitHub Pages |
| `src/app/components/` | One directory per routed component |
| `src/app/services/` | Five singleton services |
| `src/app/models/` | `Incidente` and `PlantillaTecnica` interfaces |
| `backend-api/` | Optional PHP/MySQL backend — **NOT currently connected** |

## Architecture

### Routes

All routes are currently **eager-loaded**. Use lazy loading for any new routes.

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

- **Constructor injection** — existing components use constructor injection instead of `inject()`. Use `inject()` for all new code.
- **Missing `ChangeDetectionStrategy.OnPush`** — existing components lack it. Add it when touching a component.
- **Eager route loading** — existing routes in `app.routes.ts` are eager. Use lazy loading (`loadComponent`) for any new routes.
- **`CommonModule` imports** — some components import `CommonModule`. Prefer importing only the specific directives needed (e.g., `DatePipe`, `AsyncPipe`) in standalone components.

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
