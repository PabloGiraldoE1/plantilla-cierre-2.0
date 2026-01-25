import { Routes } from '@angular/router';
import { FormularioIncidente } from './components/formulario-incidente/formulario-incidente';
import { HistorialIncidentes } from './components/historial-incidentes/historial-incidentes';
import { ListaAgrupadores } from './components/lista-agrupadores/lista-agrupadores';
import { PlantillaTecnicaComponent } from './components/plantilla-tecnica/plantilla-tecnica';

export const routes: Routes = [
  { path: '', redirectTo: '/formulario', pathMatch: 'full' },
  { path: 'formulario', component: FormularioIncidente },
  { path: 'plantilla-tecnica', component: PlantillaTecnicaComponent },
  { path: 'historial', component: HistorialIncidentes },
  { path: 'agrupadores', component: ListaAgrupadores },
  { path: '**', redirectTo: '/formulario' }
];

