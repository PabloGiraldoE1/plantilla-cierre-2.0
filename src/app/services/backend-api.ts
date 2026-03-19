import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface HURaizal {
  id?: number;
  numero_historia: string;
  tipo: string;
  descripcion: string;
  usado_contador?: number;
  fecha_creacion?: string;
  ultima_actualizacion?: string;
}

export interface ExternalTicketHistorial {
  id?: number;
  external_ticket: string;
  aplicativo: string;
  proceso: string;
  agrupador: string;
  usuario?: string;
  fecha_creacion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BackendApiService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  private readonly STORAGE_KEY_RAIZALES = 'raizales_custom_cache';
  private readonly STORAGE_KEY_TICKETS = 'external_tickets_cache';

  // Lista estática de HU Raizales predefinidas
  readonly raizalesPredefinidas: HURaizal[] = [
    { numero_historia: '1027578', tipo: 'Historia', descripcion: 'AUS Radicados no llegan a Evaluación Médica' },
    { numero_historia: '1069130', tipo: 'Historia', descripcion: 'AUS Radicados que se cambian a estado EXPEDIDO generan error' },
    { numero_historia: '985468', tipo: 'Historia', descripcion: 'Certificado de pago total para pólizas financiadas de Vida' },
    { numero_historia: '1009788', tipo: 'Historia', descripcion: 'Colas Rabbit Cotizador Educación y Pension SolicitudAExpedirRecibida.aws.ohs' },
    { numero_historia: '1009850', tipo: 'Historia', descripcion: 'Colas Rabbit Cotizador Salud EstadoCotizacionActualizado.ayv_dyn' },
    { numero_historia: '1066604', tipo: 'Historia', descripcion: 'Configuración límite de conexiones cola de Ingreso Digital' },
    { numero_historia: '966406', tipo: 'Historia', descripcion: 'Cotizaciones VidaSuCapital, PCP Modificaciones no Avanzan' },
    { numero_historia: '842531', tipo: 'Historia', descripcion: 'Cotizador Mas Vida - Aumento de excepciones por errores 404' },
    { numero_historia: '744418', tipo: 'Historia', descripcion: 'Cotizador Plan Crédito Protegido habilita proceso de creación manual de Compañia' },
    { numero_historia: '718270', tipo: 'Historia', descripcion: 'Cotizador Salud - Al momento de Enviar la Solicitud se genera Error número de celular no valido' },
    { numero_historia: '948399', tipo: 'Historia', descripcion: 'Cotizador se quedan en blanco' },
    { numero_historia: '772703', tipo: 'Historia', descripcion: 'Error en formato de fechas al momento de enviar modificaciones en PCP' },
    { numero_historia: '674184', tipo: 'Historia', descripcion: 'Error pregunta Citologia - Cotizador Salud' },
    { numero_historia: '1072387', tipo: 'Historia', descripcion: 'Errores en Fecha de Nacimiento' },
    { numero_historia: '1020926', tipo: 'Historia', descripcion: 'Informacion cuenta bancaria - Ingreso Digital Vida Grupo' },
    { numero_historia: '743018', tipo: 'Historia', descripcion: 'Memoria Cotizador Salud' },
    { numero_historia: '1021777', tipo: 'Historia', descripcion: 'Modificaciones no llegan a Trazabilidad' },
    { numero_historia: '826946', tipo: 'Historia', descripcion: 'No cargan los planes al momento de realizar una conversión en poliza de Salud' },
    { numero_historia: '809795', tipo: 'Historia', descripcion: 'Porchat - No actualiza los datos del Asesor - (Celular y Correo)' },
    { numero_historia: '842200', tipo: 'Historia', descripcion: 'Porchat - No llegan los correos al corporativo - Recibo de cobro' },
    { numero_historia: '1040082', tipo: 'Historia', descripcion: 'Cambio consumo de vinculaciones' },
    { numero_historia: '1064806', tipo: 'Historia', descripcion: 'Plan de pruebas Sprint 1 Q1 2026' },
    { numero_historia: '1064807', tipo: 'Historia', descripcion: 'Plan de pruebas Sprint 2 Q1 2026' },
    { numero_historia: '1026468', tipo: 'Historia', descripcion: 'Raizal cotizaciones no viajan a Salesforce' },
    { numero_historia: '1069710', tipo: 'Historia', descripcion: 'Revision funcionalidad de SP AVA' },
    { numero_historia: '840358', tipo: 'Historia', descripcion: 'Cotizaciones en Proceso de Envio - Autos' }
  ];

  // ===== HU RAIZALES CUSTOM (localStorage) =====

  obtenerRaizalesCustom(): Observable<HURaizal[]> {
    if (!this.isBrowser) return of([]);
    
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_RAIZALES);
      const raizales = data ? JSON.parse(data) : [];
      return of(raizales);
    } catch (error) {
      console.error('Error obteniendo raizales custom:', error);
      return of([]);
    }
  }

  obtenerTodasLasRaizales(): Observable<HURaizal[]> {
    return this.obtenerRaizalesCustom().pipe(
      map(customRaizales => [...this.raizalesPredefinidas, ...customRaizales])
    );
  }

  crearRaizalCustom(raizal: HURaizal): Observable<any> {
    if (!this.isBrowser) return of({ success: false });
    
    try {
      const raizales = JSON.parse(localStorage.getItem(this.STORAGE_KEY_RAIZALES) || '[]');
      
      // Verificar si ya existe
      const existe = raizales.find((r: HURaizal) => r.numero_historia === raizal.numero_historia);
      
      if (existe) {
        // Incrementar contador
        existe.usado_contador = (existe.usado_contador || 0) + 1;
        existe.ultima_actualizacion = new Date().toISOString();
      } else {
        // Agregar nueva
        raizal.id = Date.now();
        raizal.fecha_creacion = new Date().toISOString();
        raizal.usado_contador = 1;
        raizales.push(raizal);
      }
      
      localStorage.setItem(this.STORAGE_KEY_RAIZALES, JSON.stringify(raizales));
      return of({ success: true, message: 'Raizal guardada correctamente' });
    } catch (error) {
      console.error('Error creando raizal custom:', error);
      return of({ success: false, error });
    }
  }

  incrementarUsoRaizal(numeroHistoria: string): Observable<any> {
    if (!this.isBrowser) return of({ success: false });
    
    try {
      const raizales = JSON.parse(localStorage.getItem(this.STORAGE_KEY_RAIZALES) || '[]');
      const raizal = raizales.find((r: HURaizal) => r.numero_historia === numeroHistoria);
      
      if (raizal) {
        raizal.usado_contador = (raizal.usado_contador || 0) + 1;
        raizal.ultima_actualizacion = new Date().toISOString();
        localStorage.setItem(this.STORAGE_KEY_RAIZALES, JSON.stringify(raizales));
      }
      
      return of({ success: true });
    } catch (error) {
      console.error('Error incrementando uso:', error);
      return of({ success: false });
    }
  }

  // ===== EXTERNAL TICKETS HISTORY (localStorage) =====

  obtenerHistorialTickets(limit: number = 10): Observable<ExternalTicketHistorial[]> {
    if (!this.isBrowser) return of([]);
    
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_TICKETS);
      const tickets = data ? JSON.parse(data) : [];
      return of(tickets.slice(0, limit));
    } catch (error) {
      console.error('Error obteniendo historial de tickets:', error);
      return of([]);
    }
  }

  guardarExternalTicket(ticket: ExternalTicketHistorial): Observable<any> {
    if (!this.isBrowser) return of({ success: false });
    
    try {
      const tickets = JSON.parse(localStorage.getItem(this.STORAGE_KEY_TICKETS) || '[]');
      
      // Verificar duplicado por valor del external_ticket
      const existente = tickets.find((t: ExternalTicketHistorial) => t.external_ticket === ticket.external_ticket);
      if (existente) {
        return of({ success: true, message: 'Ticket ya existe en el historial', duplicate: true });
      }

      ticket.id = Date.now();
      ticket.fecha_creacion = new Date().toISOString();
      
      // Agregar al inicio del array
      tickets.unshift(ticket);
      
      // Mantener solo los últimos 10
      const ticketsLimitados = tickets.slice(0, 10);
      
      localStorage.setItem(this.STORAGE_KEY_TICKETS, JSON.stringify(ticketsLimitados));
      return of({ success: true, message: 'External ticket guardado' });
    } catch (error) {
      console.error('Error guardando external ticket:', error);
      return of({ success: false, error });
    }
  }

  // Validar descripción del campo "Otro"
  validarDescripcionOtro(descripcion: string): { valido: boolean; error?: string } {
    if (!descripcion || !descripcion.trim()) {
      return { valido: false, error: 'La descripción es obligatoria' };
    }

    const textoLimpio = descripcion.trim();

    // Máximo 100 caracteres
    if (textoLimpio.length > 100) {
      return { valido: false, error: 'Máximo 100 caracteres permitidos' };
    }

    // Validar palabras prohibidas
    const prohibidos = ['n/a', 'na', 'no aplica', 'no', 'ninguno', 'ninguna', 'nada'];
    const textoLower = textoLimpio.toLowerCase();
    
    for (const palabra of prohibidos) {
      if (textoLower === palabra || textoLower.includes(` ${palabra} `) || 
          textoLower.startsWith(`${palabra} `) || textoLower.endsWith(` ${palabra}`)) {
        return { valido: false, error: 'Debe ser una descripción válida y específica' };
      }
    }

    // Mínimo 10 caracteres para ser descriptivo
    if (textoLimpio.length < 10) {
      return { valido: false, error: 'La descripción debe ser más específica (mínimo 10 caracteres)' };
    }

    return { valido: true };
  }
}
