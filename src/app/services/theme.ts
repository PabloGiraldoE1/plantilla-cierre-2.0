import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'tema_preferido';

/**
 * Preferencia de tema del usuario.
 * Se persiste en localStorage y se refleja en el atributo
 * data-theme del elemento <html>, que es lo que leen los
 * tokens definidos en styles.scss.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  readonly theme = signal<Theme>(this.leerPreferencia());

  /** Tema realmente aplicado, resolviendo 'system'. */
  readonly temaEfectivo = computed<'light' | 'dark'>(() => {
    const valor = this.theme();
    if (valor !== 'system') return valor;
    return this.prefiereOscuroDelSistema() ? 'dark' : 'light';
  });

  constructor() {
    effect(() => {
      const valor = this.theme();
      if (!this.isBrowser) return;

      const raiz = document.documentElement;
      if (valor === 'system') {
        raiz.removeAttribute('data-theme');
      } else {
        raiz.setAttribute('data-theme', valor);
      }

      try {
        localStorage.setItem(STORAGE_KEY, valor);
      } catch {
        // Modo privado o almacenamiento bloqueado: se ignora.
      }
    });
  }

  /** Alterna entre claro y oscuro partiendo del tema efectivo. */
  alternar(): void {
    this.theme.set(this.temaEfectivo() === 'dark' ? 'light' : 'dark');
  }

  establecer(valor: Theme): void {
    this.theme.set(valor);
  }

  private leerPreferencia(): Theme {
    if (!this.isBrowser) return 'system';
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado === 'light' || guardado === 'dark' || guardado === 'system') {
        return guardado;
      }
    } catch {
      // Sin acceso a localStorage: se usa la preferencia del sistema.
    }
    return 'system';
  }

  private prefiereOscuroDelSistema(): boolean {
    if (!this.isBrowser || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
