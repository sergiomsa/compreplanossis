import { Routes } from '@angular/router';
import { RoleNgxTableComponent } from './roles-ngx-table/role-ngx-table.component';

export const RolesRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      component: RoleNgxTableComponent,
      data: { title: 'Papeis', breadcrumb: 'Papéis' }
    }]
  }
  ];
