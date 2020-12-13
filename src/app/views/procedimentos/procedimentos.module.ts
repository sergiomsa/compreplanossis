import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcedimentosComponent } from './procedimentos.component';
import { ProcedimentosRoutes } from './procedimentos.routing';
import { RouterModule } from '../../../../node_modules/@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProcedimentoService } from './procedimento.service';
import { MatDividerModule } from '@angular/material/divider';

import {
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatSelectModule,
  MatTooltipModule,
  MatSlideToggleModule,
  MatCardModule,
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
    MatTooltipModule,
    MatSlideToggleModule,
    RouterModule.forChild(ProcedimentosRoutes)
  ],
  declarations: [ProcedimentosComponent],
  providers: [ProcedimentoService],
})
export class ProcedimentosModule { }
