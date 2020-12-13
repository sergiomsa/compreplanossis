import { Routes } from '@angular/router';
import { ProcedimentosComponent } from '../procedimentos/procedimentos.component';

export const ProcedimentosRoutes: Routes = [
{
  path: '',
  children: [{
    path: '',
    component: ProcedimentosComponent,
    data: { title: 'Procedimentos', breadcrumb: 'Procedimentos' }
  }]
}
];
