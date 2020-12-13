import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService as AuthGuard } from '../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../shared/services/app-loader/app-loader.service';
import { DashboardService } from './dashboard.service';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  highcharts    = Highcharts;
  chartOptions  = {};
  categories: any;
  series: any;
  mostrar       = false;
  grafico       = true;
  yaxis_title   = "Qtde de vidas";
  public filterForm: FormGroup;

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private dashboardService: DashboardService,
    private confirmService: AppConfirmService

  ) { }

  ngOnInit() {

    this.filterForm = new FormGroup({
      agruparpor:       new FormControl('S', [Validators.required]),
      tipodeplano:      new FormControl('0', [Validators.required]),
      abrangencia:      new FormControl('0', [Validators.required]),
      mostrar:          new FormControl('Q', [Validators.required]),
      retroagir:        new FormControl(5, [Validators.required]),
    });

    this.obterResumo(true);
  }

  obterResumoFixa()
  {
    this.obterResumo(this.grafico);
  }

  obterResumo(value)
  {
    
    this.grafico  = value;

    if (this.filterForm.value.mostrar == 'Q')
    {
      this.yaxis_title        = 'Qtde de vidas';
    } else {
      this.yaxis_title        = "Valor do plano";
    }

    this.mostrar = false;
    this.dashboardService.obterResumo(this.filterForm.value)
          .subscribe(resumo => {
            this.categories   = resumo.categories;
            this.series       = resumo.lseries;
            this.chartOptions = {
              chart: {
                type: "spline"
              },
              title: {
                text: "Vendas de planos"
              },
          
              xAxis: {
                categories: resumo.categories
              },
          
              yAxis: {
                title: {
                  text: this.yaxis_title
                }
              },
          
              legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
              },
          
              plotOptions: {
                line: {
                  dataLabels: {
                    enabled: true
                  },
                  enableMouseTracking: true
                },
                series: {
                  label: {
                    connectorAllowed: false
                  },
                }
              },
              series: resumo.series
            };   
            this.mostrar = true;     
    });
  }

  ngOnDestroy() { }
}