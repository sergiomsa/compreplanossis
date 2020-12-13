import { Routes } from '@angular/router';
import { ContratacoesComponent } from '../contratacoes/contratacoes.component';

export const ContratacoesRoutes: Routes = [
{
  path: '',
  children: [{
    path: '',
    component: ContratacoesComponent,
    data: { title: 'Contratações', breadcrumb: 'Contratações' }
  }]
}
];
