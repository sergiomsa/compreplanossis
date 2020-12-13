import { Component, OnInit, ViewChild} from '@angular/core';
import { AdesaoService } from '../adesao.service';
import { MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AuthService as AuthGuard }          from "../../../shared/services/auth/auth.service";
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-adesao-ngx-table',
  templateUrl: './adesao-ngx-table.component.html',
  styleUrls: ['./adesao-ngx-table.component.css'],
  animations: egretAnimations,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class AdesaoNgxTableComponent implements OnInit {

  @ViewChild('TableAdesao') TableAdesao: any;

  public adesoes: any = [];
  public isSideNavOpen: boolean;
  public filterForm: FormGroup;
  public filter1Form: FormGroup;
  public minDate = new Date(2000, 0, 1);
  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;
  public datainicio: any;
  public datafim: any;
  public ExcluirAdesao: boolean;
  public BaixarContratoAdesao: boolean;
  public EnviarEmailContratoAdesao: boolean;
  public messages = { emptyMessage: 'Nenhum registro', loadingMessage: 'Carregando', totalMessage: 'registro(s)', selectedMessage: 'selecionado(s)' };

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private adesaoService: AdesaoService,
    private loader: AppLoaderService,
    private confirmService: AppConfirmService,
    public AuthGuard: AuthGuard,
  ) { }

  ngOnInit() {

    this.page_totalElements       = 0;
    this.page_pageNumber          = 0;
    this.page_size                = 10;
    this.datainicio               = '2018-08-01';
    this.datafim                  = '2999-12-31';

    this.filter1Form              = new FormGroup({
      origem:                     new FormControl('', [Validators.required]),
      status:                     new FormControl('', [Validators.required]),
      datainicio:                 new FormControl(this.datainicio, [Validators.required, CustomValidators.date]),
      datafim:                    new FormControl(this.datafim, [Validators.required, CustomValidators.date]),
    });


    this.filter1Form.patchValue({ status: '99' });
    this.filter1Form.patchValue({ origem: '99' });

    this.filterForm             = new FormGroup({
      pesquisarpor:               new FormControl('', [Validators.required]),
      search:                     new FormControl()
    });

    this.filterForm.patchValue({ pesquisarpor: '' });
    this.ExcluirAdesao		      = this.AuthGuard.getPermissao("ExcluirAdesao");
    this.BaixarContratoAdesao		    = this.AuthGuard.getPermissao("BaixarContratoAdesao");
    this.EnviarEmailContratoAdesao	= this.AuthGuard.getPermissao("EnviarEmailContratoAdesao");
  }

  paginacao(pageInfo) {
    this.pesquisarAdesoes(pageInfo.offset);
  }

  toggleSideNav() {
    this.isSideNavOpen = !this.isSideNavOpen;
  }

  pesquisarAdesoes(offset = 0) 
  {
    offset = offset + 1;
   
    //this.loader.open();
    const pesquisa = {
      campo: this.filterForm.value.pesquisarpor,
      conteudo: this.filterForm.value.search,
      origem: this.filter1Form.value.origem,
      status: this.filter1Form.value.status,
      payment_method: this.filter1Form.value.payment_method,
      datainicio: this.formatarData(this.filter1Form.value.datainicio),
      datafim: this.formatarData(this.filter1Form.value.datafim),
      pagina: offset,
    }

    this.adesaoService.pesquisarAdesoes(pesquisa)
      .subscribe(response => {
        this.adesoes            = response.data;
        this.page_totalElements = response.total;
        //this.loader.close();
        if (this.adesoes.length === 0) {
          this.snack.open('Não existe adesoes com a pesquisa escolhida!', 'OK', { duration: 4000 });
        } else {
          this.isSideNavOpen = false;
        }
      });
  }

  exportarAdesoes() 
  {
    this.loader.open();
    const pesquisa = {
      campo: this.filterForm.value.pesquisarpor,
      conteudo: this.filterForm.value.search,
      status: this.filter1Form.value.status,
      origem: this.filter1Form.value.origem,
      payment_method: this.filter1Form.value.payment_method,
      datainicio: this.formatarData(this.filter1Form.value.datainicio),
      datafim: this.formatarData(this.filter1Form.value.datafim),
    }

    this.adesaoService.exportarAdesoes(pesquisa)
        .subscribe(response=> {
       let blob 	= new Blob([response], {type: 'application/vnd.ms-office'});
       this.loader.close();
         FileSaver.saveAs(blob, 'adesoes.xls');
       });
  }

  toggleExpandRow(row) {
    this.TableAdesao.rowDetail.toggleExpandRow(row);
  }
  
  onDetailToggle(event) {
    
  }

  formatarData(data) {

    let datav = data;
    let dataa = [];

    if ((typeof datav === 'string') && (datav.indexOf('-'))) {
      dataa = datav.split('-');
      datav = dataa[2] + '/' + dataa[1] + '/' + dataa[0];
    } else {
      if ((typeof datav === 'string') && (datav.indexOf('/'))) {
      } else {
        try {
          datav = datav.format('DD/MM/YYYY');
        } catch (e) {
          let day = datav && datav.getDate() || -1;
          let dayWithZero = day.toString().length > 1 ? day : '0' + day;
          let month = datav && datav.getMonth() + 1 || -1;
          let monthWithZero = month.toString().length > 1 ? month : '0' + month;
          let year = datav && datav.getFullYear() || -1;
          datav = dayWithZero + '/' + monthWithZero + '/' + year;
        }
      }
    }

    return datav;

  }

  downloadContrato(id) {
    this.loader.open();
    this.adesaoService.downloadContrato(id)
    .subscribe(response => {
      let blob 	= new Blob([response], {type: 'application/octet-stream'});
      this.loader.close();
      FileSaver.saveAs(blob, 'contrato.zip');
    },
    error => {
      this.loader.close();
      this.snack.open(error.error.id[0], 'OK', { duration: 6000 });
    });
  }

  emailContrato(id) {
    this.loader.open();
    this.adesaoService.emailContrato(id)
    .subscribe(response => {
      this.loader.close();
    });
  }

  pdfContrato(id) {
    this.loader.open();
    this.adesaoService.pdfContrato(id)
    .subscribe(response => {
      this.loader.close();
    });
  }

  removerAdesao(row) {
    this.confirmService.confirm({message: `Confirme a exclusao da adesão nº ${row.id}? - Atenção esta ação é irreversível !`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.adesaoService.removerAdesao(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Adesão excluida!', 'OK', { duration: 4000 });
              this.paginacao({ offset: this.pagina });
            },
            error => {
              this.loader.close();
              this.snack.open(error.error.id[0], 'OK', { duration: 6000 });
            }
          );
        }
      });
  }

}