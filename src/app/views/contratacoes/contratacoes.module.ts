import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratacoesComponent } from './contratacoes.component';
import { ContratacoesRoutes } from './contratacoes.routing';
import { RouterModule } from '../../../../node_modules/@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContratacaoService } from './contratacao.service';
import { MatDividerModule } from '@angular/material/divider';

import {
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatSelectModule,
  MatCardModule,
  MatRadioModule,
 } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    SharedModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MatCardModule,
    MatDividerModule,
    MatRadioModule,
    RouterModule.forChild(ContratacoesRoutes)
  ],
  declarations: [ContratacoesComponent],
  providers: [ContratacaoService],
})
export class ContratacoesModule { }
