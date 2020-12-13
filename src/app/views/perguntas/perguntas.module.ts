import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerguntasComponent } from './perguntas.component';
import { PerguntasRoutes } from './perguntas.routing';
import { RouterModule } from '../../../../node_modules/@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContratacaoService } from './pergunta.service';
import { MatDividerModule } from '@angular/material/divider';

import {
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatSelectModule,
  MatCardModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatProgressSpinnerModule,
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
    MatRadioModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(PerguntasRoutes)
  ],
  declarations: [PerguntasComponent],
  providers: [ContratacaoService],
})
export class PerguntasModule { }
