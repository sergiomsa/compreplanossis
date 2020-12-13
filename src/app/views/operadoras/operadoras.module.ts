import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperadorasComponent } from './operadoras.component';
import { OperadorasRoutes } from './operadoras.routing';
import { RouterModule } from '../../../../node_modules/@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { OperadoraService } from './operadora.service';
import { MatDividerModule } from '@angular/material/divider';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { ColorPickerModule } from 'ngx-color-picker';
import { registerLocaleData } from '@angular/common';
import { TextMaskModule } from 'angular2-text-mask';
import localept from '@angular/common/locales/pt';
import ptBr from '@angular/common/locales/pt';
registerLocaleData(localept, ptBr)

import {
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatGridListModule,
  MatChipsModule,
  MatCheckboxModule,
  MatRadioModule,
  MatTabsModule,
  MatInputModule,
  MatSelectModule,
  MatTooltipModule,
  MatProgressBarModule
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
    FileUploadModule,
    MatProgressBarModule,
    FormsModule,
    MatTabsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatChipsModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatListModule,
    ColorPickerModule,
    TextMaskModule,
    RouterModule.forChild(OperadorasRoutes)
  ],
  declarations: [OperadorasComponent],
  providers: [OperadoraService, { provide: LOCALE_ID, useValue: "pt" }],
})
export class OperadorasModule { }
