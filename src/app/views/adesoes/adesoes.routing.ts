import { Routes } from '@angular/router';
import { AdesaoNgxTableComponent } from './adesao-ngx-table/adesao-ngx-table.component';

export const AdesoesRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      component: AdesaoNgxTableComponent,
      data: { title: 'Adesoes', breadcrumb: 'Adesoes' }
    }]
  }
  ];
