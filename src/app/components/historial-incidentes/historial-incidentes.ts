import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '../../services/storage';
import { IncidenteCompartido } from '../../services/incidente-compartido';
import { Incidente } from '../../models/incidente';

const MENSAJE_CIERRE = 'Ha sido un gusto ayudarte. En breve recibirás un correo con la resolución del incidente y una breve encuesta de satisfacción. Solo tomará 3 minutos y tus comentarios nos ayudan a mejorar. ¡Gracias por tu confianza!';

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
  toastMessage: string = '';
  mostrarToast: boolean = false;

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
  }

  buscar(): void {
    if (!this.searchTerm) {
      this.filteredHistorial = [...this.historial];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredHistorial = this.historial.filter(inc =>
      inc.causaError?.toLowerCase().includes(term) ||
      inc.huRaizal?.toLowerCase().includes(term) ||
      inc.huRaizalOtro?.toLowerCase().includes(term) ||
      inc.causaRaiz?.toLowerCase().includes(term) ||
      inc.descripcionSolucion?.toLowerCase().includes(term)
    );
  }

  eliminarIncidente(id: string | undefined): void {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar este incidente?')) {
      this.storageService.eliminarIncidente(id);
      this.cargarHistorial();
      this.showToast('🗑️ Incidente eliminado');
    }
  }

  limpiarHistorial(): void {
    if (confirm('¿Estás seguro de eliminar TODO el historial? Esta acción no se puede deshacer.')) {
      this.storageService.limpiarHistorial();
      this.cargarHistorial();
      this.showToast('🧹 Historial limpiado');
    }
  }

  formatearFecha(fecha: Date | undefined): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  }

  getHuDisplay(incidente: Incidente): string {
    if (incidente.huRaizal === 'OTRO' && incidente.huRaizalOtro) {
      return incidente.huRaizalOtro;
    }
    return incidente.huRaizal || 'N/A';
  }

  copiarIncidente(incidente: Incidente): void {
    const raizalTexto = incidente.huRaizal === 'OTRO' && incidente.huRaizalOtro
      ? incidente.huRaizalOtro
      : (incidente.huRaizal?.match(/^(\d+)/) ? incidente.huRaizal.match(/^(\d+)/)![1] : incidente.huRaizal || '');

    const texto = `* Causa del Error: ${incidente.causaError || ''}
* HU Raizal / Mejora: ${raizalTexto}
* Causa Raíz (Identificada/Sin Identificar): ${incidente.causaRaiz || ''}
* Descripción de Solución: ${incidente.descripcionSolucion || ''}

${MENSAJE_CIERRE}

* Confirmar Operatividad del Usuario Afectado: ${incidente.confirmacionUsuario || ''}`.trim();

    navigator.clipboard.writeText(texto).then(() => {
      this.showToast('📋 Incidente copiado al portapapeles');
    });
  }

  recuperarIncidente(incidente: Incidente): void {
    this.incidenteCompartido.setIncidente(incidente);
    this.router.navigate(['/formulario']);
    setTimeout(() => {
      this.showToast('✅ Incidente recuperado en el formulario');
    }, 300);
  }

  showToast(message: string): void {
    this.toastMessage = message;
    this.mostrarToast = true;
    setTimeout(() => { this.mostrarToast = false; }, 3500);
  }
}
