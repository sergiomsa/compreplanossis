import { Routes } from '@angular/router';
import { OperadorasComponent } from '../operadoras/operadoras.component';

export const OperadorasRoutes: Routes = [
{
  path: '',
  children: [{
    path: '',
    component: OperadorasComponent,
    data: { title: 'Operadoras', breadcrumb: 'Operadoras' }
  }]
}
];
