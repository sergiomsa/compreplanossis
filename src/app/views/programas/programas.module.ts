import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatIconModule,
  MatCardModule,
  MatMenuModule,
  MatButtonModule,
  MatChipsModule,
  MatListModule,
  MatSelectModule,
  MatTooltipModule,
  MatDialogModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatRadioModule,
  MatTabsModule,
  MatSliderModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRippleModule

 } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { ProgramaNgxTableComponent } from './programas-ngx-table/programa-ngx-table.component';

import { ProgramasRoutes } from './programas.routing';
import { ProgramaService } from './programa.service';
import { NgxTablePopupComponent } from './programas-ngx-table/ngx-table-popup/ngx-table-popup.component';
import { TextMaskModule } from 'angular2-text-mask';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxDatatableModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatChipsModule,
    MatSelectModule,
    MatListModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    SharedModule,
    MatSidenavModule,
    MatExpansionModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatSliderModule,
    MatRippleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TextMaskModule,
    RouterModule.forChild(ProgramasRoutes)
  ],
  declarations: [ProgramaNgxTableComponent, NgxTablePopupComponent],
  providers:
  [ProgramaService],

  entryComponents: [NgxTablePopupComponent],

})
export class ProgramasModule { }
