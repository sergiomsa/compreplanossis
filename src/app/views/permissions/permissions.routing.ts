import { Routes } from '@angular/router';
import { PermissionNgxTableComponent } from './permissions-ngx-table/permission-ngx-table.component';

export const PermissionsRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      component: PermissionNgxTableComponent,
      data: { title: 'Permissoes', breadcrumb: 'Permissões' }
    }]
  }
  ];
