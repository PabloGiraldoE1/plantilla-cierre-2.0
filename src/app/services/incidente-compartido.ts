import { Injectable, signal } from '@angular/core';
import { Incidente } from '../models/incidente';

@Injectable({
  providedIn: 'root',
})
export class IncidenteCompartido {
  private incidenteRecuperado = signal<Incidente | null>(null);

  setIncidente(incidente: Incidente): void {
    this.incidenteRecuperado.set(incidente);
  }

  getIncidente(): Incidente | null {
    return this.incidenteRecuperado();
  }

  limpiarIncidente(): void {
    this.incidenteRecuperado.set(null);
  }
}
