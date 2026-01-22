# 🎯 Sistema de Gestión de Incidentes - Angular v2.0

## 📋 Descripción

Sistema web moderno y profesional para la gestión y cierre de incidentes, completamente migrado a **Angular 19** con funcionalidades avanzadas y diseño responsivo.

## ✨ Características Principales

### 🆕 Nuevas Funcionalidades

- ✅ **Reactive Forms**: Validación en tiempo real de formularios
- 💾 **Historial Persistente**: Almacenamiento local de todos los incidentes
- 📊 **Panel de Historial**: Visualización completa con estadísticas
- 🔍 **Búsqueda Avanzada**: Filtrado por múltiples criterios
- 📥 **Exportación de Datos**: JSON y CSV
- 🎨 **Diseño Moderno**: Interfaz mejorada con SCSS y animaciones
- 📱 **100% Responsivo**: Adaptable a móviles, tablets y desktop
- 🚀 **Autocompletado Inteligente**: Sugerencias en tiempo real
- ⚡ **Performance Optimizada**: Carga rápida y fluida
- 🔔 **Notificaciones Toast**: Feedback visual inmediato
- 📋 **Copia al Portapapeles**: Con un solo clic
- 🎯 **Validaciones Avanzadas**: Prevención de errores

### 🛠️ Mejoras Técnicas

- **TypeScript**: Tipado fuerte y seguro
- **Standalone Components**: Arquitectura modular
- **Services**: Separación de lógica de negocio
- **Routing**: Navegación entre vistas
- **LocalStorage Service**: Persistencia de datos
- **Interfaces**: Modelos de datos bien definidos

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn
- Angular CLI (v19)

### Pasos de Instalación

```bash
# 1. Navegar al directorio del proyecto
cd incidentes-angular

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
ng serve

# 4. Abrir en el navegador
# La aplicación estará disponible en: http://localhost:4200
```

### Compilar para Producción

```bash
# Generar build de producción
ng build --configuration production

# Los archivos compilados estarán en: dist/incidentes-angular
```

## 📂 Estructura del Proyecto

```
incidentes-angular/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── formulario-incidente/     # Componente principal del formulario
│   │   │   │   ├── formulario-incidente.ts
│   │   │   │   ├── formulario-incidente.html
│   │   │   │   └── formulario-incidente.scss
│   │   │   └── historial-incidentes/     # Componente del historial
│   │   │       ├── historial-incidentes.ts
│   │   │       ├── historial-incidentes.html
│   │   │       └── historial-incidentes.scss
│   │   ├── services/
│   │   │   ├── incidente.ts              # Servicio de lógica de negocio
│   │   │   └── storage.ts                # Servicio de almacenamiento
│   │   ├── models/
│   │   │   └── incidente.ts              # Interfaces y modelos
│   │   ├── app.ts                        # Componente raíz
│   │   ├── app.html                      # Template principal
│   │   ├── app.scss                      # Estilos globales
│   │   └── app.routes.ts                 # Configuración de rutas
│   ├── styles.scss                       # Estilos globales
│   └── index.html                        # Punto de entrada
├── angular.json                          # Configuración de Angular
├── package.json                          # Dependencias
└── README.md                             # Este archivo
```

## 🎨 Componentes Principales

### 1. Formulario de Incidentes (`/formulario`)

- Formulario reactivo con validaciones
- Autocompletado en agrupador de errores
- Generación automática de External Ticket
- Validaciones personalizadas (HU Raizal)
- Guardado automático en LocalStorage
- Botones de acción: Generar, Guardar, Limpiar

### 2. Historial de Incidentes (`/historial`)

- Tabla interactiva con todos los incidentes
- Estadísticas en tiempo real
- Búsqueda por texto
- Filtro por aplicativo
- Exportación a JSON y CSV
- Eliminación individual o total
- Copia rápida de incidentes

## 🔧 Servicios

### IncidenteService
- Gestión de opciones y datos
- Filtrado de agrupadores
- Generación de tickets
- Validaciones de negocio

### StorageService
- CRUD de incidentes
- Persistencia en localStorage
- Exportación de datos
- Generación de IDs únicos

## 📊 Flujo de Trabajo

1. **Crear Incidente**: Llenar formulario → Validar → Generar texto
2. **Guardar**: Almacenar en historial local
3. **Consultar**: Ver historial completo con filtros
4. **Exportar**: Descargar datos en JSON o CSV
5. **Copiar**: Portapapeles para uso inmediato

## 🎯 Campos del Formulario

### Obligatorios (*)
- Aplicativo Afectado
- Agrupador del Error
- Diagnóstico
- Acción Ejecutada
- Descripción de Solución

### Opcionales
- Proceso Aplicativo
- Causa del Error
- Proceso del Error
- HU Raizal / Mejora
- Estado Raizal
- Responsable Solución
- Confirmación Usuario
- Formulario Credenciales
- OC PAM
- Causa Raíz

## 💡 Funcionalidades Didácticas

1. **Tooltips y Labels Claros**: Cada campo tiene indicadores visuales
2. **Validación en Tiempo Real**: Feedback inmediato al usuario
3. **Mensajes de Error**: Guías claras sobre qué corregir
4. **Autocompletado**: Sugerencias mientras escribes
5. **Preview en Tiempo Real**: External Ticket actualizado automáticamente
6. **Estados Visuales**: Colores y badges para estados
7. **Animaciones Suaves**: Transiciones agradables
8. **Toast Notifications**: Confirmaciones de acciones

## 🌐 Tecnologías Utilizadas

- **Angular 19**: Framework principal
- **TypeScript**: Lenguaje de programación
- **SCSS**: Preprocesador CSS
- **Reactive Forms**: Manejo de formularios
- **Router**: Navegación SPA
- **LocalStorage API**: Persistencia de datos
- **Standalone Components**: Arquitectura moderna

## 📱 Responsive Design

La aplicación se adapta perfectamente a:
- 📱 **Móviles** (320px - 767px)
- 📱 **Tablets** (768px - 1023px)
- 💻 **Desktop** (1024px+)

## 🎨 Paleta de Colores

- **Primary**: #003366 (Azul corporativo)
- **Success**: #28a745 (Verde)
- **Danger**: #dc3545 (Rojo)
- **Warning**: #ffc107 (Amarillo)
- **Info**: #17a2b8 (Cyan)

## 📈 Mejoras sobre la Versión Original

| Característica | Versión Original | Versión Angular |
|----------------|------------------|-----------------|
| Framework | Vanilla JS | Angular 19 |
| Validaciones | Básicas | Avanzadas con Reactive Forms |
| Historial | ❌ No | ✅ Completo con estadísticas |
| Exportación | ❌ No | ✅ JSON y CSV |
| Búsqueda | ❌ No | ✅ Avanzada con filtros |
| Diseño | Básico | Moderno con animaciones |
| Responsive | Parcial | 100% Adaptable |
| Persistencia | ❌ No | ✅ LocalStorage |
| TypeScript | ❌ No | ✅ Tipado completo |
| Arquitectura | Monolítica | Modular con servicios |

## 🔒 Seguridad

- Validación de entrada de datos
- Sanitización de HTML
- Prevención de XSS
- Tipado fuerte con TypeScript

## 🐛 Depuración

Para modo desarrollo con DevTools:
```bash
ng serve --source-map
```

## 📝 Licencia

Este proyecto es de uso interno.

## 👨‍💻 Autor

Sistema desarrollado para la gestión profesional de incidentes.

---

## 🎓 Guía de Uso Rápida

### Para Usuarios Nuevos

1. **Crear tu primer incidente**:
   - Ve a "Nuevo Incidente"
   - Completa los campos marcados con *
   - Haz clic en "Generar Texto"
   - Copia el resultado
   - Opcionalmente guárdalo en el historial

2. **Ver tus incidentes guardados**:
   - Ve a "Historial"
   - Usa el buscador para encontrar incidentes
   - Exporta los datos si lo necesitas

3. **Consejos**:
   - El campo "Agrupador del Error" tiene autocompletado
   - No puedes poner "N/A" en el campo "HU Raizal"
   - El "External Ticket" se genera automáticamente

---

**¡Disfruta de la nueva experiencia de gestión de incidentes! 🚀**
