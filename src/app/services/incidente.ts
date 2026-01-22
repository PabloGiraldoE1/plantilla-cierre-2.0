import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IncidenteService {
  
  // Opciones para el autocompletado del agrupador
  public readonly opcionesAgrupador: string[] = [
    "1. Aplicativo no carga / Lentitud / Intermitencia",
    "2. Capacitacion Aplicativo",
    "3. Informacion clientes (No carga / No arrastra / Errada)",
    "4. No permite cotizar",
    "5. No habilita campos / botones",
    "6. Error Descargar PDF",
    "7. Error consulta de polizas",
    "8. Error conversion de Poliza",
    "9. Solicitud en estado ACEPTADA",
    "10. No permite enviar solicitud electrónica",
    "11. Error en coberturas de la poliza",
    "12. Error en calculos de prima",
    "13. Intermitencia en Servicios del Cotizador",
    "14. Error en ingreso de asegurados / beneficiarios",
    "15. Error en valores de la poliza",
    "16. Excepciones de Negocio",
    "17. Error obtener detalles de la poliza",
    "18. Falta informacion importante por diligenciar",
    "19. Validacion  de Sarlaft",
    "21. Polizas duplicadas arrendamiento",
    "26. Viajes FV - Poliza Pendiente de Expedir",
    "30. Arrendamiento FV Envio de Comunicados CCM",
    "32. Descuento de Ley SOAT",
    "33. Error en la tarifa",
    "34. Alerta aplicativos",
  ];

  public readonly aplicativos: string[] = [
    "Cotizador Salud",
    "Cotizador Autos",
    "Cotizador PCP",
    "Cotizador Accidente Personal",
    "ICargo",
    "Cotizador GWT",
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
    "Alertamiento"
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

