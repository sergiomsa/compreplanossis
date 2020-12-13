import { Routes } from '@angular/router';
import { CoparticipacoesComponent } from '../coparticipacoes/coparticipacoes.component';

export const CoparticipacoesRoutes: Routes = [
{
  path: '',
  children: [{
    path: '',
    component: CoparticipacoesComponent,
    data: { title: 'Coparticipações', breadcrumb: 'Coparticipações' }
  }]
}
];
