import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidenteService } from '../../services/incidente';
import { AgrupadorSeleccionado } from '../../services/agrupador-seleccionado';

@Component({
  selector: 'app-lista-agrupadores',
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-agrupadores.html',
  styleUrl: './lista-agrupadores.scss',
})
export class ListaAgrupadores implements OnInit {
  agrupadoresPorCategoria: { [key: string]: string[] } = {};
  categorias: string[] = [];
  totalAgrupadores: number = 0;
  terminoBusqueda: string = '';

  // Generador de External Ticket
  aplicativoSeleccionado: string = '';
  procesoSeleccionado: string = '';
  agrupadorSeleccionadoTicket: string = '';
  externalTicket: string = '';
  toastMessage: string = '';
  mostrarToast: boolean = false;

  // Autocomplete del agrupador
  busquedaAgrupadorTicket: string = '';
  sugerenciasAgrupador: string[] = [];
  mostrarSugerencias: boolean = false;

  get categoriasFiltradas(): string[] {
    const termino = this.terminoBusqueda.trim().toLowerCase();
    if (!termino) return this.categorias;
    return this.categorias.filter(cat =>
      cat.toLowerCase().includes(termino) ||
      this.agrupadoresPorCategoria[cat].some(ag => ag.toLowerCase().includes(termino))
    );
  }

  agrupadoresFiltrados(categoria: string): string[] {
    const termino = this.terminoBusqueda.trim().toLowerCase();
    if (!termino) return this.agrupadoresPorCategoria[categoria];
    return this.agrupadoresPorCategoria[categoria].filter(ag =>
      ag.toLowerCase().includes(termino)
    );
  }

  get resultadosBusqueda(): number {
    if (!this.terminoBusqueda.trim()) return 0;
    return this.categoriasFiltradas.reduce(
      (total, cat) => total + this.agrupadoresFiltrados(cat).length,
      0
    );
  }

  constructor(
    public incidenteService: IncidenteService,
    private agrupadorService: AgrupadorSeleccionado
  ) {}

  ngOnInit(): void {
    this.agrupadoresPorCategoria = this.incidenteService.agrupadoresPorCategoria;
    this.categorias = Object.keys(this.agrupadoresPorCategoria);
    this.totalAgrupadores = Object.values(this.agrupadoresPorCategoria)
      .reduce((total, items) => total + items.length, 0);
  }

  seleccionarAgrupadorParaTicket(agrupador: string): void {
    this.agrupadorSeleccionadoTicket = agrupador;
    this.busquedaAgrupadorTicket = agrupador;
    this.sugerenciasAgrupador = [];
    this.mostrarSugerencias = false;
    this.calcularExternalTicket();
    this.showToast('✅ Agrupador seleccionado: ' + agrupador);
  }

  filtrarSugerencias(): void {
    const termino = this.busquedaAgrupadorTicket.trim().toLowerCase();
    if (!termino) {
      this.sugerenciasAgrupador = [];
      this.mostrarSugerencias = false;
      this.agrupadorSeleccionadoTicket = '';
      this.externalTicket = '';
      return;
    }
    this.sugerenciasAgrupador = this.incidenteService.opcionesAgrupador
      .filter(ag => ag.toLowerCase().includes(termino))
      .slice(0, 20);
    this.mostrarSugerencias = this.sugerenciasAgrupador.length > 0;
    // Si el texto no coincide exactamente con el agrupador previo, invalidar ticket
    if (this.busquedaAgrupadorTicket !== this.agrupadorSeleccionadoTicket) {
      this.agrupadorSeleccionadoTicket = '';
      this.externalTicket = '';
    }
  }

  seleccionarSugerencia(agrupador: string): void {
    this.seleccionarAgrupadorParaTicket(agrupador);
  }

  ocultarSugerencias(): void {
    setTimeout(() => { this.mostrarSugerencias = false; }, 200);
  }

  calcularExternalTicket(): void {
    const agrupadorValido = this.incidenteService.opcionesAgrupador.includes(this.agrupadorSeleccionadoTicket);
    if (this.aplicativoSeleccionado && this.procesoSeleccionado && this.agrupadorSeleccionadoTicket && agrupadorValido) {
      this.externalTicket = this.incidenteService.generarExternalTicket(
        this.aplicativoSeleccionado,
        this.procesoSeleccionado,
        this.agrupadorSeleccionadoTicket
      );
    } else {
      this.externalTicket = '';
    }
  }

  copiarTicket(): void {
    if (!this.externalTicket) {
      this.showToast('Selecciona aplicativo, proceso y agrupador primero');
      return;
    }
    navigator.clipboard.writeText(this.externalTicket).then(() => {
      this.showToast('📋 External Ticket copiado');
    });
  }

  private showToast(message: string): void {
    this.toastMessage = message;
    this.mostrarToast = true;
    setTimeout(() => {
      this.mostrarToast = false;
    }, 3500);
  }
}

