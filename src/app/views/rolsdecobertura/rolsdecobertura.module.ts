import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolsdecoberturaComponent } from './rolsdecobertura.component';
import { RolsdecoberturaRoutes } from './rolsdecobertura.routing';
import { RouterModule } from '../../../../node_modules/@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RoldecoberturaService } from './roldecobertura.service';
import { MatDividerModule } from '@angular/material/divider';

import {
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatSelectModule,
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
    RouterModule.forChild(RolsdecoberturaRoutes)
  ],
  declarations: [RolsdecoberturaComponent],
  providers: [RoldecoberturaService],
})
export class RolsdecoberturaModule { }
