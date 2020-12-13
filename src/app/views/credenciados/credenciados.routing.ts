import { Routes } from '@angular/router';
import { CredenciadosComponent } from '../credenciados/credenciados.component';

export const CredenciadosRoutes: Routes = [
{
  path: '',
  children: [{
    path: '',
    component: CredenciadosComponent,
    data: { title: 'Credenciados', breadcrumb: 'Credenciados' }
  }]
}
];
