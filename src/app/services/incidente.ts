import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IncidenteService {

  // Agrupadores organizados por categorías
  public readonly agrupadoresPorCategoria: { [key: string]: string[] } = {
    "ALERTAMIENTO": [
      "Reportes Dynatrace Cotizador",
      "Reportes Dynatrace AUS",
      "Reportes Dynatrace AVA",
      "Reportes Dynatrace SimonNet"
    ],
    "SIMONNET": [
        "Capacitacion Aplicativo",
      "Solicitud no registra datos",
      "Sin Permisos",
      "Recuperar datos laborales",
      "Estados Inconsistentes",
      "No permite ver/adjuntar Requisitos/Complementos",
      "Información/Campos Faltantes",
      "No habilita botones"
    ],
    "HOME COTIZADOR / MIS NEGOCIOS": [
      "Aplicativo no carga / Lentitud / Intermitencia",
      "Capacitacion Aplicativo",
      "No carga opciones del Menu",
      "Información Asesor/Oficina no carga",
      "Riesgos Consultables",
      "Información Cliente Errada",
      "No cargan cotizaciones",
      "Acciones bloqueadas"
    ],
    "COTIZADORES": [
      "Aplicativo no carga / Lentitud / Intermitencia",
      "Capacitacion Aplicativo",
      "Informacion clientes (No carga / No arrastra / Errada)",
      "No permite cotizar",
      "No habilita campos / botones",
      "No genera PDF de cotizacion",
      "No se recupera información de la poliza",
      "Conversión no realizada",
      "Cotizacion estancada en flujo Aceptada",
      "No se envia solicitud electronica",
      "Cobertura no aplicadas correctamente",
      "Error en calculos de prima de cotización",
      "Intermitencia en Servicios del Cotizador",
      "Registro de asegurados/beneficiarios no procesado",
      "Faltan campos en la cotizacion",
      "Error en encuesta de asegurabilidad",
      "Validacion de Sarlaft",
      "Error en modificación de póliza",
      "Procesos y tareas DMS"
    ],
    "AUS": [
      "Aplicativo no carga / Lentitud / Intermitencia",
      "Capacitacion Aplicativo",
      "Falla en visualización de radicados",
      "Error interno en servicios críticos ",
      "Restricción funcional por tipo de póliza",
      "Error general de aplicación",
      "Duplicidad en radicados",
      "Interfaz sin respuesta",
      "Falla en autenticación o acceso",
      "Botones inactivos en flujo de solicitud",
      "Falla en opciones de estado ",
      "Restricción de acceso por permisos ",
      "Flujo detenido en proceso de solicitud",
      "Falla en integración con P8",
      "Póliza no localizada en sistema ",
      "Validación de estado de póliza ",
      "Falla en generación de certificados",
      "Falla en carga de estado de póliza",
      "Falla en categorización de póliza",
      "Error en datos del asegurado"
    ],
    "AVA": [
      "Restricción en visualización de póliza",
      "Falla en exportación o descarga de archivos",
      "Falla en carga o impresión de documentos",
      "Falla en ingreso a aplicativo",
      "Datos de asesor no disponibles",
      "Consulta sin resultados o sin datos",
      "Bloqueo en descarga desde archivo digital",
      "Póliza no visible en estado vigente",
      "Error inesperado en aplicación",
      "Gestión de acceso compartido",
      "Falla en procesamiento de colas (RabbitMQ)",
      "Alertamiento técnico en monitoreo",
      "Gestión de traslado entre asesores",
      "Error en datos del asegurado",
      "Falla en generación de certificados",
      "Error en Hoja de Estado"
    ],
    "PORCHAT": [
      "Retraso en visualización de documentos",
      "Falla en visualización de vínculos",
      "Interfaz sin respuesta",
      "Falla en entrega de documentos por producto",
      "Falla en generación de certificados",
      "Gestión de actualización de datos personales",
      "Desempeño lento en módulo Porchat",
      "Gestión de datos de asesor",
      "Falla en generación de documentos",
      "Falla en descarga o envío de documentos",
      "Bloqueo en módulo Porchat",
      "Restricción de acceso por permisos",
      "Error técnico en módulo Porchat"
    ],
    "INGRESO DIGITAL": [
      "Flujo detenido en proceso de solicitud",
      "Gestión de rechazo de lote",
      "Bloqueo en carga de asegurabilidad",
      "Falla en integración con servicio de firma",
      "Lote pendiente por expedir"
    ]
  };

  // Lista plana de todos los agrupadores para autocompletado
  public readonly opcionesAgrupador: string[] = Object.values(this.agrupadoresPorCategoria).flat();

  public readonly aplicativos: string[] = [
    "Cotizador Salud",
    "Cotizador Autos",
    "Cotizador PCP",
    "Cotizador Accidente Personal",
    "ICargo",
    "Home Cotizador",
    "Mis Negocios",
    "Cotizador Educacion",
    "Cotizador Pension",
    "Cotizador Mas Vida",
    "Cotizador Ingreso Digital Vida Grupo",
    "Cotizador Saldado",
    "Cotizador Vida Grupo PES",
    "PorChat",
    "AVA",
    "AUS",
    "SimonNet / Gestion Documental",
    "Reportes Dynatrace"
  ];

  public readonly procesos: string[] = [
    "Nuevo",
    "Cotizar",
    "Expedir",
    "Modificacion",
    "Renovacion",
    "Documentos",
    "Requisitos",
    "Gestion",
    "Alertamiento",
    "Consultas",
    "Cancelación",
    "Alertamiento",
    "Ingresos",
    "Retiros",
    "Colectivo",
    "Subgrupos",
    "Radicacion",
    "Firmas",
    "Procesos AWS",
  ];

  constructor() { }

  // Filtrar agrupadores basado en texto de búsqueda
  filtrarAgrupadores(busqueda: string): string[] {
    if (!busqueda) return [];
    const term = busqueda.toLowerCase();
    return this.opcionesAgrupador.filter(op => op.toLowerCase().includes(term));
  }

  // Generar external ticket
  generarExternalTicket(aplicativo: string, proceso: string, agrupador: string): string {
    const parts: string[] = [];
    if (aplicativo) parts.push(aplicativo + '.');
    if (proceso) parts.push(proceso + ' ');
    if (this.opcionesAgrupador.includes(agrupador)) parts.push(agrupador);
    return parts.join('').trim();
  }

  // Validar HU Raizal
  validarHURaizal(valor: string): boolean {
    const prohibidos = ["n/a", "na", "no aplica"];
    return !prohibidos.includes(valor.trim().toLowerCase());
  }
}

