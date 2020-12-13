import { Routes } from '@angular/router';
import { PlanoitensComponent } from '../planoitens/planoitens.component';

export const PlanoitensRoutes: Routes = [
{
  path: '',
  children: [{
    path: '',
    component: PlanoitensComponent,
    data: { title: 'Plano itens', breadcrumb: 'Plano itens' }
  }]
}
];
