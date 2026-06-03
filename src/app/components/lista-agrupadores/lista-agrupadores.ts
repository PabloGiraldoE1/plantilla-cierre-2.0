import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidenteService, AppTicketSection } from '../../services/incidente';

@Component({
  selector: 'app-lista-agrupadores',
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-agrupadores.html',
  styleUrl: './lista-agrupadores.scss',
})
export class ListaAgrupadores implements OnInit {
  secciones: AppTicketSection[] = [];
  toastMessage: string = '';
  mostrarToast: boolean = false;

  constructor(public incidenteService: IncidenteService) {}

  ngOnInit(): void {
    this.secciones = this.incidenteService.crearSecciones();
  }

  toggleSeccion(seccion: AppTicketSection): void {
    seccion.isOpen = !seccion.isOpen;
  }

  toggleListaAgrupadores(seccion: AppTicketSection): void {
    seccion.mostrarListaAgrupadores = !seccion.mostrarListaAgrupadores;
  }

  filtrarSugerencias(seccion: AppTicketSection): void {
    const termino = seccion.busquedaAgrupador.trim().toLowerCase();
    if (!termino) {
      seccion.sugerencias = [];
      seccion.mostrarSugerencias = false;
      seccion.selectedAgrupador = '';
      seccion.externalTicket = '';
      return;
    }
    seccion.sugerencias = seccion.agrupadores
      .filter(ag => ag.toLowerCase().includes(termino))
      .slice(0, 20);
    seccion.mostrarSugerencias = seccion.sugerencias.length > 0;
    if (seccion.busquedaAgrupador !== seccion.selectedAgrupador) {
      seccion.selectedAgrupador = '';
      seccion.externalTicket = '';
    }
  }

  seleccionarSugerencia(seccion: AppTicketSection, agrupador: string): void {
    seccion.selectedAgrupador = agrupador;
    seccion.busquedaAgrupador = agrupador;
    seccion.sugerencias = [];
    seccion.mostrarSugerencias = false;
    this.calcularTicket(seccion);
    this.showToast('✅ Agrupador seleccionado');
  }

  seleccionarAgrupadorDeLista(seccion: AppTicketSection, agrupador: string): void {
    seccion.selectedAgrupador = agrupador;
    seccion.busquedaAgrupador = agrupador;
    seccion.sugerencias = [];
    seccion.mostrarSugerencias = false;
    this.calcularTicket(seccion);
    this.showToast('✅ Agrupador seleccionado: ' + agrupador);
  }

  ocultarSugerencias(seccion: AppTicketSection): void {
    setTimeout(() => { seccion.mostrarSugerencias = false; }, 200);
  }

  limpiarAgrupador(seccion: AppTicketSection): void {
    seccion.busquedaAgrupador = '';
    seccion.selectedAgrupador = '';
    seccion.externalTicket = '';
    seccion.sugerencias = [];
    seccion.mostrarSugerencias = false;
  }

  calcularTicket(seccion: AppTicketSection): void {
    const app = seccion.aplicativoFijo || seccion.selectedApp;
    const proceso = seccion.selectedProceso;
    const agrupador = seccion.selectedAgrupador;

    if (app && proceso && agrupador) {
      seccion.externalTicket = this.incidenteService.generarExternalTicket(app, proceso, agrupador);
    } else {
      seccion.externalTicket = '';
    }
  }

  copiarTicket(seccion: AppTicketSection): void {
    if (!seccion.externalTicket) {
      this.showToast('Selecciona aplicativo, proceso y agrupador primero');
      return;
    }
    navigator.clipboard.writeText(seccion.externalTicket).then(() => {
      this.showToast('📋 External Ticket copiado: ' + seccion.externalTicket);
    });
  }

  expandirTodas(): void {
    this.secciones.forEach(s => s.isOpen = true);
  }

  colapsarTodas(): void {
    this.secciones.forEach(s => { s.isOpen = false; s.mostrarListaAgrupadores = false; });
  }

  private showToast(message: string): void {
    this.toastMessage = message;
    this.mostrarToast = true;
    setTimeout(() => { this.mostrarToast = false; }, 3500);
  }
}
