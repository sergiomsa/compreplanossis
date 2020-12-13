import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../shared/services/app-loader/app-loader.service';
import { OperadoraService } from './operadora.service';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-operadoras',
  templateUrl: './operadoras.component.html',
  styleUrls: ['./operadoras.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class OperadorasComponent implements OnInit {

  public id: number;
  public filterForm: FormGroup;
  public operadoraForm: FormGroup;
  public vigenciaForm: FormGroup;

  @ViewChild("fileInput") fileInput;

  public logos: any;
  public logo: any;

  public getOperadoraSub: Subscription;
  public getVigenciaSub: Subscription;

  public formulario: boolean;
  public vigencia_formulario: boolean;
  public InserirOperadora: boolean;
  public AlterarOperadora: boolean;
  public ExcluirOperadora: boolean;

  public InserirVigencia: boolean;
  public AlterarVigencia: boolean;
  public ExcluirVigencia: boolean;

  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;
  public operadora_id: number;
  public vigencia_id: number;

  public vigencia_page_totalElements: number;
  public vigencia_page_pageNumber: number;
  public vigencia_page_size: number;
  public vigencia_pagina: number;

  operadoras: any = [];
  selectedOperadora = [];
  vigencias: any = [];
  operadora: any = [];
  vigencia: any = [];
  bancos: any = [];
  public maskcep        = [ /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/ ];
  public maskcnpj       = [ /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/ ];
  public masktelefone   = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private operadoraService: OperadoraService,
    private confirmService: AppConfirmService,

  ) {}


  ngOnInit() {

    this.page_totalElements = 0;
    this.page_pageNumber = 0;
    this.page_size = 10;

    this.filterForm = new FormGroup({
      search:       new FormControl('', [Validators.required]),
      pesquisarpor: new FormControl('', [Validators.required])
    });

    this.filterForm.patchValue({ pesquisarpor: 'operadora' });

    this.operadoraForm = new FormGroup({
      cnpj:                 new FormControl('', [Validators.required]),
      operadora:            new FormControl('', [Validators.required]),
      email:                new FormControl('', [Validators.required, Validators.email]),
      siteurl:       		    new FormControl(''), 
      telefone:             new FormControl('', [CustomValidators.phone('BD')]),
      cep:                  new FormControl('', [Validators.required]),
      logradouro:           new FormControl('', [Validators.required]),
      numero:               new FormControl('', [Validators.required]),
      bairro:               new FormControl('', [Validators.required]),
      complemento:          new FormControl(),
      cidade:               new FormControl('', [Validators.required]),
      estado:               new FormControl('', [Validators.required]),
      logo:                 new FormControl(''),
      type:                 new FormControl(''),
      bank_code:            new FormControl(''),
      agencia:              new FormControl(''),
      agencia_dv:           new FormControl(''),
      conta:                new FormControl(''),
      conta_dv:             new FormControl(''),
      taxa_cadastro:        new FormControl(""),
    });

    this.vigenciaForm = new FormGroup({
      operadora_id:         new FormControl('', [Validators.required]),
      diavencimento:        new FormControl('', [Validators.required]),
      diade:                new FormControl('', [Validators.required]),
      diaate:               new FormControl('', [Validators.required]),
      somanomes:       		  new FormControl('', [Validators.required]),
    });

    this.formulario           = false;
    this.vigencia_formulario  = false;
    this.InserirOperadora     = this.AuthGuard.getPermissao('InserirOperadora');
    this.AlterarOperadora     = this.AuthGuard.getPermissao('AlterarOperadora');
    this.ExcluirOperadora     = this.AuthGuard.getPermissao('ExcluirOperadora');

    this.InserirVigencia      = this.AuthGuard.getPermissao('InserirVigencia');
    this.AlterarVigencia      = this.AuthGuard.getPermissao('AlterarVigencia');
    this.ExcluirVigencia      = this.AuthGuard.getPermissao('ExcluirVigencia');

  }

  ngOnDestroy() {
    if (this.getOperadoraSub) {
      this.getOperadoraSub.unsubscribe();
    }
    if (this.getVigenciaSub) {
      this.getVigenciaSub.unsubscribe();
    }
  }

  onSelectOperadora({ selected }) {

    this.vigencia_formulario  = false;
    this.operadora_id = selected[0].id;
    this.operadora    = selected[0].operadora;
    this.vigenciaForm.patchValue({ operadora_id: this.operadora_id });
    this.todasVigencias();

  }

  abrirFormulario(id) {

    this.id                   = id;
    this.formulario           = true;
 
    this.operadoraService.obterBancos().subscribe(response => {
      this.bancos = response;
    });

    if (this.id > 0)
    {
      this.operadoraService.obterOperadora(this.id).subscribe(operadora => {
        this.operadoraForm.patchValue({ cnpj: operadora.cnpj });
        this.operadoraForm.patchValue({ operadora: operadora.operadora });
        this.operadoraForm.patchValue({ cep: operadora.cep });
        this.operadoraForm.patchValue({ logradouro: operadora.logradouro });
        this.operadoraForm.patchValue({ numero: operadora.numero });
        this.operadoraForm.patchValue({ complemento: operadora.complemento });
        this.operadoraForm.patchValue({ bairro: operadora.bairro });
        this.operadoraForm.patchValue({ cidade: operadora.cidade });
        this.operadoraForm.patchValue({ estado: operadora.estado });
        this.operadoraForm.patchValue({ telefone: operadora.telefone });
        this.operadoraForm.patchValue({ email: operadora.email });
        this.operadoraForm.patchValue({ siteurl: operadora.siteurl });
        this.operadoraForm.patchValue({ type:    operadora.type });
        this.operadoraForm.patchValue({ bank_code: operadora.bank_code });
        this.operadoraForm.patchValue({ agencia:  operadora.agencia });
        this.operadoraForm.patchValue({ agencia_dv: operadora.agencia_dv });
        this.operadoraForm.patchValue({ conta:   operadora.conta });
        this.operadoraForm.patchValue({ conta_dv:  operadora.conta_dv });
        this.operadoraForm.patchValue({ taxa_cadastro: operadora.taxa_cadastro });
        this.logos = operadora.logo;
      });
    } else {
      this.operadoraForm.patchValue({ operadora: '' });
      this.logos = '';
    }

  }

  abrirFormularioVigencia(id) {

    this.vigencia_formulario  = true;
    this.vigencia_id          = id;

    if (id > 0)
    {
      this.operadoraService.obterVigencia(id).subscribe(vigencia => {
        this.vigenciaForm.patchValue({ diavencimento: vigencia.diavencimento });
        this.vigenciaForm.patchValue({ diade: vigencia.diade });
        this.vigenciaForm.patchValue({ diaate: vigencia.diaate });
        this.vigenciaForm.patchValue({ somanomes: vigencia.somanomes });
      });
    } else {
      this.vigenciaForm.patchValue({ diavencimento: '' });
      this.vigenciaForm.patchValue({ diade: '' });
      this.vigenciaForm.patchValue({ diaate: '' });
      this.vigenciaForm.patchValue({ somanomes: '' });
    }


  }

  cancelarFormulario() {
    this.formulario           = false;
  }

  cancelarFormularioVigencia() {
    this.vigencia_formulario = false;
  }

  obterOperadoras() {

    this.getOperadoraSub = this.operadoraService.obterOperadoras()
      .subscribe(operadoras => {
        this.operadoras = operadoras;
        this.vigencia_formulario  = false;
        this.operadora_id = operadoras[0].id;
        this.vigenciaForm.patchValue({ operadora_id: this.operadora_id });
        this.todasVigencias();
      });
  }

  obterVigencias() {

    this.getOperadoraSub = this.operadoraService.obterVigencias()
      .subscribe(vigencias => {
        this.vigencias = vigencias;
      });
  }

  obterCep() {
    this.operadoraService.cep(this.operadoraForm.value.cep).subscribe(endereco => {
      this.operadoraForm.patchValue({ logradouro: endereco.logradouro });
      this.operadoraForm.patchValue({ bairro: endereco.bairro });
      this.operadoraForm.patchValue({ cidade: endereco.localidade });
      this.operadoraForm.patchValue({ estado: endereco.uf });
    });
  }

  pesquisarOperadoras(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.operadoraService.pesquisarOperadoras(offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(operadoras => {
          this.operadoras = operadoras.data;
          this.page_totalElements = operadoras.total;
          this.loader.close();
          if (this.operadoras.length === 0)
          {
            this.snack.open('Não existe operadora com a pesquisa escolhida!', 'OK', { duration: 4000 });
          } else {
            this.vigencia_formulario  = false;
            this.operadora_id = this.operadoras[0].id;
            this.operadora    = this.operadoras[0].operadora;
            this.vigenciaForm.patchValue({ operadora_id: this.operadora_id });
            this.todasVigencias();
          }
        });
  }

  pesquisarVigencias(offset=0) {
     this.pesquisa    = 'parcial';
     offset           = offset+1;
     this.formulario  = false;
     this.loader.open();
     this.operadoraService.pesquisarVigencias(offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(vigencias => {
          this.vigencias                    = vigencias.data;
          this.vigencia_page_totalElements  = vigencias.total;
          this.loader.close();
          if (this.vigencias.length === 0)
          {
            this.snack.open('Não existe vigencia com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });
  }

  todasOperadoras(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.operadoraService.todasOperadoras(offset)
        .subscribe(operadoras => {
          this.operadoras   = operadoras.data;
          this.page_totalElements = operadoras.total;
          this.loader.close();
          if (this.operadoras.length === 0)
          {
            this.snack.open('Não existe nenhum registro!', 'OK', { duration: 4000 });
          } else {
            this.vigencia_formulario  = false;
            this.operadora_id = this.operadoras[0].id;
            this.operadora    = this.operadoras[0].operadora;
            this.vigenciaForm.patchValue({ operadora_id: this.operadora_id });
            this.todasVigencias();
          }
        });
  }

  todasVigencias(offset=0) {
     this.pesquisa='total';
     offset = offset+1;
     this.formulario = false;
     this.loader.open();
     this.operadoraService.todasVigencias(this.operadora_id, offset)
        .subscribe(vigencias => {
          this.vigencias                    = vigencias.data;
          this.vigencia_page_totalElements  = vigencias.total;
          this.loader.close();
          if (this.vigencias.length === 0)
          {
            this.snack.open('Não existe nenhum registro!', 'OK', { duration: 4000 });
          }
        });
  }

  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todasOperadoras(pageInfo.offset);
    } else {
      this.pesquisarOperadoras(pageInfo.offset);
    }
  }

  paginacaoVigencia(pageInfo){
    this.vigencia_pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todasVigencias(pageInfo.offset);
    } else {
      this.pesquisarVigencias(pageInfo.offset);
    }
  }


  submit() {

    const imagem = this.fileInput.nativeElement;

    const input = new FormData();
    input.append("logo", imagem.files[0]);

    input.append("cnpj",        this.operadoraForm.value.cnpj);
    input.append("operadora",   this.operadoraForm.value.operadora);
    input.append("cep",         this.operadoraForm.value.cep);
    input.append("logradouro",  this.operadoraForm.value.logradouro);
    input.append("numero",      this.operadoraForm.value.numero);
    input.append("complemento", this.operadoraForm.value.complemento);
    input.append("bairro",      this.operadoraForm.value.bairro);
    input.append("cidade",      this.operadoraForm.value.cidade);
    input.append("estado",      this.operadoraForm.value.estado);
    input.append("telefone",    this.operadoraForm.value.telefone);
    input.append("email",       this.operadoraForm.value.email);
    input.append("siteurl",     this.operadoraForm.value.siteurl);
    input.append("type",        this.operadoraForm.value.type);
    input.append("bank_code",   this.operadoraForm.value.bank_code);
    input.append("agencia",     this.operadoraForm.value.agencia);
    input.append("agencia_dv",  this.operadoraForm.value.agencia_dv);
    input.append("conta",       this.operadoraForm.value.conta);
    input.append("conta_dv",    this.operadoraForm.value.conta_dv);
    input.append("taxa_cadastro",    this.operadoraForm.value.taxa_cadastro);
    this.loader.open();

    if (this.id > 0)
    {
      this.operadoraService.atualizarOperadora(this.id, input)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Operadora alterada!', 'OK', { duration: 4000 });
                this.formulario = false;
                this.paginacao({ offset: this.pagina });
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
    } else {
           this.operadoraService.adicionarOperadora(input)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Operadora adicionada!', 'OK', { duration: 4000 });
                this.formulario = false;
                this.paginacao({ offset: this.pagina });
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
  }

  submitVigencia() {

    this.loader.open();

    if (this.vigencia_id > 0)
    {
      this.operadoraService.atualizarVigencia(this.vigencia_id, this.vigenciaForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Vigencia alterada!', 'OK', { duration: 4000 });
                this.vigencia_formulario = false;
                this. paginacaoVigencia({ offset: this.vigencia_pagina });
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
    } else {
           this.operadoraService.adicionarVigencia(this.vigenciaForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Vigencia adicionada!', 'OK', { duration: 4000 });
                this.vigencia_formulario = false;
                this.paginacaoVigencia({ offset: this.pagina });
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
  }

  removerOperadora(row) {
    this.confirmService.confirm({message: `Excluir ${row.operadora}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.operadoraService.removerOperadora(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Operadora excluida!', 'OK', { duration: 4000 });
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

  removerVigencia(row) {
    this.confirmService.confirm({message: `Excluir ${row.diavencimanto} -  ${row.diaate}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.operadoraService.removerVigencia(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Vigencia excluida!', 'OK', { duration: 4000 });
              this.paginacaoVigencia({ offset: this.pagina });
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
