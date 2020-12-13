import { Component, OnInit, ViewChild } from '@angular/core';
import { RedecredenciadaService } from '../redecredenciada.service';
import {
  MatSnackBar
} from '@angular/material';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-redecredenciada-ngx-table',
  templateUrl: './redecredenciada-ngx-table.component.html',
  styleUrls: ['./redecredenciada-ngx-table.component.css'],
  animations: egretAnimations
})
export class RedecredenciadaNgxTableComponent implements OnInit {

  @ViewChild('TableConveniado') TableConveniado: any;
  public isSideNavOpen: boolean;
  public filterForm: FormGroup;
  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;
  public credenciados: any = [];
  public estados: any = [];
  public cidades: any = [];
  public lat: number = 0;
  public lng: number = 0;
  public zoom: number = 12;
  public viewMode: string = 'list-view';
  public temp: any = [];
  public messages = { emptyMessage: 'Nenhum registro', loadingMessage: 'Carregando', totalMessage: 'registro(s)', selectedMessage: 'selecionado(s)' };

  constructor(
    private snack: MatSnackBar,
    private redecredenciadaService: RedecredenciadaService,
    private loader: AppLoaderService,
  ) { }

  ngOnInit() {

    this.isSideNavOpen = true;
    this.page_totalElements = 0;
    this.page_pageNumber = 0;
    this.page_size = 5;

    this.filterForm = new FormGroup({
      estado: new FormControl('', [Validators.required]),
      cidade: new FormControl('', [Validators.required]),
      tipo: new FormControl('', [Validators.required]),
      distancia: new FormControl('', [Validators.required]),
      search: new FormControl(),
      especialidade: new FormControl()
    });

    this.filterForm.patchValue({ estado: 'MG' });
    this.filterForm.patchValue({ cidade: 'todas' });
    this.filterForm.patchValue({ tipo: '0' });
    this.filterForm.patchValue({ distancia: 999 });
    this.filterForm.patchValue({ especialidade: '' });

    this.redecredenciadaService.estados()
      .subscribe(data => {
        this.estados = data;
        this.filterForm.patchValue({ estado: data[0].sigla });
        this.getEstado();
      });
  }

  ngAfterViewInit() {
    this.subscribeCurrentPosition();
  }

  toggleSideNav() {
    this.isSideNavOpen = !this.isSideNavOpen;
  }

  getEstado() {

    this.redecredenciadaService.cidades(this.filterForm.value.estado)
      .subscribe(
        data => {
          this.cidades = data;
          this.getRede();
        });

  }

  getRede() {

    const param = {
      latitude: this.lat,
      longitude: this.lng,
      distancia: this.filterForm.value.distancia,
      estado: this.filterForm.value.estado,
      cidade: this.filterForm.value.cidade,
      tipo_id: this.filterForm.value.tipo,
      especialidade: "",
    }

    this.redecredenciadaService.conveniados(param)
      .subscribe(
        data => {
          //this.lat = +data[0].latitude;
          //this.lng = +data[0].longitude;
          this.temp = [...data];
          this.credenciados = data;
          if (this.credenciados.length === 0) 
          {
            // tslint:disable-next-line:one-line
            /* retorna uma mensagem na tela */
            this.snack.open('Não existe credenciado com a pesquisa escolhida!', 'OK', {duration: 4000});
          }
        });
  }

  getDistancia(event) 
  {
    this.getRede();
  }

  updateFilterCredenciados(event) 
  {
	this.filterForm.patchValue({ especialidade: '' });
    const search = this.filterForm.value.search.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.razaosocial.toLowerCase().indexOf(search) !== -1 || !search;
    });

    // update the rows
    this.credenciados = temp;
    // Whenever the filter changes, always go back to the first page
  }
  
  updateFilterEspecialidades(event) 
  {
	this.filterForm.patchValue({ search: '' });
    const search = this.filterForm.value.especialidade.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.lespecialidade.toLowerCase().indexOf(search) !== -1 || !search;
    });

    // update the rows
    this.credenciados = temp;
    // Whenever the filter changes, always go back to the first page
  }

  subscribeCurrentPosition() {

    if (window.navigator.geolocation) {
      window.navigator.geolocation.watchPosition(
        (position) => {
          if (this.lat == 0) {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.redecredenciadaService.getEndereco(this.lat, this.lng)
              .subscribe(
                data => {
                  if (data.cidade != "") {
                    this.filterForm.patchValue({ estado: data.estado });
                    this.filterForm.patchValue({ cidade: data.cidade });
                    this.getRede();
                  }
                });
          }
        });
    }
  }

  public getRowDetailsHeight = (row) => {
    if (row) {
      return row.height;
    }
    return 0;
  }

  toggleExpandRow(row) {
    this.TableConveniado.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {

  }

  mapClicked(event) {
    console.log(event)
  }

  clickedMarker(conveniado) {
    /*
    this.filterForm.patchValue({ search: conveniado.razaosocial });
    const val =  conveniado.razaosocial.toLowerCase();
    
    const temp = this.temp.filter(function (d) {
      return d.razaosocial.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.credenciados = temp;
    this.viewMode     = 'list-view';
    */
  }

}