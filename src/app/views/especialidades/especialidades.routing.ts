import { Routes } from '@angular/router';
import { EspecialidadesComponent } from '../especialidades/especialidades.component';

export const EspecialidadesRoutes: Routes = [
{
  path: '',
  children: [{
    path: '',
    component: EspecialidadesComponent,
    data: { title: 'Especialidades', breadcrumb: 'Especialidades' }
  }]
}
];
