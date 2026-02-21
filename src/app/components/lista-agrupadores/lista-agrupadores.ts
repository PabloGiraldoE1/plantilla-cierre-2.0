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

  // Generador de External Ticket
  aplicativoSeleccionado: string = '';
  procesoSeleccionado: string = '';
  agrupadorSeleccionadoTicket: string = '';
  externalTicket: string = '';
  toastMessage: string = '';
  mostrarToast: boolean = false;

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
    this.calcularExternalTicket();
    this.showToast('✅ Agrupador seleccionado: ' + agrupador);
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

