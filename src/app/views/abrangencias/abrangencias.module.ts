import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AbrangenciasComponent } from "./abrangencias.component";
import { AbrangenciasRoutes } from "./abrangencias.routing";
import { RouterModule } from "../../../../node_modules/@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedModule } from "../../shared/shared.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { AbrangenciaService } from "./abrangencia.service";
import { MatDividerModule } from "@angular/material/divider";
import { TextMaskModule } from "angular2-text-mask";
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
} from "@angular/material";

import { AreadeatuacaoestadosComponent } from "./areadeatuacaoestados/areadeatuacaoestados.component";
import { AreadeatuacaoestadoService } from "./areadeatuacaoestados/areadeatuacaoestado.service";
import { AreadeatuacaocidadesComponent } from "./areadeatuacaocidades/areadeatuacaocidades.component";
import { AreadeatuacaocidadeService } from "./areadeatuacaocidades/areadeatuacaocidade.service";


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
    TextMaskModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSidenavModule,
    MatExpansionModule,
    MatTabsModule,
    RouterModule.forChild(AbrangenciasRoutes)
  ],
  declarations: [AbrangenciasComponent, AreadeatuacaoestadosComponent, AreadeatuacaocidadesComponent],
  providers: [AbrangenciaService, AreadeatuacaoestadoService, AreadeatuacaocidadeService],
})
export class AbrangenciasModule {}
