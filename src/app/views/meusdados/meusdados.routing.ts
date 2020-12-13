import { Routes } from '@angular/router';
import { MeusdadosComponent } from 'app/views/meusdados/meusdados.component';

export const MeusdadosRoutes: Routes = [
{
  path: '',
  children: [{
    path: '',
    component: MeusdadosComponent,
    data: { title: 'Meus dados', breadcrumb: 'Meus dados' }
  }]
}
];
