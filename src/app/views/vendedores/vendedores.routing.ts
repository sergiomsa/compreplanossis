import { Routes } from '@angular/router';
import { VendedoresComponent } from '../vendedores/vendedores.component';

export const VendedoresRoutes: Routes = [
{
  path: '',
  children: [{
    path: '',
    component: VendedoresComponent,
    data: { title: 'Vendedores', breadcrumb: 'Vendedores' }
  }]
}
];
