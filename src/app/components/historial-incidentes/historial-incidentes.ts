import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '../../services/storage';
import { IncidenteCompartido } from '../../services/incidente-compartido';
import { Incidente } from '../../models/incidente';

@Component({
  selector: 'app-historial-incidentes',
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-incidentes.html',
  styleUrl: './historial-incidentes.scss',
})
export class HistorialIncidentes implements OnInit {
  historial: Incidente[] = [];
  filteredHistorial: Incidente[] = [];
  searchTerm: string = '';
  filtroAplicativo: string = '';
  aplicativosUnicos: string[] = [];

  constructor(
    private storageService: Storage,
    private incidenteCompartido: IncidenteCompartido,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.historial = this.storageService.obtenerHistorial();
    this.filteredHistorial = [...this.historial];
    this.extraerAplicativosUnicos();
  }

  extraerAplicativosUnicos(): void {
    const aplicativos = this.historial.map(inc => inc.aplicativoAfectado);
    this.aplicativosUnicos = [...new Set(aplicativos)].filter(Boolean);
  }

  buscar(): void {
    let resultado = [...this.historial];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      resultado = resultado.filter(inc => 
        inc.agrupadorError?.toLowerCase().includes(term) ||
        inc.diagnostico?.toLowerCase().includes(term) ||
        inc.descripcionSolucion?.toLowerCase().includes(term) ||
        inc.externalTicket?.toLowerCase().includes(term)
      );
    }
    
    if (this.filtroAplicativo) {
      resultado = resultado.filter(inc => inc.aplicativoAfectado === this.filtroAplicativo);
    }
    
    this.filteredHistorial = resultado;
  }

  eliminarIncidente(id: string | undefined): void {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar este incidente?')) {
      this.storageService.eliminarIncidente(id);
      this.cargarHistorial();
    }
  }

  limpiarHistorial(): void {
    if (confirm('¿Estás seguro de eliminar TODO el historial? Esta acción no se puede deshacer.')) {
      this.storageService.limpiarHistorial();
      this.cargarHistorial();
    }
  }

  formatearFecha(fecha: Date | undefined): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleString('es-ES');
  }

  copiarIncidente(incidente: Incidente): void {
    const mensajeCierre = incidente.mensajeCierre || 'Ha sido un gusto ayudarte. En breve recibirás un correo con la resolución del incidente y una breve encuesta de satisfacción. Solo tomará 3 minutos y tus comentarios nos ayudan a mejorar. ¡Gracias por tu confianza!';
    
    const texto = `
* Agrupador del Error: ${incidente.agrupadorError}
* Causa del Error: ${incidente.causaError}
* Proceso del Error: ${incidente.procesoError}
* HU Raizal / Mejora: ${incidente.huRaizal}
* Estado Raizal: ${incidente.estadoRaizal}
* Responsable Solución: ${incidente.responsableSolucion}
* Diagnóstico: ${incidente.diagnostico}
* Acción Ejecutada: ${incidente.accionEjecutada}
* Descripción de Solución: ${incidente.descripcionSolucion}

${mensajeCierre}

* Confirmar operatividad del usuario Afectado: ${incidente.confirmacionUsuario}
* ID Formulario de Solicitud de Credenciales: ${incidente.formularioCredenciales}
* OC Acceso a PAM - (PAM): ${incidente.ocPam}
* Causa Raíz (Identificada/Sin Identificar): ${incidente.causaRaiz}
    `.trim();
    
    navigator.clipboard.writeText(texto).then(() => {
      alert('📋 Incidente copiado al portapapeles');
    });
  }

  recuperarIncidente(incidente: Incidente): void {
    this.incidenteCompartido.setIncidente(incidente);
    this.router.navigate(['/formulario']);
    setTimeout(() => {
      alert('✅ Incidente recuperado. Los datos se han cargado en el formulario.');
    }, 300);
  }
}

