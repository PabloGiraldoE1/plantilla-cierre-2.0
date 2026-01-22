import { Injectable } from '@angular/core';
import { Incidente } from '../models/incidente';

@Injectable({
  providedIn: 'root',
})
export class Storage {
  private readonly STORAGE_KEY = 'incidentes_historial';

  constructor() { }

  // Guardar incidente en localStorage
  guardarIncidente(incidente: Incidente): void {
    const historial = this.obtenerHistorial();
    incidente.id = this.generarId();
    incidente.fecha = new Date();
    historial.push(incidente);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(historial));
  }

  // Obtener todos los incidentes
  obtenerHistorial(): Incidente[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Eliminar un incidente por ID
  eliminarIncidente(id: string): void {
    const historial = this.obtenerHistorial().filter(inc => inc.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(historial));
  }

  // Limpiar todo el historial
  limpiarHistorial(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Exportar historial como JSON
  exportarJSON(): string {
    return JSON.stringify(this.obtenerHistorial(), null, 2);
  }

  // Exportar historial como CSV
  exportarCSV(): string {
    const historial = this.obtenerHistorial();
    if (historial.length === 0) return '';

    const headers = Object.keys(historial[0]).join(',');
    const rows = historial.map(inc => 
      Object.values(inc).map(val => `"${val}"`).join(',')
    );
    return [headers, ...rows].join('\n');
  }

  // Generar ID único
  private generarId(): string {
    return `INC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

