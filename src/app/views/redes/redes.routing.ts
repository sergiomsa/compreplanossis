import { Routes } from '@angular/router';
import { RedesComponent } from '../redes/redes.component';

export const RedesRoutes: Routes = [
{
  path: '',
  children: [{
    path: '',
    component: RedesComponent,
    data: { title: 'Redes', breadcrumb: 'Redes' }
  }]
}
];
