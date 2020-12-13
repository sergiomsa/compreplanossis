import { Routes } from '@angular/router';
import { TiposdeplanoComponent } from '../tiposdeplano/tiposdeplano.component';

export const TiposdeplanoRoutes: Routes = [
{
  path: '',
  children: [{
    path: '',
    component: TiposdeplanoComponent,
    data: { title: 'Tipos de plano', breadcrumb: 'Tipos de plano' }
  }]
}
];
