import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  MatProgressBarModule
 } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { SharedModule } from '../../shared/shared.module';

import { MeusdadosComponent } from "./meusdados.component";
import { MeusdadosRoutes } from "./meusdados.routing";

import { TextMaskModule } from '../../../../node_modules/angular2-text-mask';
import { MeusdadosService } from './meusdados.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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
    MatProgressBarModule,
    FlexLayoutModule,
    ChartsModule,
    FileUploadModule,
    SharedModule,
    TextMaskModule,
    ReactiveFormsModule,
    RouterModule.forChild(MeusdadosRoutes)
  ],
  declarations: [MeusdadosComponent],
  providers: [MeusdadosService],
  entryComponents: [MeusdadosComponent]
})
export class MeusdadosModule { }
