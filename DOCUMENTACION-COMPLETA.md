# 📘 Documentación Completa del Sistema de Gestión de Incidentes

## 📋 Índice
1. [Descripción General](#descripción-general)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Modelos de Datos](#modelos-de-datos)
6. [Servicios](#servicios)
7. [Componentes](#componentes)
8. [Funcionalidades](#funcionalidades)
9. [Despliegue](#despliegue)
10. [Comandos Útiles](#comandos-útiles)

---

## 📖 Descripción General

**Sistema de Gestión de Incidentes** es una aplicación web profesional desarrollada con Angular 21 que permite el registro, seguimiento y gestión de incidentes técnicos. La aplicación está diseñada para equipos de soporte técnico que necesitan documentar y hacer seguimiento de problemas en aplicativos corporativos.

### Características Principales
- ✅ Formulario inteligente con validaciones en tiempo real
- 💾 Almacenamiento persistente en navegador (localStorage)
- 🔍 Búsqueda y filtrado avanzado de incidentes
- 📊 Exportación de datos en JSON y CSV
- 🎯 Autocompletado inteligente para agrupadores de errores
- 📝 Generación automática de tickets externos
- 📋 Copiar al portapapeles con un clic
- 🌐 Responsive design (100% adaptable)

---

## 🏗️ Arquitectura del Proyecto

### Patrón de Diseño
El proyecto sigue el patrón **Component-Based Architecture** de Angular con:
- **Componentes Standalone**: No usa NgModules (Angular v20+)
- **Reactive Forms**: Para manejo robusto de formularios
- **Signals**: Para gestión de estado reactivo
- **Services**: Para lógica de negocio y persistencia
- **Interfaces TypeScript**: Para tipado fuerte

### Flujo de Datos
```
Usuario → Componente → Servicio → LocalStorage
                ↓
            Validaciones
                ↓
           Transformación
                ↓
            Respuesta UI
```

---

## 🛠️ Tecnologías Utilizadas

### Frontend Framework
- **Angular 21.1.0**: Framework principal
- **TypeScript 5.9.2**: Lenguaje de programación
- **RxJS 7.8.0**: Programación reactiva
- **SCSS**: Preprocesador CSS

### Formularios y Validación
- **Reactive Forms**: Gestión de formularios con validaciones
- **FormBuilder**: Constructor de formularios tipados
- **Validators**: Validadores síncronos y asíncronos

### Routing
- **Angular Router**: Navegación entre vistas
- **Lazy Loading**: Carga diferida de rutas

### Build & Deploy
- **Angular CLI**: Herramienta de línea de comandos
- **angular-cli-ghpages**: Despliegue automático a GitHub Pages
- **Vitest 4.0.8**: Testing framework
- **Express 5.1.0**: Servidor SSR (Server-Side Rendering)

### Compatibilidad SSR
- **@angular/ssr**: Renderizado del lado del servidor
- **PLATFORM_ID & isPlatformBrowser**: Compatibilidad navegador/servidor

---

## 📂 Estructura del Proyecto

```
plantilla-cierre-2.0/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── formulario-incidente/          # Componente de registro
│   │   │   │   ├── formulario-incidente.ts    # Lógica del componente
│   │   │   │   ├── formulario-incidente.html  # Template HTML
│   │   │   │   └── formulario-incidente.scss  # Estilos
│   │   │   │
│   │   │   └── historial-incidentes/          # Componente de historial
│   │   │       ├── historial-incidentes.ts
│   │   │       ├── historial-incidentes.html
│   │   │       └── historial-incidentes.scss
│   │   │
│   │   ├── models/
│   │   │   └── incidente.ts                   # Interfaces TypeScript
│   │   │
│   │   ├── services/
│   │   │   ├── incidente.ts                   # Lógica de negocio
│   │   │   └── storage.ts                     # Persistencia de datos
│   │   │
│   │   ├── app.ts                             # Componente raíz
│   │   ├── app.html                           # Template principal
│   │   ├── app.scss                           # Estilos globales
│   │   ├── app.routes.ts                      # Configuración de rutas
│   │   └── app.config.ts                      # Configuración de la app
│   │
│   ├── index.html                             # HTML principal
│   ├── main.ts                                # Bootstrap de la app
│   ├── styles.scss                            # Estilos globales
│   └── server.ts                              # Servidor SSR
│
├── public/                                    # Archivos estáticos
├── angular.json                               # Configuración Angular CLI
├── tsconfig.json                              # Configuración TypeScript
├── package.json                               # Dependencias y scripts
└── deploy.ps1                                 # Script de despliegue
```

---

## 📊 Modelos de Datos

### Interface: Incidente

Define la estructura de un incidente en el sistema.

```typescript
export interface Incidente {
  // Metadatos (generados automáticamente)
  id?: string;                    // ID único: "INC-timestamp-random"
  fecha?: Date;                   // Fecha de creación automática
  
  // Información del aplicativo
  aplicativoAfectado: string;     // Aplicativo donde ocurrió el problema
  procesoAplicativo: string;      // Proceso específico afectado
  
  // Clasificación del error
  agrupadorError: string;         // Categoría del error
  causaError: string;             // Causa raíz del problema
  procesoError: string;           // Proceso donde ocurrió
  
  // Gestión y seguimiento
  huRaizal: string;               // Historia de Usuario relacionada
  estadoRaizal: string;           // Estado actual del raizal
  responsableSolucion: string;    // Área responsable (TI/Negocio)
  
  // Descripción técnica
  diagnostico: string;            // Diagnóstico técnico
  accionEjecutada: string;        // Acciones realizadas
  descripcionSolucion: string;    // Solución aplicada
  
  // Validación y seguimiento
  confirmacionUsuario: string;    // Confirmación del usuario
  formularioCredenciales: string; // ID de formulario de acceso
  ocPam: string;                  // Orden de cambio PAM
  causaRaiz: string;              // Estado de la causa raíz
  
  // Generado automáticamente
  externalTicket?: string;        // Ticket para sistema externo
}
```

### Interface: EstadisticasIncidente

Define métricas y estadísticas del sistema.

```typescript
export interface EstadisticasIncidente {
  totalIncidentes: number;
  porAplicativo: { [key: string]: number };
  porCausa: { [key: string]: number };
  porEstado: { [key: string]: number };
}
```

**Uso**: Preparada para implementación futura de dashboard de estadísticas.

---

## ⚙️ Servicios

### 1. IncidenteService

**Ubicación**: `src/app/services/incidente.ts`

**Responsabilidad**: Lógica de negocio y validaciones relacionadas con incidentes.

#### Propiedades

##### opcionesAgrupador: string[]
Lista de 34 agrupadores predefinidos de errores comunes.

**Ejemplos**:
- "1. Aplicativo no carga / Lentitud / Intermitencia"
- "6. Error Descargar PDF"
- "12. Error en calculos de prima"

**Uso**: Autocompletado en el campo "Agrupador del Error".

##### aplicativos: string[]
Lista de aplicativos corporativos disponibles.

**Ejemplos**:
- Cotizador Salud
- Cotizador Autos
- SimonNet / Gestion Documental

**Total**: 19 aplicativos diferentes.

##### procesos: string[]
Procesos de negocio disponibles.

**Ejemplos**:
- Nuevo
- Cotizar
- Expedir
- Modificacion

**Total**: 9 procesos.

#### Métodos

##### filtrarAgrupadores(busqueda: string): string[]
Filtra agrupadores basado en texto de búsqueda.

**Parámetros**:
- `busqueda`: Texto ingresado por el usuario

**Retorna**: Array de agrupadores que coinciden con la búsqueda (case-insensitive).

**Ejemplo**:
```typescript
filtrarAgrupadores("PDF") 
// → ["6. Error Descargar PDF"]
```

##### generarExternalTicket(aplicativo: string, proceso: string, agrupador: string): string
Genera automáticamente un ticket externo concatenando los datos.

**Parámetros**:
- `aplicativo`: Aplicativo afectado
- `proceso`: Proceso del aplicativo
- `agrupador`: Agrupador del error

**Retorna**: String formateado para ticket externo.

**Ejemplo**:
```typescript
generarExternalTicket(
  "Cotizador Salud", 
  "Cotizar", 
  "1. Aplicativo no carga"
)
// → "Cotizador Salud. Cotizar 1. Aplicativo no carga"
```

##### validarHURaizal(valor: string): boolean
Valida que el campo HU Raizal no contenga valores prohibidos.

**Valores prohibidos**:
- "n/a"
- "na"
- "no aplica"

**Retorna**: `true` si el valor es válido, `false` si está prohibido.

**Uso**: Validación en tiempo real mientras el usuario escribe.

---

### 2. Storage (Servicio de Persistencia)

**Ubicación**: `src/app/services/storage.ts`

**Responsabilidad**: Gestión de persistencia de datos en localStorage con compatibilidad SSR.

#### Propiedades

##### STORAGE_KEY: string (private readonly)
Clave de almacenamiento en localStorage: `'incidentes_historial'`

##### platformId (private)
Identificador de plataforma inyectado para detección navegador/servidor.

##### isBrowser: boolean (private)
Bandera que indica si el código se ejecuta en navegador.

**Importancia**: Previene errores SSR al intentar acceder a `localStorage` en el servidor.

#### Métodos

##### guardarIncidente(incidente: Incidente): void
Guarda un nuevo incidente en localStorage.

**Proceso**:
1. Verifica que esté en navegador (`isBrowser`)
2. Obtiene el historial actual
3. Genera ID único para el incidente
4. Asigna fecha actual
5. Agrega al historial
6. Guarda en localStorage

**Ejemplo**:
```typescript
const nuevoIncidente: Incidente = {
  aplicativoAfectado: "Cotizador Salud",
  agrupadorError: "Error al cotizar",
  // ... otros campos
};
storageService.guardarIncidente(nuevoIncidente);
// ID generado: "INC-1737503826891-k3j5h7m2p"
```

##### obtenerHistorial(): Incidente[]
Recupera todos los incidentes almacenados.

**Retorna**:
- Array de incidentes si hay datos
- Array vacío si no hay datos o está en servidor

**Compatibilidad SSR**: Retorna array vacío en servidor, evitando errores.

##### eliminarIncidente(id: string): void
Elimina un incidente específico por su ID.

**Parámetros**:
- `id`: ID único del incidente

**Proceso**:
1. Filtra el incidente con el ID especificado
2. Actualiza localStorage con el nuevo array

##### limpiarHistorial(): void
Elimina completamente el historial de localStorage.

**Uso**: Función de "Limpiar todo" en el componente de historial.

##### exportarJSON(): string
Exporta el historial completo en formato JSON con formato legible.

**Formato**: JSON con indentación de 2 espacios.

**Ejemplo de salida**:
```json
[
  {
    "id": "INC-1737503826891-k3j5h7m2p",
    "fecha": "2026-01-21T20:30:26.891Z",
    "aplicativoAfectado": "Cotizador Salud",
    "agrupadorError": "Error al cotizar"
  }
]
```

##### exportarCSV(): string
Exporta el historial en formato CSV.

**Proceso**:
1. Extrae las keys del primer incidente como headers
2. Mapea cada incidente a una fila CSV
3. Envuelve valores en comillas dobles
4. Une con saltos de línea

**Ejemplo de salida**:
```csv
id,fecha,aplicativoAfectado,agrupadorError
"INC-123","2026-01-21","Cotizador Salud","Error al cotizar"
```

##### generarId(): string (private)
Genera un ID único para cada incidente.

**Formato**: `INC-{timestamp}-{random}`

**Ejemplo**: `"INC-1737503826891-k3j5h7m2p"`

**Componentes**:
- Prefijo: "INC-"
- Timestamp: Milisegundos desde epoch
- Random: 9 caracteres aleatorios en base36

---

## 🧩 Componentes

### 1. FormularioIncidente

**Ubicación**: `src/app/components/formulario-incidente/`

**Responsabilidad**: Registro de nuevos incidentes con validaciones.

#### Propiedades del Componente

##### formulario: FormGroup
Instancia de Reactive Form que gestiona todos los campos.

**Configuración**:
- Validaciones síncronas en campos obligatorios
- Listeners para cambios en tiempo real
- Estado de validación para cada campo

##### textoGenerado: string
Texto formateado listo para copiar al portapapeles.

##### externalTicket: string
Ticket generado automáticamente para sistema externo.

##### sugerenciasAgrupador: string[]
Array de sugerencias filtradas para autocompletado.

##### mostrarSugerencias: boolean
Controla la visibilidad del dropdown de sugerencias.

##### toastMessage: string
Mensaje actual del toast notification.

##### mostrarToast: boolean
Controla la visibilidad del toast.

##### causasError: Array<{value: string, label: string}>
20 opciones de causas de error predefinidas.

**Incluye**:
- Capacitación
- Mejoras
- Errores de aplicación
- Perfilación
- Degradación de servicios

##### procesosError: string[]
37 procesos de error disponibles.

##### estadosRaizal: string[]
6 estados posibles para el raizal:
1. Identificada
2. En curso
3. Por Identificar
4. Aislado
5. Finalizada
6. N/A

##### responsables: string[]
- TI
- Negocio
- TI/Negocio

##### causasRaiz: string[]
- Identificada
- Sin Identificar

#### Métodos del Componente

##### ngOnInit(): void
Hook de inicialización del componente.

**Ejecuta**:
1. `inicializarFormulario()`
2. `configurarValidaciones()`

##### inicializarFormulario(): void
Crea la instancia del FormGroup con todos los campos.

**Campos obligatorios** (Validators.required):
- aplicativoAfectado
- agrupadorError
- diagnostico
- accionEjecutada
- descripcionSolucion

**Campos opcionales**:
- procesoAplicativo
- causaError
- procesoError
- huRaizal
- estadoRaizal
- responsableSolucion
- formularioCredenciales
- ocPam
- causaRaiz

**Valor por defecto**:
- confirmacionUsuario: "Sí"

##### configurarValidaciones(): void
Configura listeners para validaciones en tiempo real.

**Listeners**:
1. **aplicativoAfectado** → Actualiza external ticket
2. **procesoAplicativo** → Actualiza external ticket
3. **agrupadorError** → Actualiza ticket y muestra sugerencias
4. **huRaizal** → Valida valores prohibidos

##### onAgrupadorChange(): void
Maneja cambios en el campo de agrupador.

**Proceso**:
1. Obtiene el valor actual
2. Filtra sugerencias mediante servicio
3. Muestra/oculta dropdown según resultados

##### seleccionarSugerencia(sugerencia: string): void
Maneja la selección de una sugerencia del autocompletado.

**Proceso**:
1. Actualiza el valor del campo
2. Oculta el dropdown
3. Regenera el external ticket

##### actualizarExternalTicket(): void
Regenera el external ticket cuando cambian los campos relacionados.

**Campos monitoreados**:
- aplicativoAfectado
- procesoAplicativo
- agrupadorError

##### generarTexto(): void
Genera el texto formateado para copiar.

**Validación**:
- Verifica que el formulario sea válido
- Marca campos como tocados si hay errores
- Muestra toast con mensaje de error

**Formato del texto**:
```
* Agrupador del Error: [valor]
* Proceso del Error: [valor]
* HU Raizal / Mejora: [valor]
* Estado Raizal: [valor]
* Responsable Solución: [valor]
* Diagnóstico: [valor]
* Acción Ejecutada: [valor]
* Descripción de Solución: [valor]
* Confirmar operatividad del usuario Afectado: [valor]
* ID Formulario de Solicitud de Credenciales: [valor]
* OC Acceso a PAM - (PAM): [valor]
* Causa Raíz (Identificada/Sin Identificar): [valor]
```

##### guardarIncidente(): void
Guarda el incidente en localStorage.

**Proceso**:
1. Valida el formulario
2. Crea objeto Incidente con valores del formulario
3. Agrega external ticket
4. Llama al servicio de storage
5. Muestra confirmación
6. Limpia el formulario

##### copiarAlPortapapeles(): void
Copia el texto generado al portapapeles.

**Validación**: Verifica que exista texto generado.

**API utilizada**: `navigator.clipboard.writeText()`

##### copiarTicket(): void
Copia el external ticket al portapapeles.

##### limpiarFormulario(): void
Resetea todos los campos del formulario.

**Preserva**: El valor "Sí" en confirmacionUsuario.

**Limpia**:
- textoGenerado
- externalTicket
- Todos los campos del formulario

##### marcarCamposComoTocados(): void (private)
Marca todos los campos como "tocados" para mostrar errores de validación.

**Uso**: Cuando el usuario intenta enviar un formulario inválido.

##### showToast(mensaje: string): void (private)
Muestra notificación toast temporal.

**Duración**: 3 segundos

**Proceso**:
1. Asigna el mensaje
2. Muestra el toast
3. Oculta automáticamente después de 3s

---

### 2. HistorialIncidentes

**Ubicación**: `src/app/components/historial-incidentes/`

**Responsabilidad**: Visualización, búsqueda, filtrado y exportación de incidentes.

#### Propiedades del Componente

##### historial: Incidente[]
Array completo de incidentes cargados desde localStorage.

##### filteredHistorial: Incidente[]
Array filtrado según los criterios de búsqueda actuales.

**Nota**: Este es el array que se muestra en la UI.

##### searchTerm: string
Término de búsqueda actual (binding bidireccional).

##### filtroAplicativo: string
Aplicativo seleccionado para filtrar (binding bidireccional).

##### aplicativosUnicos: string[]
Lista de aplicativos únicos extraídos del historial.

**Uso**: Opciones del select de filtro.

#### Métodos del Componente

##### ngOnInit(): void
Hook de inicialización.

**Ejecuta**: `cargarHistorial()`

##### cargarHistorial(): void
Carga todos los incidentes desde localStorage.

**Proceso**:
1. Llama al servicio de storage
2. Asigna al historial completo
3. Clona al historial filtrado
4. Extrae aplicativos únicos

##### extraerAplicativosUnicos(): void
Extrae aplicativos únicos del historial para el filtro.

**Proceso**:
1. Mapea todos los aplicativos
2. Crea Set para eliminar duplicados
3. Filtra valores falsy (null, undefined, "")
4. Convierte a array

##### buscar(): void
Aplica filtros de búsqueda y actualiza el historial filtrado.

**Filtros aplicados**:

1. **Búsqueda por texto** (searchTerm):
   - Busca en: agrupadorError, diagnostico, descripcionSolucion, externalTicket
   - Case-insensitive
   - Búsqueda parcial (includes)

2. **Filtro por aplicativo** (filtroAplicativo):
   - Coincidencia exacta
   - Se puede combinar con búsqueda por texto

**Ejemplo**:
```typescript
searchTerm = "PDF"
filtroAplicativo = "Cotizador Salud"
// Resultado: Incidentes de Cotizador Salud que contengan "PDF"
```

##### eliminarIncidente(id: string | undefined): void
Elimina un incidente específico.

**Validaciones**:
1. Verifica que el ID exista
2. Solicita confirmación al usuario
3. Llama al servicio de storage
4. Recarga el historial

##### limpiarHistorial(): void
Elimina completamente el historial.

**Seguridad**: Solicita doble confirmación con advertencia.

##### exportarJSON(): void
Exporta el historial en formato JSON.

**Proceso**:
1. Obtiene JSON del servicio
2. Llama a `descargarArchivo()`
3. Nombre: `incidentes.json`

##### exportarCSV(): void
Exporta el historial en formato CSV.

**Proceso**:
1. Obtiene CSV del servicio
2. Llama a `descargarArchivo()`
3. Nombre: `incidentes.csv`

##### descargarArchivo(contenido, nombreArchivo, tipo): void (private)
Crea y descarga un archivo en el navegador.

**Proceso**:
1. Crea Blob con el contenido
2. Genera URL temporal
3. Crea elemento `<a>` dinámico
4. Simula click para descargar
5. Libera la URL

**Tipos soportados**:
- `application/json`
- `text/csv`

##### formatearFecha(fecha: Date | undefined): string
Formatea una fecha para mostrar en la UI.

**Formato**: `dd/mm/yyyy, hh:mm:ss` (locale es-ES)

**Retorna**: "N/A" si la fecha es undefined.

##### copiarIncidente(incidente: Incidente): void
Copia la información de un incidente al portapapeles.

**Formato**: Mismo formato que el texto generado en el formulario.

**Feedback**: Muestra alert de confirmación.

---

### 3. App (Componente Raíz)

**Ubicación**: `src/app/app.ts`

**Responsabilidad**: Componente principal que contiene la navegación y estructura base.

#### Propiedades

##### title: string
Título de la aplicación: "Sistema de Gestión de Incidentes"

#### Métodos

##### getCurrentYear(): number
Obtiene el año actual para el footer.

**Uso**: Copyright dinámico en el pie de página.

---

## 🎯 Funcionalidades

### 1. Registro de Incidentes

**Componente**: FormularioIncidente

**Características**:
- ✅ Validaciones en tiempo real
- 🔍 Autocompletado inteligente
- 📝 Generación automática de tickets
- 💾 Guardado en localStorage
- 📋 Copiar al portapapeles
- ⚠️ Mensajes de error contextuales

**Flujo del usuario**:
1. Usuario selecciona aplicativo afectado
2. Selecciona proceso (opcional)
3. Escribe o selecciona agrupador (con autocompletado)
4. External ticket se genera automáticamente
5. Completa campos de diagnóstico y solución
6. Sistema valida en tiempo real
7. Usuario genera texto formateado
8. Usuario puede copiar o guardar

### 2. Historial de Incidentes

**Componente**: HistorialIncidentes

**Características**:
- 📊 Vista tabular de todos los incidentes
- 🔎 Búsqueda por texto libre
- 🎯 Filtro por aplicativo
- 🗑️ Eliminación individual o masiva
- 📥 Exportación JSON/CSV
- 📋 Copiar incidente individual
- 📅 Formato de fechas localizado

**Flujo del usuario**:
1. Usuario accede al historial
2. Sistema carga incidentes desde localStorage
3. Usuario puede:
   - Buscar por palabras clave
   - Filtrar por aplicativo
   - Ver detalles de cada incidente
   - Copiar incidente
   - Eliminar incidente
   - Exportar datos

### 3. Autocompletado Inteligente

**Servicio**: IncidenteService

**Funcionamiento**:
1. Usuario empieza a escribir en "Agrupador del Error"
2. Sistema filtra en tiempo real
3. Muestra sugerencias relevantes
4. Usuario selecciona o continúa escribiendo
5. Actualiza external ticket automáticamente

**Ventajas**:
- Reduce errores de escritura
- Estandariza nomenclatura
- Acelera el registro

### 4. Validaciones

#### Validaciones de Formulario

**Campos obligatorios**:
- Aplicativo Afectado
- Agrupador del Error
- Diagnóstico
- Acción Ejecutada
- Descripción de Solución

**Validaciones personalizadas**:

1. **HU Raizal**:
   - No permite: "N/A", "NA", "No aplica"
   - Validación en tiempo real
   - Limpia el campo si es inválido

**Feedback visual**:
- Border rojo en campos inválidos
- Mensaje de error debajo del campo
- Toast notification para errores globales

### 5. Persistencia de Datos

**Tecnología**: localStorage

**Key**: `incidentes_historial`

**Estructura almacenada**:
```json
[
  {
    "id": "INC-1737503826891-k3j5h7m2p",
    "fecha": "2026-01-21T20:30:26.891Z",
    "aplicativoAfectado": "Cotizador Salud",
    "procesoAplicativo": "Cotizar",
    "agrupadorError": "1. Aplicativo no carga",
    "causaError": "6. Errores de la aplicación",
    "procesoError": "4. Cotizacion",
    "huRaizal": "HU-12345",
    "estadoRaizal": "2. En curso",
    "responsableSolucion": "1. TI",
    "diagnostico": "El servicio de autenticación estaba caído",
    "accionEjecutada": "Reinicio del servicio",
    "descripcionSolucion": "Se reinició el servicio y se verificó funcionamiento",
    "confirmacionUsuario": "Sí",
    "formularioCredenciales": "",
    "ocPam": "",
    "causaRaiz": "Identificada",
    "externalTicket": "Cotizador Salud. Cotizar 1. Aplicativo no carga"
  }
]
```

**Ventajas**:
- ✅ No requiere backend
- ✅ Datos persisten entre sesiones
- ✅ Funciona offline
- ✅ Rendimiento instantáneo

**Limitaciones**:
- ❌ Datos locales al navegador
- ❌ No sincroniza entre dispositivos
- ❌ Límite de ~5-10MB según navegador

### 6. Exportación de Datos

#### Formato JSON

**Características**:
- Formato legible (pretty-print)
- Incluye todos los campos
- Fácil de importar a otros sistemas

**Uso**:
- Backup de datos
- Migración a otro sistema
- Análisis con herramientas JSON

#### Formato CSV

**Características**:
- Compatible con Excel/Google Sheets
- Headers automáticos
- Valores entrecomillados

**Uso**:
- Análisis en hojas de cálculo
- Reportes ejecutivos
- Integración con BI tools

---

## 🚀 Despliegue

### Configuración de GitHub Pages

El proyecto está desplegado en:
**https://pablogiraldoe1.github.io/plantilla-cierre-2.0/**

### Proceso de Despliegue

#### 1. Compilación para Producción

```powershell
ng build --configuration production --base-href "/plantilla-cierre-2.0/" --output-mode static
```

**Parámetros**:
- `--configuration production`: Optimizaciones de producción
- `--base-href "/plantilla-cierre-2.0/"`: Ruta base para GitHub Pages
- `--output-mode static`: Genera archivos estáticos (sin SSR)

**Resultado**:
- Carpeta: `dist/incidentes-angular/browser/`
- Archivos:
  - `index.html`: Punto de entrada
  - `404.html`: Página de error
  - `main-*.js`: Bundle de JavaScript
  - `styles-*.css`: Estilos compilados
  - `.nojekyll`: Desactiva Jekyll de GitHub

#### 2. Despliegue a GitHub Pages

```powershell
npx angular-cli-ghpages --dir=dist/incidentes-angular/browser --no-silent
```

**Proceso**:
1. Clona el repositorio
2. Checkout a rama `gh-pages`
3. Limpia archivos anteriores
4. Copia nuevos archivos
5. Commit de cambios
6. Push a `origin/gh-pages`

#### 3. Configuración en GitHub

**Settings → Pages**:
- **Source**: Deploy from a branch
- **Branch**: gh-pages
- **Folder**: / (root)

### Comando Completo

```powershell
ng build --configuration production --base-href "/plantilla-cierre-2.0/" --output-mode static ; npx angular-cli-ghpages --dir=dist/incidentes-angular/browser --no-silent
```

### Solución de Problemas SSR

**Problema**: Error `localStorage is not defined` durante el build.

**Causa**: Angular intentaba usar localStorage en el servidor (SSR).

**Solución implementada**:

```typescript
// src/app/services/storage.ts
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export class Storage {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  obtenerHistorial(): Incidente[] {
    if (!this.isBrowser) return []; // ✅ Previene error en servidor
    
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}
```

**Explicación**:
1. `PLATFORM_ID`: Identifica si el código corre en navegador o servidor
2. `isPlatformBrowser()`: Retorna true solo en navegador
3. Guard `if (!this.isBrowser)`: Evita acceso a localStorage en servidor

---

## 💻 Comandos Útiles

### Desarrollo

```powershell
# Instalar dependencias
npm install

# Ejecutar en desarrollo
ng serve
# Abre: http://localhost:4200

# Ejecutar tests
npm test

# Build de desarrollo
ng build --configuration development
```

### Producción

```powershell
# Build para producción local
ng build --configuration production

# Build para GitHub Pages
ng build --configuration production --base-href "/plantilla-cierre-2.0/" --output-mode static

# Desplegar a GitHub Pages
npx angular-cli-ghpages --dir=dist/incidentes-angular/browser --no-silent

# Build + Deploy (comando completo)
ng build --configuration production --base-href "/plantilla-cierre-2.0/" --output-mode static ; npx angular-cli-ghpages --dir=dist/incidentes-angular/browser --no-silent
```

### Git

```powershell
# Ver estado
git status

# Ver ramas
git branch -a

# Agregar cambios
git add .

# Commit
git commit -m "mensaje"

# Push a main
git push origin main

# Ver commits de gh-pages
git log origin/gh-pages --oneline -n 5
```

### Utilidades

```powershell
# Ver versión de Git
git --version

# Ver versión de Node
node --version

# Ver versión de npm
npm --version

# Ver versión de Angular CLI
ng version

# Limpiar caché de npm
npm cache clean --force

# Reinstalar node_modules
Remove-Item -Recurse -Force node_modules; npm install
```

---

## 📝 Mejoras Futuras Sugeridas

### 1. Backend y Sincronización
- Implementar API REST para sincronización
- Base de datos PostgreSQL o MongoDB
- Autenticación de usuarios
- Roles y permisos

### 2. Dashboard de Estadísticas
- Gráficos de incidentes por aplicativo
- Tendencias temporales
- Métricas de tiempo de resolución
- Top aplicativos con más incidentes

### 3. Notificaciones
- Email al guardar incidente
- Alertas para incidentes críticos
- Notificaciones push

### 4. Mejoras UI/UX
- Modo oscuro
- Temas personalizables
- Accesibilidad mejorada (WCAG AAA)
- Animaciones suaves

### 5. Integraciones
- JIRA/ServiceNow API
- Slack/Teams notifications
- Export a PDF
- Integración con sistemas de monitoreo

### 6. Búsqueda Avanzada
- Búsqueda por rango de fechas
- Filtros múltiples combinados
- Búsqueda por tags
- Guardado de búsquedas favoritas

---

## 🔐 Seguridad

### Datos Locales
Los datos se almacenan solo en el navegador del usuario (localStorage).

**Recomendaciones**:
- No almacenar información sensible (contraseñas, tokens)
- Implementar backend para datos corporativos
- Usar HTTPS en producción (GitHub Pages lo provee)

### Validaciones
- Validaciones del lado del cliente (Angular Forms)
- Sanitización de inputs
- Prevención de XSS (Angular lo hace por defecto)

---

## 📞 Soporte y Contacto

**Repositorio**: https://github.com/PabloGiraldoE1/plantilla-cierre-2.0

**Issues**: https://github.com/PabloGiraldoE1/plantilla-cierre-2.0/issues

**Documentación Angular**: https://angular.dev

---

## 📄 Licencia

Proyecto privado - Uso interno corporativo

---

## 🎓 Tecnologías Aprendidas en Este Proyecto

1. ✅ **Angular 21 Standalone Components**
2. ✅ **Reactive Forms con validaciones**
3. ✅ **TypeScript avanzado**
4. ✅ **Signals para estado reactivo**
5. ✅ **LocalStorage API**
6. ✅ **Clipboard API**
7. ✅ **Angular Router**
8. ✅ **SCSS modular**
9. ✅ **Compatibilidad SSR**
10. ✅ **GitHub Pages deployment**
11. ✅ **Angular CLI**
12. ✅ **Git workflow**

---

## 🏆 Conclusión

Este proyecto representa un **sistema completo de gestión de incidentes** construido con las mejores prácticas de Angular moderno. Incluye:

- ✅ Arquitectura escalable
- ✅ Código tipado y mantenible
- ✅ UI responsive y profesional
- ✅ Validaciones robustas
- ✅ Persistencia de datos
- ✅ Exportación de datos
- ✅ Compatibilidad SSR
- ✅ Despliegue automatizado

**Ideal para**: Equipos de soporte técnico que necesitan documentar y hacer seguimiento de incidentes de forma eficiente y profesional.

---

**Documentación generada el**: 21 de enero de 2026  
**Versión del proyecto**: 1.0.0  
**Framework**: Angular 21.1.0  
**TypeScript**: 5.9.2
