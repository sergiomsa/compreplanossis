import { Routes } from '@angular/router';
import { ModuloNgxTableComponent } from './modulo-ngx-table/modulo-ngx-table.component';

export const ModulosRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      component: ModuloNgxTableComponent,
      data: { title: 'Modulos', breadcrumb: 'Modulos' }
    }]
  }
  ];
