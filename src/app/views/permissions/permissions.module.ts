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
import { PermissionNgxTableComponent } from './permissions-ngx-table/permission-ngx-table.component';

import { PermissionsRoutes } from './permissions.routing';
import { PermissionService } from './permission.service';
import { NgxTablePopupComponent } from './permissions-ngx-table/ngx-table-popup/ngx-table-popup.component';
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
    RouterModule.forChild(PermissionsRoutes)
  ],
  declarations: [PermissionNgxTableComponent, NgxTablePopupComponent],
  providers:
  [PermissionService],

  entryComponents: [NgxTablePopupComponent],

})
export class PermissionsModule { }
