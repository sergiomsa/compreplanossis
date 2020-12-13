import { Routes } from '@angular/router';
import { RedecredenciadaNgxTableComponent } from './redecredenciada-ngx-table/redecredenciada-ngx-table.component';

export const RedecredenciadasRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      component: RedecredenciadaNgxTableComponent,
      data: { title: 'Redecredenciadas', breadcrumb: 'Redecredenciadas' }
    }]
  }
  ];
