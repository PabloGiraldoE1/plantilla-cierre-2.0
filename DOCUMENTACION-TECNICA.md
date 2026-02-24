# 📚 Documentación Técnica — Plantilla de Gestión de Incidentes v2.0

> Documento de referencia completo sobre la arquitectura, componentes, servicios y flujos de la aplicación.

---

## Tabla de Contenidos

1. [Descripción General](#1-descripción-general)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Estructura de Carpetas](#3-estructura-de-carpetas)
4. [Arquitectura de la Aplicación](#4-arquitectura-de-la-aplicación)
5. [Modelos de Datos](#5-modelos-de-datos)
6. [Servicios](#6-servicios)
7. [Componentes](#7-componentes)
8. [Rutas y Navegación](#8-rutas-y-navegación)
9. [Flujos Principales](#9-flujos-principales)
10. [Persistencia de Estado](#10-persistencia-de-estado)
11. [Glosario de Términos Angular](#11-glosario-de-términos-angular)

---

## 1. Descripción General

Esta aplicación web permite a los agentes de soporte **gestionar y documentar incidentes técnicos**. Provee herramientas para:

- Generar plantillas de cierre de incidentes de forma estandarizada.
- Consultar y buscar el catálogo de agrupadores de errores.
- Generar _External Tickets_ combinando aplicativo, proceso y agrupador.
- Registrar raizales técnicos para análisis de causa raíz.
- Consultar el historial de incidentes guardados localmente.

---

## 2. Stack Tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| **Angular** | v20+ | Framework principal (standalone components) |
| **TypeScript** | 5.x | Lenguaje de programación |
| **RxJS** | 7.x | Manejo de streams y suscripciones |
| **Angular Reactive Forms** | — | Formularios reactivos con validación |
| **localStorage** | Web API | Persistencia local de datos |
| **SCSS** | — | Estilos con variables y anidamiento |

### Configuración Angular (`app.config.ts`)

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // Captura errores globales del browser
    provideRouter(routes),                // Activa el sistema de rutas
    provideClientHydration(withEventReplay()) // SSR: rehidratación con replay de eventos
  ]
};
```

> **`provideClientHydration`**: permite que una app renderizada en servidor (SSR) se rehidrate en el cliente sin perder eventos del usuario ocurridos antes de que Angular terminara de cargar.

---

## 3. Estructura de Carpetas

```
src/
└── app/
    ├── app.ts                   # Componente raíz
    ├── app.html                 # Navbar + router-outlet
    ├── app.routes.ts            # Definición de rutas
    ├── app.config.ts            # Configuración de providers
    │
    ├── models/
    │   ├── incidente.ts         # Interface Incidente
    │   └── plantilla-tecnica.ts # Interface PlantillaTecnica
    │
    ├── services/
    │   ├── incidente.ts             # Datos maestros + lógica de negocio
    │   ├── storage.ts               # CRUD en localStorage
    │   ├── incidente-compartido.ts  # Estado compartido entre componentes (signals)
    │   └── agrupador-seleccionado.ts # Signal para pasar agrupador entre vistas
    │
    └── components/
        ├── formulario-incidente/    # Pestaña "Plantilla de Cierre"
        ├── lista-agrupadores/       # Pestaña "Ver Agrupadores"
        ├── plantilla-tecnica/       # Pestaña "Raizales"
        └── historial-incidentes/    # Pestaña "Historial"
```

---

## 4. Arquitectura de la Aplicación

```
┌─────────────────────────────────────────────────┐
│                   App (Root)                    │
│        Navbar  ──  router-outlet                │
└────────────────────┬────────────────────────────┘
                     │ rutas
       ┌─────────────┼──────────────┬──────────────┐
       ▼             ▼              ▼              ▼
  /formulario   /agrupadores  /plantilla-tecnica  /historial
       │             │              │              │
  FormularioIn  ListaAgrupa   PlantillaTecnica  HistorialIn
  cidente       dores         Component         cidentes
       │             │              │              │
       └─────────────┴──────────────┴──────────────┘
                         │  inyectan (inject / constructor)
              ┌──────────┼──────────────┐
              ▼          ▼              ▼
        IncidenteS   Storage      IncidenteC
        ervice                    ompartido
        (datos      (localStorage) (borrador/
        maestros)                  recuperar)
```

### Flujo de comunicación entre componentes

- **Datos maestros** (listas de agrupadores, aplicativos, procesos) → `IncidenteService` → inyectado en `ListaAgrupadores` y `FormularioIncidente`.
- **Borrador del formulario** → `IncidenteCompartido.setBorrador()` → se conserva al cambiar de pestaña.
- **Recuperar incidente del historial** → `IncidenteCompartido.setIncidente()` + navegación a `/formulario`.
- **Guardar historial** → `Storage.guardarIncidente()` → `localStorage`.

---

## 5. Modelos de Datos

### `Incidente` (`models/incidente.ts`)

Representa un incidente de soporte cerrado o en progreso.

```typescript
export interface Incidente {
  id?: string;               // Generado automáticamente (INC-timestamp-random)
  fecha?: Date;              // Asignada al guardar
  causaError: string;        // Ej: "6. Errores de la aplicación"
  huRaizal: string;          // Código HU. No permite N/A
  causaRaiz: string;         // "Identificada" | "Sin Identificar"
  descripcionSolucion: string; // Texto libre con la solución aplicada
  confirmacionUsuario: string; // "Si" | "No"
}
```

> El campo `id` sigue el formato `INC-{timestamp}-{9 caracteres aleatorios}`, garantizando unicidad.

---

### `PlantillaTecnica` (`models/plantilla-tecnica.ts`)

Representa un raizal técnico para análisis de causas sistémicas.

```typescript
export interface PlantillaTecnica {
  id?: string;
  fecha?: Date;
  aplicacionAfectada: string;  // Nombre del sistema afectado
  po: string;                  // Product Owner responsable
  contextoTecnico: string;     // Descripción técnica del problema
  codigoIncidentes: string;    // Códigos/IDs de incidentes relacionados
  incidentesPorMes: string;    // Frecuencia mensual
  impactoNegocio: string;      // Descripción del impacto
  solucionPuntual: string;     // Link o descripción de la solución (Confluence)
  afectaCanalAsesor: string;   // "SI" | "NO"
  requiereBarrido: string;     // "SI" | "NO"
  descripcionError: string;    // Error completo detallado
}
```

---

## 6. Servicios

### `IncidenteService` (`services/incidente.ts`)

**Propósito**: Proveedor de datos maestros y lógica de negocio relacionada con incidentes.

**Scope**: `providedIn: 'root'` → Singleton global.

#### Propiedades principales

| Propiedad | Tipo | Descripción |
|---|---|---|
| `agrupadoresPorCategoria` | `{ [key: string]: string[] }` | Catálogo completo de agrupadores clasificados por categoría |
| `opcionesAgrupador` | `string[]` | Lista plana de todos los agrupadores (para autocompletado) |
| `aplicativos` | `string[]` | Lista de aplicativos disponibles en el sistema |
| `procesos` | `string[]` | Lista de procesos disponibles |

#### Categorías de agrupadores

| Categoría | Descripción |
|---|---|
| `ALERTAMIENTO` | Reportes de monitoreo Dynatrace |
| `SIMONNET` | Gestión Documental SimonNet |
| `HOME COTIZADOR / MIS NEGOCIOS` | Portal principal del cotizador |
| `COTIZADORES` | Todos los cotizadores de productos |
| `AUS` | Sistema AUS de radicados |
| `AVA` | Portal AVA de pólizas |
| `PORCHAT` | Módulo de documentos PorChat |
| `INGRESO DIGITAL` | Flujos de ingreso digital |

#### Métodos

```typescript
// Filtra agrupadores que contienen el texto de búsqueda
filtrarAgrupadores(busqueda: string): string[]

// Genera el external ticket en formato: "Aplicativo.Proceso Agrupador"
generarExternalTicket(aplicativo: string, proceso: string, agrupador: string): string

// Valida que HU Raizal no sea N/A, NA o "No aplica"
validarHURaizal(valor: string): boolean
```

#### Ejemplo de External Ticket generado

```
Cotizador Salud.Expedir Error en calculos de prima de cotización
```

---

### `Storage` (`services/storage.ts`)

**Propósito**: CRUD completo sobre `localStorage` para incidentes y plantillas técnicas.

**Scope**: `providedIn: 'root'` → Singleton global.

**Claves de localStorage**:
- `incidentes_historial` → Array de `Incidente[]`
- `plantillas_tecnicas` → Array de `PlantillaTecnica[]`

> Detecta si está en entorno browser con `isPlatformBrowser(platformId)` para compatibilidad SSR.

#### Métodos para Incidentes

| Método | Descripción |
|---|---|
| `guardarIncidente(incidente)` | Agrega al array, genera `id` y `fecha` automáticamente |
| `obtenerHistorial()` | Retorna todos los incidentes guardados |
| `eliminarIncidente(id)` | Filtra y guarda sin el incidente indicado |
| `limpiarHistorial()` | Elimina la clave completa del localStorage |
| `exportarJSON()` | Devuelve el historial serializado como JSON indentado |
| `exportarCSV()` | Devuelve el historial en formato CSV |

#### Métodos para Plantillas Técnicas

| Método | Descripción |
|---|---|
| `guardarPlantillaTecnica(plantilla)` | Guarda una nueva plantilla técnica |
| `obtenerPlantillasTecnicas()` | Retorna todas las plantillas guardadas |
| `eliminarPlantillaTecnica(id)` | Elimina una plantilla por su ID |
| `limpiarPlantillasTecnicas()` | Elimina todas las plantillas |

---

### `IncidenteCompartido` (`services/incidente-compartido.ts`)

**Propósito**: Compartir estado reactivo entre componentes sin necesidad de `@Input`/`@Output`.

**Scope**: `providedIn: 'root'` → Singleton global.

Usa **signals** de Angular para gestionar dos piezas de estado:

#### Signal 1: `incidenteRecuperado`

Permite cargar un incidente del historial de vuelta al formulario.

```typescript
setIncidente(incidente: Incidente): void   // Historial → Formulario
getIncidente(): Incidente | null           // Formulario lo lee en ngOnInit
limpiarIncidente(): void                   // Se llama justo después de leerlo
```

**Flujo**:
```
HistorialIncidentes.recuperarIncidente()
  → incidenteCompartido.setIncidente(inc)
  → router.navigate(['/formulario'])
  → FormularioIncidente.ngOnInit()
      → cargarIncidenteRecuperado()
          → formulario.patchValue(inc)
          → limpiarIncidente()
```

#### Signal 2: `borrador`

Persiste el estado del formulario mientras el usuario navega entre pestañas.

```typescript
setBorrador(valores: Partial<Incidente>): void  // Se llama en cada valueChange
getBorrador(): Partial<Incidente> | null        // Se carga en ngOnInit
limpiarBorrador(): void                         // Se llama al limpiar el formulario
```

**Flujo**:
```
Usuario escribe en formulario
  → formulario.valueChanges (subscribe con takeUntil)
      → incidenteCompartido.setBorrador(valores)

Usuario cambia de pestaña y vuelve
  → FormularioIncidente.ngOnInit()
      → cargarBorrador()
          → formulario.patchValue(borrador)   ← estado restaurado ✅
```

---

### `AgrupadorSeleccionado` (`services/agrupador-seleccionado.ts`)

**Propósito**: Transportar el agrupador seleccionado desde `ListaAgrupadores` hacia `FormularioIncidente` si se usa ese flujo.

```typescript
setAgrupador(agrupador: string): void  // Guarda el agrupador
getAgrupador(): string                 // Lee y limpia automáticamente
```

> **Nota**: Al llamar `getAgrupador()` se resetea la signal automáticamente (lectura destructiva).

---

## 7. Componentes

### `App` (`app.ts`) — Componente Raíz

**Selector**: `app-root`

Contiene la barra de navegación con los 4 links principales y el `<router-outlet>` donde se montan las vistas.

```
Pestañas:
  📝 Plantilla de Cierre   → /formulario
  📋 Ver Agrupadores       → /agrupadores
  🔧 Raizales              → /plantilla-tecnica
  📊 Historial             → /historial
```

---

### `FormularioIncidente` (`components/formulario-incidente/`)

**Ruta**: `/formulario`

**Propósito**: Formulario reactivo para generar la plantilla de cierre de un incidente.

#### Campos del formulario

| Campo | Control | Validación | Descripción |
|---|---|---|---|
| `causaError` | `<select>` | Requerido | Causa del error (20 opciones catalogadas) |
| `huRaizal` | `<input text>` | Requerido + No N/A | Código de HU o mejora relacionada |
| `causaRaiz` | `<select>` | Requerido | "Identificada" o "Sin Identificar" |
| `descripcionSolucion` | `<textarea>` | Requerido | Descripción detallada de la solución aplicada |
| `confirmacionUsuario` | `<select>` | Requerido | "Si" o "No" (default: "Si") |

#### Causas de Error disponibles (20 opciones)

| # | Causa |
|---|---|
| 1 | Capacitación - Tiene la opción pero no sabe cómo hacerlo |
| 2 | Capacitación - Desconoce el proceso de Negocio |
| 3 | Capacitación - Desconoce el uso del aplicativo |
| 4 | Mejoras - Redefinición de Políticas y/o Procesos de negocio |
| 5 | Mejoras - Se requiere una nueva funcionalidad |
| 6 | Errores de la aplicación |
| 7 | Perfilación / Accesos - El usuario no cuenta con los permisos |
| 8 | Degradación de Servicios |
| 9 | Datos errados |
| 10 | Solucionado sin acciones - Fue un error Momentáneo |
| 11 | Modificación Dato - Se modifica un Valor el cual era incorrecto |
| 12 | Modificación De Código - Se Modifica Algo del código |
| 13 | Usuario desincronizado |
| 14 | No detectada (Usuario ya no tiene póliza para confirmar) |
| 15 | Error masivo en salud |
| 16 | Actualización APP |
| 17 | Intermitencia servicio externo |
| 18 | Error de autenticación SEUS - salud |
| 19 | Error del dispositivo |
| 20 | Problema externo a la aplicación |

#### Texto generado (salida)

```
* Causa del Error: {causaError}
* HU Raizal / Mejora: {huRaizal}
* Causa Raíz (Identificada/Sin Identificar): {causaRaiz}
* Descripción de Solución: {descripcionSolucion}

Ha sido un gusto ayudarte. En breve recibirás un correo con la resolución
del incidente y una breve encuesta de satisfacción...

* Confirmar Operatividad del Usuario Afectado: {confirmacionUsuario}
```

#### Métodos clave

| Método | Descripción |
|---|---|
| `ngOnInit()` | Inicializa el form, carga borrador, carga incidente recuperado del historial, suscribe `valueChanges` |
| `ngOnDestroy()` | Cancela todas las suscripciones RxJS con `Subject.complete()` |
| `cargarBorrador()` | Restaura el draft guardado en `IncidenteCompartido` |
| `cargarIncidenteRecuperado()` | Carga un incidente que viene del historial |
| `configurarValidaciones()` | Bloquea N/A en el campo `huRaizal` en tiempo real |
| `generarTexto()` | Produce el texto de cierre formateado |
| `guardarIncidente()` | Persiste en localStorage vía `Storage` |
| `copiarAlPortapapeles()` | Copia `textoGenerado` al clipboard |
| `limpiarFormulario()` | Resetea form + vacía `textoGenerado` + limpia borrador |

---

### `ListaAgrupadores` (`components/lista-agrupadores/`)

**Ruta**: `/agrupadores`

**Propósito**: Catálogo visual de agrupadores con dos funcionalidades:

1. **Búsqueda global** por palabra clave que filtra categorías y agrupadores visibles.
2. **Generador de External Ticket** con campo de búsqueda por autocompletado para el agrupador.

#### Variables de estado

| Variable | Tipo | Descripción |
|---|---|---|
| `terminoBusqueda` | `string` | Texto de la búsqueda global que filtra el catálogo |
| `busquedaAgrupadorTicket` | `string` | Texto del autocomplete del campo agrupador en el generador |
| `agrupadorSeleccionadoTicket` | `string` | Agrupador confirmado (verde ✅) en el generador |
| `sugerenciasAgrupador` | `string[]` | Lista de hasta 20 sugerencias del autocomplete |
| `mostrarSugerencias` | `boolean` | Controla visibilidad del dropdown de sugerencias |
| `aplicativoSeleccionado` | `string` | Aplicativo elegido en el generador |
| `procesoSeleccionado` | `string` | Proceso elegido en el generador |
| `externalTicket` | `string` | Resultado generado del External Ticket |

#### Propiedades computadas (getters)

```typescript
// Retorna solo las categorías que tienen agrupadores que coinciden con terminoBusqueda
get categoriasFiltradas(): string[]

// Retorna los agrupadores de una categoría que coinciden con terminoBusqueda
agrupadoresFiltrados(categoria: string): string[]

// Cuenta total de resultados cuando hay búsqueda activa
get resultadosBusqueda(): number
```

#### Autocomplete del agrupador (Generador de Ticket)

El campo "Agrupador del Error" funciona como un combo de búsqueda:

1. El usuario escribe (ej: `reportes`)
2. `filtrarSugerencias()` busca en `incidenteService.opcionesAgrupador` (lista plana de todos los agrupadores)
3. Se filtran máximo 20 coincidencias y se muestran en dropdown
4. Al seleccionar (`seleccionarSugerencia()`), el campo se pinta en verde y se genera el ticket
5. Al hacer clic en un agrupador de la lista del catálogo, también se rellena el campo

```typescript
filtrarSugerencias(): void     // Se dispara en (input), actualiza sugerenciasAgrupador
seleccionarSugerencia(ag)      // Confirma la selección, oculta dropdown
ocultarSugerencias(): void     // Se dispara en (blur) con delay de 200ms para permitir clic
```

> **¿Por qué el delay de 200ms en `ocultarSugerencias`?**
> El evento `blur` del input se dispara antes del `mousedown` del item de la lista.
> Sin el delay, el dropdown desaparece antes de que el clic se registre.

#### Formato del External Ticket

```
{Aplicativo}.{Proceso} {Agrupador}
Ej: "AVA.Consultas Restricción en visualización de póliza"
```

---

### `PlantillaTecnicaComponent` (`components/plantilla-tecnica/`)

**Ruta**: `/plantilla-tecnica`

**Propósito**: Formulario para generar plantillas de análisis de causa raíz (raizales técnicos).

#### Campos del formulario

| Campo | Tipo | Default | Descripción |
|---|---|---|---|
| `aplicacionAfectada` | texto | — | Sistema o aplicativo con el error |
| `po` | texto | — | Product Owner del aplicativo |
| `contextoTecnico` | textarea | — | Descripción técnica del problema |
| `codigoIncidentes` | texto | — | IDs de incidentes relacionados |
| `incidentesPorMes` | texto | — | Cantidad de incidentes en el mes |
| `impactoNegocio` | textarea | — | Descripción del impacto al negocio |
| `solucionPuntual` | texto | — | URL o descripción de la solución (Confluence) |
| `afectaCanalAsesor` | select | `SI` | ¿Afecta al canal asesor? |
| `requiereBarrido` | select | `NO` | ¿Requiere barrrido de datos? |
| `descripcionError` | textarea | — | Descripción técnica completa del error |

---

### `HistorialIncidentes` (`components/historial-incidentes/`)

**Ruta**: `/historial`

**Propósito**: Listado de todos los incidentes guardados con opciones de búsqueda, copia y recuperación.

#### Funcionalidades

| Función | Descripción |
|---|---|
| **Búsqueda** | Filtra por `causaError`, `huRaizal`, `causaRaiz`, `descripcionSolucion` |
| **Copiar** | Genera el texto de cierre y lo copia al portapapeles |
| **Recuperar** | Carga el incidente de vuelta al formulario vía `IncidenteCompartido` |
| **Eliminar** | Elimina un incidente individual del localStorage |
| **Limpiar todo** | Elimina todo el historial (con confirmación) |

#### Flujo "Recuperar incidente"

```
Click en "Recuperar"
  → incidenteCompartido.setIncidente(incidente)
  → router.navigate(['/formulario'])
  → (300ms timeout)
  → FormularioIncidente.ngOnInit()
      → cargarIncidenteRecuperado()
          → formulario.patchValue(incidente)
```

---

## 8. Rutas y Navegación

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '',                 redirectTo: '/formulario', pathMatch: 'full' },
  { path: 'formulario',       component: FormularioIncidente },
  { path: 'plantilla-tecnica',component: PlantillaTecnicaComponent },
  { path: 'historial',        component: HistorialIncidentes },
  { path: 'agrupadores',      component: ListaAgrupadores },
  { path: '**',               redirectTo: '/formulario' }
];
```

- La ruta vacía y las rutas inválidas (`**`) redirigen al formulario.
- Se usa `RouterLink` y `RouterLinkActive` en la navbar para el marcado de pestaña activa.

---

## 9. Flujos Principales

### Flujo 1: Generar plantilla de cierre

```
Usuario en /formulario
  1. Completa los 5 campos del formulario
  2. Opcionalmente: carga un agrupador desde /agrupadores (vía clic)
  3. Clic en "Generar Texto"
     → Validación del formulario
     → Si válido: genera textoGenerado
  4. Clic en "Copiar al Portapapeles"
     → clipboard.writeText(textoGenerado)
  5. Opcionalmente: Clic en "Guardar Incidente"
     → Storage.guardarIncidente()
     → limpiarFormulario() + limpiarBorrador()
```

### Flujo 2: Generar External Ticket

```
Usuario en /agrupadores
  1. Selecciona Aplicativo Afectado (select)
  2. Selecciona Proceso (select)
  3. Escribe en campo "Agrupador del Error"
     → filtrarSugerencias() → muestra dropdown
  4. Hace clic en una sugerencia
     → agrupadorSeleccionadoTicket = agrupador
     → calcularExternalTicket()
     → externalTicket = "Aplicativo.Proceso Agrupador"
  5. Clic en "Copiar"
     → clipboard.writeText(externalTicket)
```

### Flujo 3: Recuperar incidente del historial

```
Usuario en /historial
  1. Busca por término (opcional)
  2. Clic en "Recuperar" de un incidente
     → incidenteCompartido.setIncidente(incidente)
     → router.navigate(['/formulario'])
  3. Formulario carga con los datos del incidente guardado
     → El usuario puede editar y re-generar el texto
```

### Flujo 4: Preservación del borrador entre pestañas

```
Usuario en /formulario escribe algo
  → formulario.valueChanges → setBorrador(valores)

Usuario navega a /agrupadores y vuelve a /formulario
  → FormularioIncidente destruido (ngOnDestroy) → suscripción limpiada
  → FormularioIncidente creado de nuevo (ngOnInit)
      → cargarBorrador() → patchValue(borrador) ✅ datos recuperados
```

---

## 10. Persistencia de Estado

La aplicación tiene **tres capas de estado**:

| Capa | Mecanismo | Duración | Qué guarda |
|---|---|---|---|
| **Formulario activo** | Signal (`borrador`) en `IncidenteCompartido` | Mientras la app esté abierta en el browser | Valores del formulario de cierre |
| **Recuperación de historial** | Signal (`incidenteRecuperado`) en `IncidenteCompartido` | Hasta que `FormularioIncidente` lo lee (one-shot) | Incidente del historial a editar |
| **Historial persistente** | `localStorage` vía `Storage` | Indefinida (hasta que el usuario limpie) | Incidentes guardados + Plantillas técnicas |

### ¿Por qué signals y no BehaviorSubject?

| Signal (Angular) | BehaviorSubject (RxJS) |
|---|---|
| No requiere `subscribe` ni `unsubscribe` | Requiere gestión de suscripciones |
| Integración nativa con Angular 16+ | Patrón RxJS tradicional |
| Sintaxis más simple: `signal()`, `set()`, `()` | `new BehaviorSubject()`, `.next()`, `.getValue()` |
| Detección de cambios automática (OnPush) | Requiere `async pipe` o `markForCheck()` |

---

## 11. Glosario de Términos Angular

### Componente Standalone
Componente que **no pertenece a ningún `NgModule`**. Declara sus propias dependencias en el array `imports` del decorador `@Component`. Es el estándar desde Angular v17 y obligatorio en v20+.

```typescript
@Component({
  selector: 'app-ejemplo',
  imports: [CommonModule, ReactiveFormsModule], // dependencias propias
  template: `...`
})
export class Ejemplo {}
```

### Signal
Primitiva de reactividad de Angular. Una variable observables que notifica a Angular cuando cambia su valor, sin necesidad de RxJS.

```typescript
const contador = signal(0);       // crea signal con valor inicial
contador.set(5);                  // asigna nuevo valor
contador.update(v => v + 1);     // actualiza basándose en el valor actual
console.log(contador());          // lee el valor (se invoca como función)
```

### `inject()`
Función para inyectar dependencias **fuera del constructor**, disponible desde Angular 14. Permite inyección en el cuerpo de la clase.

```typescript
export class MiServicio {
  private platformId = inject(PLATFORM_ID); // sin constructor
}
```

### Reactive Forms
Sistema de formularios de Angular donde la estructura, validaciones y valores se definen **en TypeScript** (no en el HTML). Usa `FormGroup`, `FormControl` y `FormBuilder`.

```typescript
this.formulario = this.fb.group({
  nombre: ['', Validators.required],
  edad:   [0,  Validators.min(18)]
});
```

### `takeUntil`
Operador de RxJS que cancela una suscripción automáticamente cuando un `Subject` emite.

```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  observable$.pipe(takeUntil(this.destroy$)).subscribe(...);
}

ngOnDestroy() {
  this.destroy$.next();    // dispara la cancelación
  this.destroy$.complete();
}
```

### `patchValue` vs `setValue`
- **`setValue`**: asigna valores a **todos** los controles del grupo. Lanza error si falta alguno.
- **`patchValue`**: asigna solo los controles indicados. Los no mencionados conservan su valor actual.

```typescript
this.formulario.patchValue({ nombre: 'Juan' }); // solo actualiza "nombre"
```

### `ChangeDetectionStrategy.OnPush`
Estrategia de detección de cambios donde Angular **solo re-renderiza** el componente cuando:
- Una `@Input` cambia su referencia.
- Un evento del componente ocurre.
- Una signal o observable (con `async pipe`) emite.

Mejora el rendimiento al evitar chequeos innecesarios.

### `RouterLinkActive`
Directiva que añade una clase CSS al elemento cuando su ruta está activa.

```html
<a routerLink="/formulario" routerLinkActive="active">Formulario</a>
```

### `localStorage`
API del browser que permite guardar datos en pares clave/valor de forma **persistente** (no se borran al cerrar el browser). Solo disponible en el cliente, no en SSR.

```typescript
localStorage.setItem('clave', JSON.stringify(objeto));
const data = JSON.parse(localStorage.getItem('clave') ?? '[]');
localStorage.removeItem('clave');
```

### `isPlatformBrowser`
Función de Angular que detecta si el código se está ejecutando en el **browser** o en el **servidor** (SSR). Necesaria para proteger accesos a APIs del browser como `localStorage`, `navigator`, etc.

```typescript
private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

metodo() {
  if (!this.isBrowser) return; // evitar error en servidor
  localStorage.setItem(...);
}
```

---

*Última actualización: febrero 2026 — Plantilla de Gestión de Incidentes v2.0*
