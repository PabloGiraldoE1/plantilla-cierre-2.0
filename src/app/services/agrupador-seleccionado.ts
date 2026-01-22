import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AgrupadorSeleccionado {
  // Signal para compartir el agrupador seleccionado entre componentes
  private agrupadorSignal = signal<string>('');

  setAgrupador(agrupador: string): void {
    this.agrupadorSignal.set(agrupador);
  }

  getAgrupador(): string {
    const valor = this.agrupadorSignal();
    // Limpiar después de leer
    this.agrupadorSignal.set('');
    return valor;
  }
}
