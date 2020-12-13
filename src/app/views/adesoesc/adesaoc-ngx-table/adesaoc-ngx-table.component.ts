import { Component, OnInit, ViewChild , Input} from '@angular/core';
import { AdesaocService } from '../adesaoc.service';
import { MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AuthService as AuthGuard }          from "../../../shared/services/auth/auth.service";
import { NgxTablePopupComponent } from './ngx-table-popup/ngx-table-popup.component';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { AdesaocFrmComponent } from './adesaoc-frm/adesaoc-frm.component';
import { BeneficiarioFrmComponent } from './beneficiario-frm/beneficiario-frm.component';

@Component({
  selector: 'app-adesaoc-ngx-table',
  templateUrl: './adesaoc-ngx-table.component.html',
  styleUrls: ['./adesaoc-ngx-table.component.css'],
  animations: egretAnimations,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class AdesaocNgxTableComponent implements OnInit {

  @ViewChild("AdesaocFrm")  AdesaocFrm: AdesaocFrmComponent;
  @ViewChild("BeneficiarioFrm")  BeneficiarioFrm: BeneficiarioFrmComponent;
  @ViewChild('TableAdesao') TableAdesao: any;
  @Input()selectedIndex: number;
  @Input()gselectedIndex: number
 
  public valueChangeAdesao: any;
  public adesoes: any = [];
  public tiposdeplano: any = [];
  public integracoes: any = [];
  public adesao: any = [];
  public beneficiario: any = [];
  public beneficiario_id: number;
  public beneficiarios: any = [];
  public documento: any = [];
  public selectedAdesao: any = [];
  public selectedDadosMedicos: any = [];
  public filterForm: FormGroup;
  public formulario: boolean = false;
  public listar: boolean = true;
  public minDate = new Date(2000, 0, 1);
  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;
  public datainicio: any;
  public datafim: any;
  public orderby = 'id';
  public direction = 'desc'
  public selectedVal: string;
  public id: any;
  public alteradoBeneficiario: boolean = false;
  public maskcep        = [ /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/ ];
  public maskcpf        = [ /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public masktelefone   = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskcelular    = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskhora       = [/\d/, /\d/, ':', /\d/, /\d/];
  public titulo    = "";
  public messages = { emptyMessage: 'Nenhum registro', loadingMessage: 'Carregando', totalMessage: 'registro(s)', selectedMessage: 'selecionado(s)' };
  
  public ListarAdesoesRegistrada: boolean;
  public ListarAdesoesPendente: boolean;
  public ListarAdesoesConfirmada: boolean;
  public ListarAdesoesNpreaprovada: boolean;
  public ListarAdesoesNaprovada: boolean;
  public ListarAdesoesDocumentacao: boolean;
  public ListarAdesoesPreaprovada: boolean;
  public ListarAdesoesCancelada: boolean;
  public ListarAdesoesDadosMedicos: boolean;
  public ListarAdesoesAprovada: boolean;
  public ListarAdesoesImplantadas: boolean;
  public ListarAdesoesRejeitada: boolean;
  public ExcluirAdesao: boolean;
  public BaixarContratoAdesao: boolean;
  public ImplantarAdesao: boolean;
  public EnviarEmailContratoAdesao: boolean;
  public PreAprovarAdesao: boolean;
  public AprovarAdesao: boolean;
  
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private AdesaocService: AdesaocService,
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
    
    this.filterForm             = new FormGroup({
      pesquisarpor:               new FormControl(),
      search:                     new FormControl("",[Validators.required]),
      csituacao:                  new FormControl("",[Validators.required]),
      tipodeplano_id:             new FormControl("",[Validators.required]),
      integracao_id:              new FormControl(0),
      datainicio:                 new FormControl(this.datainicio, [Validators.required, CustomValidators.date]),
      datafim:                    new FormControl(this.datafim, [Validators.required, CustomValidators.date]),
    });

    this.filterForm.patchValue({ pesquisarpor: '' });
    this.filterForm.get('search').clearValidators();

    this.ListarAdesoesRegistrada		= this.AuthGuard.getPermissao("ListarAdesoesRegistrada");
    this.ListarAdesoesPendente		  = this.AuthGuard.getPermissao("ListarAdesoesPendente");
    this.ListarAdesoesConfirmada		= this.AuthGuard.getPermissao("ListarAdesoesConfirmada");
    this.ListarAdesoesNpreaprovada	= this.AuthGuard.getPermissao("ListarAdesoesNpreaprovada");
    this.ListarAdesoesNaprovada	    = this.AuthGuard.getPermissao("ListarAdesoesNaprovada");
    this.ListarAdesoesDocumentacao	= this.AuthGuard.getPermissao("ListarAdesoesDocumentacao");
    this.ListarAdesoesPreaprovada		= this.AuthGuard.getPermissao("ListarAdesoesPreaprovada");
    this.ListarAdesoesCancelada		  = this.AuthGuard.getPermissao("ListarAdesoesCancelada");
    this.ListarAdesoesDadosMedicos	= this.AuthGuard.getPermissao("ListarAdesoesDadosMedicos");
    this.ListarAdesoesAprovada		  = this.AuthGuard.getPermissao("ListarAdesoesAprovada");
    this.ListarAdesoesImplantadas	  = this.AuthGuard.getPermissao("ListarAdesoesImplantadas")
    this.ListarAdesoesRejeitada		  = this.AuthGuard.getPermissao("ListarAdesoesRejeitada");
    this.ExcluirAdesao		          = this.AuthGuard.getPermissao("ExcluirAdesao");
    this.ImplantarAdesao		        = this.AuthGuard.getPermissao("ImplantarAdesao");
    this.EnviarEmailContratoAdesao	= this.AuthGuard.getPermissao("EnviarEmailContratoAdesao");
    this.BaixarContratoAdesao	      = this.AuthGuard.getPermissao("BaixarContratoAdesao");
    this.PreAprovarAdesao		        = this.AuthGuard.getPermissao("PreAprovarAdesao");
    this.AprovarAdesao		          = this.AuthGuard.getPermissao("AprovarAdesao");

    this.AdesaocService.obterPerfil()
    .subscribe(response => {
      this.tiposdeplano             = response.tiposdeplano;
      this.integracoes              = response.integracoes;
      this.filterForm.patchValue({ tipodeplano_id:  response.tiposdeplano[0].id });
    });
  
  }

  selectionType()
  {
    if ((this.filterForm.value.csituacao == 'C' || this.filterForm.value.csituacao == 'P' || this.filterForm.value.csituacao == 'A'))
    {
      return 'checkbox';
    } else {
      return 'single';
    }

  }

  podePreaprovar()
  {
    if (this.adesao.csituacao == 'C' || this.adesao.csituacao == 'D')
    {
      return true;
    }

    return false;

  }

  podeAprovar()
  {
    if (this.adesao.csituacao == 'P' || this.adesao.csituacao == 'E' || this.adesao.csituacao == 'M' || this.adesao.csituacao == 'X')
    {
      return true;
    }

    return false;
    
  }

  changePesquisarPor(pesquisarpor)
  {
    
    this.filterForm.get('datainicio').clearValidators();
    this.filterForm.get('datafim').clearValidators();
    this.filterForm.get('csituacao').clearValidators();
    this.filterForm.get('search').clearValidators();
    this.filterForm.patchValue({ search: '' });
    
    switch (pesquisarpor.value) {
      case '': 
      {
        this.filterForm.get('datainicio').setValidators([Validators.required]);
        this.filterForm.get('datafim').setValidators([Validators.required]);
        this.filterForm.get('csituacao').setValidators([Validators.required]);
        break;
      }
      case 'id': 
        this.titulo               = 'NºAdesão';
        this.filterForm.get('search').setValidators([Validators.required]);
        break;
      case 'vendedor': 
        this.titulo               = 'Vendedor';
        this.filterForm.get('datainicio').setValidators([Validators.required]);
        this.filterForm.get('datafim').setValidators([Validators.required]);
        this.filterForm.get('csituacao').setValidators([Validators.required]);
        this.filterForm.get('search').setValidators([Validators.required]);
        break;
      case 'corretora': 
      {
        this.titulo               = 'Corretora';
        this.filterForm.get('datainicio').setValidators([Validators.required]);
        this.filterForm.get('datafim').setValidators([Validators.required]);
        this.filterForm.get('csituacao').setValidators([Validators.required]);
        this.filterForm.get('search').setValidators([Validators.required]);
        break;
      }
    }

    this.filterForm.get('datainicio').updateValueAndValidity();
    this.filterForm.get('datafim').updateValueAndValidity();
    this.filterForm.get('csituacao').updateValueAndValidity();
    this.filterForm.get('search').updateValueAndValidity();
   
  }

  clearAdesao() {
    this.adesoes = {};
  }

  onOrdenar(event)
  {
    this.pagina     = 1;
    this.orderby    = event.column.prop;
    this.direction  = event.newValue;
    this.pesquisarAdesoes();
  }

  paginacao(pageInfo) {
    this.pesquisarAdesoes(pageInfo.offset);
  }

  preaprovarAdesao()
  {
    var adesoess = [];
    
    this.selectedAdesao.forEach(function(adesao) {
      adesoess.push(adesao.id);
    }); 

    let form  =  {
      adesoes: adesoess
    }

    this.loader.open();

    this.AdesaocService.preaprovarAdesaoMassa(form)
    .subscribe(data => {
              this.loader.close();
              this.snack.open('Adesão revisada com sucesso!', 'OK', { duration: 4000 });
              this.refreshAdesoes();
          },
          (error => {
             this.loader.close();
             let message = '';
             if (error.error)
             {
                  for (const k in error.error)
                  message += error.error[k] + ' | ';
             }
             this.snack.open(message, 'OK', { duration: 6000 });
        })
     );
  }

  aprovarAdesao()
  {

    var adesoess = [];
    
    this.selectedAdesao.forEach(function(adesao) {
      adesoess.push(adesao.id);
    }); 

    let form  =  {
      adesoes: adesoess
    }

    this.loader.open();

    this.AdesaocService.aprovarAdesaoMassa(form)
    .subscribe(data => {
              this.loader.close();
              this.snack.open('Adesão revisada com sucesso!', 'OK', { duration: 4000 });
              this.refreshAdesoes();
          },
          (error => {
             this.loader.close();
             let message = '';
             if (error.error)
             {
                  for (const k in error.error)
                  message += error.error[k] + ' | ';
             }
             this.snack.open(message, 'OK', { duration: 6000 });
        })
     );

  }


  implantarAdesao()
  {
    var adesoess = [];
    
    this.selectedAdesao.forEach(function(adesao) {
      adesoess.push(adesao.id);
    }); 

    let form  =  {
      adesoes: adesoess
    }

    this.loader.open();

    this.AdesaocService.implantarAdesaoMassa(form)
    .subscribe(data => {
              this.loader.close();
              this.snack.open('Adesão revisada com sucesso!', 'OK', { duration: 4000 });
              this.refreshAdesoes();
          },
          (error => {
             this.loader.close();
             let message = '';
             if (error.error)
             {
                  for (const k in error.error)
                  message += error.error[k] + ' | ';
             }
             this.snack.open(message, 'OK', { duration: 6000 });
        })
     );

  }

  pesquisarAdesoes(offset = 0) 
  {

    offset = offset + 1;
   
    this.pagina  = offset;

    const pesquisa = {
      orderby:    this.orderby,
      direction:  this.direction,
      campo: this.filterForm.value.pesquisarpor,
      conteudo: this.filterForm.value.search,
      csituacao: this.filterForm.value.csituacao,
      tipodeplano_id: this.filterForm.value.tipodeplano_id,
      datainicio: this.formatarData(this.filterForm.value.datainicio),
      datafim: this.formatarData(this.filterForm.value.datafim),
      pagina: offset,
    }

    this.loader.open();

    this.AdesaocService.pesquisarAdesoes(pesquisa)
      .subscribe(response => {
        this.adesoes            = response.data;
        this.page_totalElements = response.total;
        if (this.adesoes.length === 0) {
          this.snack.open('Não existe adesoes com a pesquisa escolhida!', 'OK', { duration: 4000 });
        } else {
          this.id                     = this.adesoes[0].id;
          this.beneficiario_id          = this.adesoes[0].beneficiarios;
        }
        this.selectedAdesao           = [];
        this.loader.close();
      });
  }

  refreshAdesoes() 
  {
    
    const pesquisa = {
      orderby:    this.orderby,
      direction:  this.direction,
      campo: this.filterForm.value.pesquisarpor,
      conteudo: this.filterForm.value.search,
      csituacao: this.filterForm.value.csituacao,
      tipodeplano_id: this.filterForm.value.tipodeplano_id,
      datainicio: this.formatarData(this.filterForm.value.datainicio),
      datafim: this.formatarData(this.filterForm.value.datafim),
      pagina: this.pagina,
    }

    this.loader.open();

    this.AdesaocService.pesquisarAdesoes(pesquisa)
      .subscribe(response => {
        this.adesoes            = response.data;
        this.page_totalElements = response.total;
        if (this.adesoes.length === 0) {
          this.snack.open('Não existe adesoes com a pesquisa escolhida!', 'OK', { duration: 4000 });
        } else {
          this.id                     = this.adesoes[0].id;
          this.beneficiario_id          = this.adesoes[0].beneficiarios;
        }
        this.selectedAdesao           = [];
        this.loader.close();
      });
  }

  exportarAdesoes() 
  {
    this.loader.open();
    const pesquisa = {
      orderby:    this.orderby,
      direction:  this.direction,
      campo: this.filterForm.value.pesquisarpor,
      conteudo: this.filterForm.value.search,
      csituacao: this.filterForm.value.csituacao,
      tipodeplano_id: this.filterForm.value.tipodeplano_id,
      datainicio: this.formatarData(this.filterForm.value.datainicio),
      integracao_id: 0,
      datafim: this.formatarData(this.filterForm.value.datafim),
    }

    this.AdesaocService.exportarAdesoes(pesquisa)
        .subscribe(response=> {
       let blob 	= new Blob([response], {type: 'application/vnd.ms-office'});
       this.loader.close();
         FileSaver.saveAs(blob, 'adesoesc.xls');
       });
  }

  exportarAdesoesIntegracao() 
  {
    this.loader.open();
    const pesquisa = {
      orderby:    this.orderby,
      direction:  this.direction,
      campo: this.filterForm.value.pesquisarpor,
      conteudo: this.filterForm.value.search,
      csituacao: this.filterForm.value.csituacao,
      tipodeplano_id: this.filterForm.value.tipodeplano_id,
      integracao_id: this.filterForm.value.integracao_id,
      datainicio: this.formatarData(this.filterForm.value.datainicio),
      datafim: this.formatarData(this.filterForm.value.datafim),
    }

    this.AdesaocService.exportarAdesoes(pesquisa)
        .subscribe(response=> {
       let blob 	= new Blob([response], {type: 'application/vnd.ms-office'});
       this.loader.close();
         FileSaver.saveAs(blob, 'int_adesoes.xls');
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
/*
  implantarContrato(id)  
  {
    this.loader.open();

    this.AdesaocService.implantarAdesao(id)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Adesão aprovada com sucesso!', 'OK', { duration: 4000 });
            },
            (error => {
              console.log(error);
               this.loader.close();
               let message = '';
               if (error.error)
               {
                    for (const k in error.error)
                    message += error.error[k] + ' | ';
               }
               this.snack.open(message, 'OK', { duration: 6000 });
          })
       );

  }

*/

  downloadContrato(id) {
    this.loader.open();
    this.AdesaocService.downloadContrato(id)
    .subscribe(response => {
      let blob 	= new Blob([response], {type: 'application/octet-stream'});
      this.loader.close();
      FileSaver.saveAs(blob, id + '_contrato.zip');
    },
    error => {
      this.loader.close();
      this.snack.open(error.error.id[0], 'OK', { duration: 6000 });
    }
  );
  }

  emailContrato(id) {
    this.loader.open();
    this.AdesaocService.emailContrato(id)
    .subscribe(response => {
      this.loader.close();
    });
  }

  pdfContrato(id) {
    this.loader.open();
    this.AdesaocService.pdfContrato(id)
    .subscribe(response => {
      this.loader.close();
    });
  }

  removerAdesao(row) {
    this.confirmService.confirm({message: `Confirme a exclusao da adesão nº ${row.id}? - Atenção esta ação é irreversível !`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.AdesaocService.removerAdesao(row)
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

  onSelectAdesao({ selected }) {

    this.selectedAdesao  = selected;
    if (selected.length > 0)
    {
      this.id                     = selected[selected.length-1].id;
      this.beneficiario_id        = selected[selected.length-1].beneficiarios[0].id;
      this.beneficiarios          = selected[selected.length-1].beneficiarios;
    }
    
  }

  onClickAdesao(row) {

      this.id                     = row.id;
      this.adesao                 = row;
      this.selectedVal            = 'Plano';
    
      this.adesoes.forEach(select => {
        if (this.id == select.id)
        {
            this.beneficiario_id  = select.beneficiarios[0].id;
            this.beneficiarios    = select.beneficiarios;
        }
      });

      this.formulario             = true;
  }

  public onValChange(val: string) {
    this.selectedVal          = val;
  }

  onVoltarAdesao()
  {
    this.formulario = false;
    this.listar     = true;
  }

  formularioPlano()
  {
    this.formulario                 = true;
  }

  formularioBeneficiario(id)
  {
    this.beneficiario_id = id;
  }

  atribuirCorAdesao(csituacao)
  {
    switch (csituacao) {
      case 'C':
       return 'blue';
      case 'E':
       return 'purple'; 
      case 'X':
       return 'red'; 
      case 'P':
       return 'green'; 
      case 'A':
        return 'indigo';   
      case 'M':
        return 'navy';   
      case 'D':
        return 'orange';          
      default:
        return 'black';
    }
  }

  getAcaoAdesao(acao) {
    if (acao.acao =='voltar')
    {
      this.pesquisarAdesoes();
      this.onVoltarAdesao();
    }
  }
}