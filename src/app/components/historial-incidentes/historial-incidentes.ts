import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '../../services/storage';
import { IncidenteCompartido } from '../../services/incidente-compartido';
import { Incidente } from '../../models/incidente';

interface IncidentePorAnalista {
  analista: string;
  incidentes: Incidente[];
  totalCriticos: number;
  totalAltos: number;
}

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
  
  // Signals para análisis
  vistaActual = signal<'todos' | 'analisis' | 'reabiertos'>('todos');
  
  // Computed para incidentes prioritarios (Crítica y Alta, ANS Sí)
  incidentesPrioritarios = computed(() => {
    return this.historial.filter(inc => 
      (inc.urgencia === 'Crítica' || inc.urgencia === 'Alta') && 
      inc.cumpleANS === 'Sí'
    ).sort((a, b) => {
      if (a.urgencia === 'Crítica' && b.urgencia !== 'Crítica') return -1;
      if (a.urgencia !== 'Crítica' && b.urgencia === 'Crítica') return 1;
      return (a.analista || '').localeCompare(b.analista || '');
    });
  });
  
  // Computed para agrupar incidentes por analista
  incidentesPorAnalista = computed(() => {
    const grupos = new Map<string, Incidente[]>();
    
    this.incidentesPrioritarios().forEach(inc => {
      const analista = inc.analista || 'Sin Asignar';
      if (!grupos.has(analista)) {
        grupos.set(analista, []);
      }
      grupos.get(analista)!.push(inc);
    });
    
    const resultado: IncidentePorAnalista[] = [];
    grupos.forEach((incidentes, analista) => {
      resultado.push({
        analista,
        incidentes,
        totalCriticos: incidentes.filter(i => i.urgencia === 'Crítica').length,
        totalAltos: incidentes.filter(i => i.urgencia === 'Alta').length
      });
    });
    
    return resultado.sort((a, b) => 
      (b.totalCriticos + b.totalAltos) - (a.totalCriticos + a.totalAltos)
    );
  });
  
  // Computed para incidentes reabiertos
  incidentesReabiertos = computed(() => {
    return this.historial.filter(inc => 
      inc.fechaReapertura && inc.fechaReapertura !== null
    ).sort((a, b) => {
      const fechaA = a.fechaReapertura ? new Date(a.fechaReapertura).getTime() : 0;
      const fechaB = b.fechaReapertura ? new Date(b.fechaReapertura).getTime() : 0;
      return fechaB - fechaA; // Más recientes primero
    });
  });

  constructor(
    private storageService: Storage,
    private incidenteCompartido: IncidenteCompartido,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cambiarVista(vista: 'todos' | 'analisis' | 'reabiertos'): void {
    this.vistaActual.set(vista);
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
      inc.causaRaiz?.toLowerCase().includes(term) ||
      inc.descripcionSolucion?.toLowerCase().includes(term)
    );
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
    const mensajeCierre = 'Ha sido un gusto ayudarte. En breve recibirás un correo con la resolución del incidente y una breve encuesta de satisfacción. Solo tomará 3 minutos y tus comentarios nos ayudan a mejorar. ¡Gracias por tu confianza!';
    const texto = `* Causa del Error: ${incidente.causaError || ''}
* HU Raizal / Mejora: ${incidente.huRaizal || ''}
* Causa Raíz (Identificada/Sin Identificar): ${incidente.causaRaiz || ''}
* Descripción de Solución: ${incidente.descripcionSolucion || ''}

${mensajeCierre}

* Confirmar Operatividad del Usuario Afectado: ${incidente.confirmacionUsuario || ''}`.trim();

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


