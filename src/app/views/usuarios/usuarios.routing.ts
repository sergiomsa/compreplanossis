import { Routes } from '@angular/router';
import { UsuarioNgxTableComponent } from './usuarios-ngx-table/usuario-ngx-table.component';

export const UsuariosRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      component: UsuarioNgxTableComponent,
      data: { title: 'Usuarios', breadcrumb: 'Usuários' }
    }]
  }
  ];
