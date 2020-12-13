import { Routes } from '@angular/router';
import { GruposComponent } from '../grupos/grupos.component';

export const GruposRoutes: Routes = [
{
  path: '',
  children: [{
    path: '',
    component: GruposComponent,
    data: { title: 'Grupos', breadcrumb: 'Grupos' }
  }]
}
];
