import { NgModule, LOCALE_ID } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PlanosComponent } from "./planos.component";
import { PlanosRoutes } from "./planos.routing";
import { RouterModule } from "../../../../node_modules/@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedModule } from "../../shared/shared.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { PlanoService } from "./plano.service";
import { MatDividerModule } from "@angular/material/divider";
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { TextMaskModule } from "angular2-text-mask";
import { ColorPickerModule } from 'ngx-color-picker';
import { registerLocaleData } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import localept from '@angular/common/locales/pt';
import ptBr from '@angular/common/locales/pt';
registerLocaleData(localept, ptBr)

import {
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatSelectModule, 
  MatTooltipModule,
  MatCardModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatExpansionModule,
  MatRadioModule,
  MatTabsModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatProgressBarModule,
} from "@angular/material";
import { PlanoxfaixasetariasComponent } from "./planoxfaixasetarias/planoxfaixasetarias.component";
import { PlanoxprocedimentosComponent } from "./planoxprocedimentos/planoxprocedimentos.component";
import { PlanoxcarenciasComponent } from "./planoxcarencias/planoxcarencias.component";
import { PlanoxecarenciasComponent } from "./planoxecarencias/planoxecarencias.component";
import { PlanoxcoparticipacoesComponent } from "./planoxcoparticipacoes/planoxcoparticipacoes.component";
import { PlanoxfaixaetariaService } from "./planoxfaixasetarias/planoxfaixaetaria.service";
import { PlanoxprocedimentoService } from "./planoxprocedimentos/planoxprocedimento.service";
import { PlanoxcarenciaService } from "./planoxcarencias/planoxcarencia.service";
import { PlanoxecarenciaService } from "./planoxecarencias/planoxecarencia.service";
import { PlanoxcoparticipacaoService } from "./planoxcoparticipacoes/planoxcoparticipacao.service";
import { PlanoxdocumentosService } from "./planoxdocumentos/planoxdocumentos.service";
import { PlanoxdocumentosComponent } from "./planoxdocumentos/planoxdocumentos.component";
import { PlanoxabrangenciasComponent } from "./planoxabrangencias/planoxabrangencias.component";
import { PlanoxabrangenciaService } from "./planoxabrangencias/planoxabrangencia.service";
import { PlanoxitensComponent } from "./planoxitens/planoxitens.component";
import { PlanoxitemService } from "./planoxitens/planoxitem.service";
import { PlanoxvigenciasComponent } from "./planoxvigencias/planoxvigencias.component";
import { PlanoxvigenciaService } from "./planoxvigencias/planoxvigencia.service";

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
    TextMaskModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSidenavModule,
    MatExpansionModule,
    FormsModule,
    MatTabsModule,
    MatSliderModule,
    MatSlideToggleModule,
    ColorPickerModule,
    QuillModule,
    MatProgressBarModule,
    RouterModule.forChild(PlanosRoutes)
  ],
  declarations: [PlanosComponent, 
                 PlanoxfaixasetariasComponent,
                 PlanoxcarenciasComponent,
                 PlanoxecarenciasComponent,
                 PlanoxcoparticipacoesComponent, 
                 PlanoxprocedimentosComponent, 
                 PlanoxdocumentosComponent,
                 PlanoxabrangenciasComponent,
                 PlanoxvigenciasComponent,
				         PlanoxitensComponent
  ],
  providers: [PlanoService, 
              PlanoxfaixaetariaService,
              PlanoxprocedimentoService, 
              PlanoxcarenciaService,
              PlanoxecarenciaService,
              PlanoxcoparticipacaoService, 
              PlanoxdocumentosService, 
              PlanoxabrangenciaService,
              PlanoxvigenciaService,
			        PlanoxitemService,
              { provide: LOCALE_ID, useValue: "pt" }
  ],
})
export class PlanosModule {}
