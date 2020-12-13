import { Routes } from '@angular/router';
import { RolsdecoberturaComponent } from '../rolsdecobertura/rolsdecobertura.component';

export const RolsdecoberturaRoutes: Routes = [
{
  path: '',
  children: [{
    path: '',
    component: RolsdecoberturaComponent,
    data: { title: 'Rol de cobertura', breadcrumb: 'Rol de cobertura' }
  }]
}
];
