import { Routes } from '@angular/router';
import { AdesaocNgxTableComponent } from './adesaoc-ngx-table/adesaoc-ngx-table.component';

export const AdesoescRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      component: AdesaocNgxTableComponent,
      data: { title: 'Gerir Adesões', breadcrumb: 'Gerir Adesões' }
    }]
  }
  ];
