import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedesComponent } from './redes.component';
import { RedesRoutes } from './redes.routing';
import { RouterModule } from '../../../../node_modules/@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RedeService } from './rede.service';
import {MatDividerModule} from '@angular/material/divider';

import {
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatSelectModule,
  MatCardModule,
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
    RouterModule.forChild(RedesRoutes)
  ],
  declarations: [RedesComponent],
  providers: [RedeService],
})
export class RedesModule { }
