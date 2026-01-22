import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IncidenteService } from '../../services/incidente';
import { AgrupadorSeleccionado } from '../../services/agrupador-seleccionado';

@Component({
  selector: 'app-lista-agrupadores',
  imports: [CommonModule],
  templateUrl: './lista-agrupadores.html',
  styleUrl: './lista-agrupadores.scss',
})
export class ListaAgrupadores implements OnInit {
  agrupadoresPorCategoria: { [key: string]: string[] } = {};
  categorias: string[] = [];
  totalAgrupadores: number = 0;

  constructor(
    public incidenteService: IncidenteService,
    private agrupadorService: AgrupadorSeleccionado,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.agrupadoresPorCategoria = this.incidenteService.agrupadoresPorCategoria;
    this.categorias = Object.keys(this.agrupadoresPorCategoria);
    this.totalAgrupadores = Object.values(this.agrupadoresPorCategoria)
      .reduce((total, items) => total + items.length, 0);
  }

  seleccionarAgrupador(agrupador: string): void {
    this.agrupadorService.setAgrupador(agrupador);
    this.router.navigate(['/formulario']);
  }
}
