import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule,registerLocaleData } from '@angular/common';
import localept from '@angular/common/locales/pt';
registerLocaleData(localept, 'pt');
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
  MatNativeDateModule,
  MatDialogModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatAutocompleteModule,
  MatGridListModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatRadioModule,
  MatTabsModule,
  MatDatepickerModule,
  MatSliderModule,
  MatRippleModule,
  MatButtonToggleModule
 } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { AdesaocNgxTableComponent } from './adesaoc-ngx-table/adesaoc-ngx-table.component';

import { AdesoescRoutes } from './adesoesc.routing';
import { AdesaocService } from './adesaoc.service';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxTablePopupComponent } from './adesaoc-ngx-table/ngx-table-popup/ngx-table-popup.component';
import { AdesaocFrmComponent } from './adesaoc-ngx-table/adesaoc-frm/adesaoc-frm.component';
import { BeneficiarioFrmComponent } from './adesaoc-ngx-table/beneficiario-frm/beneficiario-frm.component';

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
    MatButtonToggleModule,
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
    MatGridListModule,
    MatDatepickerModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatSliderModule,
    MatRippleModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    TextMaskModule,
    RouterModule.forChild(AdesoescRoutes)
  ],
  declarations: [AdesaocNgxTableComponent, AdesaocFrmComponent, BeneficiarioFrmComponent, NgxTablePopupComponent],
  providers: [AdesaocService,{ provide: LOCALE_ID, useValue: "pt" }],
  entryComponents: [NgxTablePopupComponent]
})
export class AdesoescModule { }
