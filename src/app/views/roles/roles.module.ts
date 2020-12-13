import { NgModule } from '@angular/core';
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
  MatRippleModule

 } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { RoleNgxTableComponent } from './roles-ngx-table/role-ngx-table.component';

import { RolesRoutes } from './roles.routing';
import { RoleService } from './role.service';
import { NgxTablePopupComponent } from './roles-ngx-table/ngx-table-popup/ngx-table-popup.component';
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
    TextMaskModule,
    RouterModule.forChild(RolesRoutes)
  ],
  declarations: [RoleNgxTableComponent, NgxTablePopupComponent],
  providers: [RoleService],
  entryComponents: [NgxTablePopupComponent]
})
export class RolesModule { }
