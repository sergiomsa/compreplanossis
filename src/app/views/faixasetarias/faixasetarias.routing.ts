import { Routes } from '@angular/router';
import { FaixasetariasComponent } from '../faixasetarias/faixasetarias.component';

export const FaixasetariasRoutes: Routes = [
{
  path: '',
  children: [{
    path: '',
    component: FaixasetariasComponent,
    data: { title: 'Faixasetarias', breadcrumb: 'Faixasetarias' }
  }]
}
];
