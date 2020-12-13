import { Routes } from '@angular/router';
import { TiposdeestabelecimentoComponent } from '../tiposdeestabelecimento/tiposdeestabelecimento.component';

export const TiposdeestabelecimentoRoutes: Routes = [
{
  path: '',
  children: [{
    path: '',
    component: TiposdeestabelecimentoComponent,
    data: { title: 'Tipos de estabelecimento', breadcrumb: 'Tipos de estabelecimento' }
  }]
}
];
