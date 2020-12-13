import { Routes } from '@angular/router';
import { PerguntasComponent } from '../perguntas/perguntas.component';

export const PerguntasRoutes: Routes = [
{
  path: '',
  children: [{
    path: '',
    component: PerguntasComponent,
    data: { title: 'Perguntas', breadcrumb: 'Perguntas' }
  }]
}
];
