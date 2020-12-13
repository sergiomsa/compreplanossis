import { Routes } from '@angular/router';
import { CorretorasComponent } from '../corretoras/corretoras.component';

export const CorretorasRoutes: Routes = [
{
  path: '',
  children: [{
    path: '',
    component: CorretorasComponent,
    data: { title: 'Corretoras', breadcrumb: 'Corretoras' }
  }]
}
];
