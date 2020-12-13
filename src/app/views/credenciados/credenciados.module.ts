import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CredenciadosComponent } from "./credenciados.component";
import { CredenciadosRoutes } from "./credenciados.routing";
import { RouterModule } from "../../../../node_modules/@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedModule } from "../../shared/shared.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { CredenciadoService } from "./credenciado.service";
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
  MatRadioModule
} from "@angular/material";

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
    RouterModule.forChild(CredenciadosRoutes)
  ],
  declarations: [CredenciadosComponent],
  providers: [CredenciadoService]
})
export class CredenciadosModule {}
