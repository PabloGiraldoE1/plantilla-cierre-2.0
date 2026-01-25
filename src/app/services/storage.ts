import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Incidente } from '../models/incidente';
import { PlantillaTecnica } from '../models/plantilla-tecnica';

@Injectable({
  providedIn: 'root',
})
export class Storage {
  private readonly STORAGE_KEY = 'incidentes_historial';
  private readonly STORAGE_KEY_TECNICA = 'plantillas_tecnicas';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor() { }

  // Guardar incidente en localStorage
  guardarIncidente(incidente: Incidente): void {
    if (!this.isBrowser) return;
    
    const historial = this.obtenerHistorial();
    incidente.id = this.generarId();
    incidente.fecha = new Date();
    historial.push(incidente);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(historial));
  }

  // Obtener todos los incidentes
  obtenerHistorial(): Incidente[] {
    if (!this.isBrowser) return [];
    
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Eliminar un incidente por ID
  eliminarIncidente(id: string): void {
    if (!this.isBrowser) return;
    
    const historial = this.obtenerHistorial().filter(inc => inc.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(historial));
  }

  // Limpiar todo el historial
  limpiarHistorial(): void {
    if (!this.isBrowser) return;
    
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

  // === MÉTODOS PARA PLANTILLAS TÉCNICAS ===
  
  // Guardar plantilla técnica en localStorage
  guardarPlantillaTecnica(plantilla: PlantillaTecnica): void {
    if (!this.isBrowser) return;
    
    const historial = this.obtenerPlantillasTecnicas();
    plantilla.id = this.generarId();
    plantilla.fecha = new Date();
    historial.push(plantilla);
    localStorage.setItem(this.STORAGE_KEY_TECNICA, JSON.stringify(historial));
  }

  // Obtener todas las plantillas técnicas
  obtenerPlantillasTecnicas(): PlantillaTecnica[] {
    if (!this.isBrowser) return [];
    
    const data = localStorage.getItem(this.STORAGE_KEY_TECNICA);
    return data ? JSON.parse(data) : [];
  }

  // Eliminar una plantilla técnica por ID
  eliminarPlantillaTecnica(id: string): void {
    if (!this.isBrowser) return;
    
    const historial = this.obtenerPlantillasTecnicas().filter(plt => plt.id !== id);
    localStorage.setItem(this.STORAGE_KEY_TECNICA, JSON.stringify(historial));
  }

  // Limpiar todas las plantillas técnicas
  limpiarPlantillasTecnicas(): void {
    if (!this.isBrowser) return;
    
    localStorage.removeItem(this.STORAGE_KEY_TECNICA);
  }
}

