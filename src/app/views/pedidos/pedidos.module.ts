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
  MatRippleModule

 } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { PedidoNgxTableComponent } from './pedido-ngx-table/pedido-ngx-table.component';

import { PedidosRoutes } from './pedidos.routing';
import { PedidoService } from './pedido.service';
import { TextMaskModule } from 'angular2-text-mask';
import { BoletoPopupComponent } from './pedido-ngx-table/boleto-popup/boleto-popup.component';

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
    RouterModule.forChild(PedidosRoutes)
  ],
  declarations: [PedidoNgxTableComponent, BoletoPopupComponent],
  providers: [PedidoService,{ provide: LOCALE_ID, useValue: "pt" }],
  entryComponents: [BoletoPopupComponent]
})
export class PedidosModule { }
