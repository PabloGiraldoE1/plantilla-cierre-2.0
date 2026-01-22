import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenteService } from '../../services/incidente';

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

  constructor(public incidenteService: IncidenteService) {}

  ngOnInit(): void {
    this.agrupadoresPorCategoria = this.incidenteService.agrupadoresPorCategoria;
    this.categorias = Object.keys(this.agrupadoresPorCategoria);
    this.totalAgrupadores = Object.values(this.agrupadoresPorCategoria)
      .reduce((total, items) => total + items.length, 0);
  }
}
