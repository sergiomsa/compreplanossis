import { Routes } from '@angular/router';
import { PedidoNgxTableComponent } from './pedido-ngx-table/pedido-ngx-table.component';

export const PedidosRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      component: PedidoNgxTableComponent,
      data: { title: 'Pedidos', breadcrumb: 'Pedidos' }
    }]
  }
  ];
