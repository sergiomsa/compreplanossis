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
import { RedecredenciadaNgxTableComponent } from './redecredenciada-ngx-table/redecredenciada-ngx-table.component';
import { RedecredenciadasRoutes } from './redecredenciadas.routing';
import { RedecredenciadaService } from './redecredenciada.service';
import { TextMaskModule } from 'angular2-text-mask';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

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
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCxqgKqZMHNzOV2TETOwjRJAUpuh3aeK1c'
    }),
    AgmJsMarkerClustererModule,
    RouterModule.forChild(RedecredenciadasRoutes)
  ],
  declarations: [RedecredenciadaNgxTableComponent],
  providers: [RedecredenciadaService,{ provide: LOCALE_ID, useValue: "pt" }],
  entryComponents: []
})
export class RedecredenciadasModule { }
