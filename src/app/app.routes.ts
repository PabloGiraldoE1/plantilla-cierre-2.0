import { Routes } from '@angular/router';
import { FormularioIncidente } from './components/formulario-incidente/formulario-incidente';
import { HistorialIncidentes } from './components/historial-incidentes/historial-incidentes';

export const routes: Routes = [
  { path: '', redirectTo: '/formulario', pathMatch: 'full' },
  { path: 'formulario', component: FormularioIncidente },
  { path: 'historial', component: HistorialIncidentes },
  { path: '**', redirectTo: '/formulario' }
];

