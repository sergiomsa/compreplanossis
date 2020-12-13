import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaixasetariasComponent } from './faixasetarias.component';
import { FaixasetariasRoutes } from './faixasetarias.routing';
import { RouterModule } from '../../../../node_modules/@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FaixaetariaService } from './faixaetaria.service';
import { MatDividerModule } from '@angular/material/divider';

import {
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatSelectModule,
  MatTooltipModule,
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
    RouterModule.forChild(FaixasetariasRoutes)
  ],
  declarations: [FaixasetariasComponent],
  providers: [FaixaetariaService],
})
export class FaixasetariasModule { }
