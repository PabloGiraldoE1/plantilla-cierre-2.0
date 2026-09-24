import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconName =
  | 'target'
  | 'clipboard'
  | 'clipboard-check'
  | 'wrench'
  | 'chart'
  | 'bolt'
  | 'folder'
  | 'check'
  | 'check-circle'
  | 'bulb'
  | 'file-text'
  | 'save'
  | 'eraser'
  | 'plus'
  | 'minus'
  | 'help'
  | 'info'
  | 'x'
  | 'x-circle'
  | 'search'
  | 'trash'
  | 'refresh'
  | 'inbox'
  | 'link'
  | 'tag'
  | 'eye'
  | 'eye-off'
  | 'copy'
  | 'chevron-up'
  | 'chevron-down'
  | 'sun'
  | 'moon'
  | 'alert'
  | 'menu'
  | 'book'
  | 'health'
  | 'chat'
  | 'money'
  | 'home'
  | 'inbox-down'
  | 'bell'
  | 'settings';

/** Trazados SVG en una rejilla de 24x24, estilo lineal. */
const PATHS: Record<IconName, string> = {
  target: 'M12 3a9 9 0 1 0 9 9 M12 7.5a4.5 4.5 0 1 0 4.5 4.5 M12 12l8-8 M15 4.5V9h4.5',
  clipboard:
    'M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z M8 6H6.5A1.5 1.5 0 0 0 5 7.5v12A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 17.5 6H16 M9 11h6 M9 15h4',
  'clipboard-check':
    'M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z M8 6H6.5A1.5 1.5 0 0 0 5 7.5v12A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 17.5 6H16 M9 13.5l2 2 4-4',
  wrench:
    'M14.7 6.3a4 4 0 0 0 5.1 5.1l-8 8a2.5 2.5 0 0 1-3.6-3.6l8-8z M14.7 6.3L17.5 3.5 M4 20l3-3',
  chart: 'M4 20h16 M7 20V11 M12 20V5 M17 20v-6',
  bolt: 'M13 2L4.5 13.5H11l-1 8.5L19.5 10H13l1-8z',
  folder:
    'M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.5h9A1.5 1.5 0 0 1 21 10v8.5A1.5 1.5 0 0 1 19.5 20h-15A1.5 1.5 0 0 1 3 18.5v-11z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  'check-circle': 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M8 12.2l2.7 2.8L16 9.5',
  bulb: 'M9.2 17h5.6 M10 20h4 M12 3a6 6 0 0 0-3.6 10.8c.5.4.8 1 .8 1.6v.6h5.6v-.6c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3z',
  'file-text':
    'M14 3H7.5A1.5 1.5 0 0 0 6 4.5v15A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V7l-4-4z M14 3v4h4 M9 12h6 M9 16h4',
  save: 'M5 5.5A1.5 1.5 0 0 1 6.5 4H16l4 4v11.5a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 5 19.5v-14z M8 4v5h7 M8 20v-5h8v5',
  eraser:
    'M8.5 20H20 M4.6 15.4l5.6-5.6a1.5 1.5 0 0 1 2.1 0l4.4 4.4a1.5 1.5 0 0 1 0 2.1L13.5 19.5H8l-3.4-3.4a.9.9 0 0 1 0-1.3z M10 9l4.5-4.5a1.5 1.5 0 0 1 2.1 0l3 3a1.5 1.5 0 0 1 0 2.1L15 15',
  plus: 'M12 5v14 M5 12h14',
  minus: 'M5 12h14',
  help: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.2-.9.8-.9 1.4v.6 M12 17h.01',
  info: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M12 11v5.5 M12 7.5h.01',
  x: 'M6 6l12 12 M18 6L6 18',
  'x-circle': 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M9 9l6 6 M15 9l-6 6',
  search: 'M10.8 4a6.8 6.8 0 1 1 0 13.6 6.8 6.8 0 0 1 0-13.6z M15.8 15.8L20 20',
  trash:
    'M4.5 7h15 M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7 M6.5 7l.8 12.1a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7 M10.5 11v6 M13.5 11v6',
  refresh: 'M20 12a8 8 0 1 1-2.6-5.9 M20 3.5V9h-5.5',
  inbox:
    'M3.5 13.5L6 5.6A1.5 1.5 0 0 1 7.4 4.5h9.2A1.5 1.5 0 0 1 18 5.6l2.5 7.9v4.4a1.6 1.6 0 0 1-1.6 1.6H5.1a1.6 1.6 0 0 1-1.6-1.6v-4.4z M3.5 13.5H9a3 3 0 0 0 6 0h5.5',
  link: 'M10.5 13.5a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 0 0-5.7-5.7l-1.4 1.4 M13.5 10.5a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 0 0 5.7 5.7l1.4-1.4',
  tag: 'M4 11.2V5.5A1.5 1.5 0 0 1 5.5 4h5.7a1.5 1.5 0 0 1 1.1.4l7 7a1.5 1.5 0 0 1 0 2.1l-5.8 5.8a1.5 1.5 0 0 1-2.1 0l-7-7a1.5 1.5 0 0 1-.4-1.1z M8 8h.01',
  eye: 'M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z M12 9.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6z',
  'eye-off':
    'M4 4l16 16 M9.9 5.2A9.4 9.4 0 0 1 12 5c6 0 9.5 6.2 9.5 6.2a16 16 0 0 1-3.2 3.9 M6.6 7.3A15.6 15.6 0 0 0 2.5 11.2S6 17.4 12 17.4a9.3 9.3 0 0 0 3.6-.7 M10.2 10a2.8 2.8 0 0 0 3.8 3.9',
  copy: 'M9 9.5A1.5 1.5 0 0 1 10.5 8h8A1.5 1.5 0 0 1 20 9.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 9 18.5v-9z M5.5 16A1.5 1.5 0 0 1 4 14.5v-9A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5',
  'chevron-up': 'M6 14.5l6-6 6 6',
  'chevron-down': 'M6 9.5l6 6 6-6',
  sun: 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z M12 2.5v2 M12 19.5v2 M2.5 12h2 M19.5 12h2 M5.2 5.2l1.4 1.4 M17.4 17.4l1.4 1.4 M18.8 5.2l-1.4 1.4 M6.6 17.4l-1.4 1.4',
  moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z',
  alert: 'M12 4.5l8.5 15H3.5l8.5-15z M12 10v4 M12 17h.01',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  book: 'M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2.5 2.5 0 0 1 2 1 2.5 2.5 0 0 1 2-1h4.5A1.5 1.5 0 0 1 20 5.5v12a1.5 1.5 0 0 1-1.5 1.5H14a2.5 2.5 0 0 0-2 1 2.5 2.5 0 0 0-2-1H5.5A1.5 1.5 0 0 1 4 17.5v-12z M12 6.5V20',
  health:
    'M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5v-11z M12 8.5v7 M8.5 12h7',
  chat: 'M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v8a1.5 1.5 0 0 1-1.5 1.5H9l-5 4v-4H5.5A1.5 1.5 0 0 1 4 14.5v-8z M8.5 10.5h7',
  money:
    'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M14.5 9.2a2.8 2.8 0 0 0-2.5-1.4c-1.5 0-2.5.8-2.5 1.9 0 2.6 5 1.3 5 3.9 0 1.2-1 2-2.5 2a2.8 2.8 0 0 1-2.5-1.4 M12 6.2v1.6 M12 16.2v1.6',
  home: 'M4 10.5L12 4l8 6.5 M6.2 9.4V19a1 1 0 0 0 1 1h9.6a1 1 0 0 0 1-1V9.4 M10 20v-5.5h4V20',
  'inbox-down':
    'M12 4v8.5 M8.5 9.5L12 13l3.5-3.5 M4 15.5v3A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-3',
  bell: 'M9.5 19a2.5 2.5 0 0 0 5 0 M18 16.5H6l1.2-2V10a4.8 4.8 0 0 1 9.6 0v4.5l1.2 2z',
  settings:
    'M12 9.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6z M19.2 14a1.5 1.5 0 0 0 .3 1.7l.1.1a1.8 1.8 0 1 1-2.6 2.6l-.1-.1a1.5 1.5 0 0 0-2.5 1v.2a1.8 1.8 0 1 1-3.6 0v-.1a1.5 1.5 0 0 0-2.6-1l-.1.1a1.8 1.8 0 1 1-2.6-2.6l.1-.1a1.5 1.5 0 0 0-1-2.5h-.2a1.8 1.8 0 1 1 0-3.6h.1a1.5 1.5 0 0 0 1-2.6l-.1-.1a1.8 1.8 0 1 1 2.6-2.6l.1.1a1.5 1.5 0 0 0 2.5-1v-.2a1.8 1.8 0 1 1 3.6 0v.1a1.5 1.5 0 0 0 2.6 1l.1-.1a1.8 1.8 0 1 1 2.6 2.6l-.1.1a1.5 1.5 0 0 0 1 2.5h.2a1.8 1.8 0 1 1 0 3.6h-.1a1.5 1.5 0 0 0-1.4.9z',
};

/**
 * Icono SVG en linea. Decorativo por defecto; cuando se pasa
 * un label se expone a lectores de pantalla con role="img".
 */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.role]="label() ? 'img' : null"
      [attr.aria-label]="label() || null"
      [attr.aria-hidden]="label() ? null : 'true'"
      focusable="false"
    >
      @for (d of segments(); track d) {
        <path [attr.d]="d" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      line-height: 0;
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(18);
  readonly strokeWidth = input(1.8);
  /** Texto alternativo. Vacio = icono decorativo. */
  readonly label = input('');

  protected readonly segments = computed(() =>
    PATHS[this.name()].split(' M').map((seg, i) => (i === 0 ? seg : `M${seg}`)),
  );
}
