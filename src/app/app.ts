import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from './components/icon/icon';
import { ThemeService } from './services/theme';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly themeService = inject(ThemeService);

  readonly title = 'Gestión de Incidentes';
  readonly anioActual = new Date().getFullYear();
  readonly temaEfectivo = this.themeService.temaEfectivo;
  readonly menuAbierto = signal(false);

  readonly enlaces = [
    { ruta: '/formulario', icono: 'clipboard-check', texto: 'Plantilla de Cierre' },
    { ruta: '/agrupadores', icono: 'target', texto: 'Agrupadores' },
    { ruta: '/plantilla-tecnica', icono: 'wrench', texto: 'Raizales' },
    { ruta: '/historial', icono: 'chart', texto: 'Historial' },
  ] as const;

  alternarTema(): void {
    this.themeService.alternar();
  }

  alternarMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }
}
