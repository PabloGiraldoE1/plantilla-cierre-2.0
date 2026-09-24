import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/formulario', pathMatch: 'full' },
  {
    path: 'formulario',
    title: 'Plantilla de Cierre',
    loadComponent: () =>
      import('./components/formulario-incidente/formulario-incidente').then(
        (m) => m.FormularioIncidente,
      ),
  },
  {
    path: 'plantilla-tecnica',
    title: 'Raizales',
    loadComponent: () =>
      import('./components/plantilla-tecnica/plantilla-tecnica').then(
        (m) => m.PlantillaTecnicaComponent,
      ),
  },
  {
    path: 'historial',
    title: 'Historial',
    loadComponent: () =>
      import('./components/historial-incidentes/historial-incidentes').then(
        (m) => m.HistorialIncidentes,
      ),
  },
  {
    path: 'agrupadores',
    title: 'Agrupadores',
    loadComponent: () =>
      import('./components/lista-agrupadores/lista-agrupadores').then((m) => m.ListaAgrupadores),
  },
  { path: '**', redirectTo: '/formulario' },
];
