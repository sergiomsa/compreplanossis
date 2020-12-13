import { Routes } from '@angular/router';
import { ProgramaNgxTableComponent } from './programas-ngx-table/programa-ngx-table.component';

export const ProgramasRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      component: ProgramaNgxTableComponent,
      data: { title: 'Programas', breadcrumb: 'Programas' }
    }]
  }
  ];
