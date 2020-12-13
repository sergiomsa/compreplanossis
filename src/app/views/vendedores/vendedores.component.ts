import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../shared/services/app-loader/app-loader.service';
import { VendedorService } from './vendedor.service';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomValidators } from 'ng2-validation';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-vendedores',
  templateUrl: './vendedores.component.html',
  styleUrls: ['./vendedores.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class VendedoresComponent implements OnInit {


  public id: number;
  public filterForm: FormGroup;
  public vendedorForm: FormGroup;
  public getVendedorSub: Subscription;

  public formulario: boolean;
  public InserirVendedor: boolean;
  public AlterarVendedor: boolean;
  public ExcluirVendedor: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  bancos: any = [];
  corretoras: any = [];
  vendedores: any = [];
  vendedor: any   = [];
  public maskcep        = [ /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/ ];
  public maskcpf        = [ /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public masktelefone   = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/];
  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private vendedorService: VendedorService,
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

    this.filterForm.patchValue({ pesquisarpor: 'cpf' });

    this.vendedorForm = new FormGroup({
      cpf:                  new FormControl('', [Validators.required]),
      nome:            	    new FormControl('', [Validators.required]),
      email:               	new FormControl('', [Validators.required, Validators.email]),
      telefone:             new FormControl('', [CustomValidators.phone('BD')]),
      cep:                  new FormControl('', [Validators.required]),
      logradouro:           new FormControl('', [Validators.required]),
      numero:               new FormControl('', [Validators.required]),
      bairro:               new FormControl('', [Validators.required]),
      complemento:          new FormControl(''),
      cidade:               new FormControl('', [Validators.required]),
      estado:               new FormControl('', [Validators.required]),
      corretora_id:  		    new FormControl('', [Validators.required]), 
      administrador:        new FormControl(false, [Validators.required]),
      ecommerce:            new FormControl(false, [Validators.required]),
      linkpagamento:        new FormControl(false, [Validators.required]),
      type:                 new FormControl('', [Validators.required]),
      bank_code:            new FormControl('', [Validators.required]),
      agencia:              new FormControl('', [Validators.required]),
      agencia_dv:           new FormControl(''),
      conta:                new FormControl('', [Validators.required]),
      conta_dv:             new FormControl('', [Validators.required]),
     
    });
    this.formulario = false;

    this.InserirVendedor =  this.AuthGuard.getPermissao('InserirVendedor');
    this.AlterarVendedor =  this.AuthGuard.getPermissao('AlterarVendedor');
    this.ExcluirVendedor =  this.AuthGuard.getPermissao('ExcluirVendedor');

  }

  ngOnDestroy() {
    if (this.getVendedorSub) {
      this.getVendedorSub.unsubscribe();
    }
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    this.vendedorService.obterCorretoras().subscribe(response => {
      this.corretoras = response;
    });

    this.vendedorService.obterBancos().subscribe(response => {
      this.bancos = response;
    });

    if (this.id > 0)
    {
      this.vendedorService.obterVendedor(this.id).subscribe(vendedor => {
        if (vendedor.administrador==1)
        {
          vendedor.administrador	= true;
        } else {
          vendedor.administrador	= false;
        }

        if (vendedor.ecommerce==1)
        {
          vendedor.ecommerce	= true;
        } else {
          vendedor.ecommerce	= false;
        }

        if (vendedor.linkpagamento==1)
        {
          vendedor.linkpagamento	= true;
        } else {
          vendedor.linkpagamento	= false;
        }

        this.vendedorForm.patchValue({ cpf: vendedor.cpf });
        this.vendedorForm.patchValue({ nome: vendedor.nome });
        this.vendedorForm.patchValue({ cep: vendedor.cep });
        this.vendedorForm.patchValue({ logradouro: vendedor.logradouro });
        this.vendedorForm.patchValue({ numero: vendedor.numero });
        this.vendedorForm.patchValue({ complemento: vendedor.complemento });
        this.vendedorForm.patchValue({ bairro: vendedor.bairro });
        this.vendedorForm.patchValue({ cidade: vendedor.cidade });
        this.vendedorForm.patchValue({ estado: vendedor.estado });
        this.vendedorForm.patchValue({ telefone: vendedor.telefone });
        this.vendedorForm.patchValue({ email: vendedor.email });
        this.vendedorForm.patchValue({ corretora_id: vendedor.corretora_id });
        this.vendedorForm.patchValue({ administrador: vendedor.administrador });
        this.vendedorForm.patchValue({ ecommerce: vendedor.ecommerce });
        this.vendedorForm.patchValue({ linkpagamento: vendedor.linkpagamento });
        this.vendedorForm.patchValue({ type:    vendedor.type });
        this.vendedorForm.patchValue({ bank_code: vendedor.bank_code });
        this.vendedorForm.patchValue({ agencia:  vendedor.agencia });
        this.vendedorForm.patchValue({ agencia_dv: vendedor.agencia_dv });
        this.vendedorForm.patchValue({ conta:   vendedor.conta });
        this.vendedorForm.patchValue({ conta_dv:  vendedor.conta_dv });

        if (!vendedor.ecommerce)
        {
          this.vendedorForm.get('type').clearValidators();
          this.vendedorForm.get('bank_code').clearValidators();
          this.vendedorForm.get('agencia').clearValidators();
          this.vendedorForm.get('conta').clearValidators();
          this.vendedorForm.get('conta_dv').clearValidators();
        } else {
          this.vendedorForm.get('type').setValidators([Validators.required]);
          this.vendedorForm.get('bank_code').setValidators([Validators.required]);
          this.vendedorForm.get('agencia').setValidators([Validators.required]);
          this.vendedorForm.get('conta').setValidators([Validators.required]);
          this.vendedorForm.get('conta_dv').setValidators([Validators.required]);
        }
        this.vendedorForm.get('type').updateValueAndValidity();
        this.vendedorForm.get('bank_code').updateValueAndValidity();
        this.vendedorForm.get('agencia').updateValueAndValidity();
        this.vendedorForm.get('conta').updateValueAndValidity();
        this.vendedorForm.get('conta_dv').updateValueAndValidity();

      });
    } else {
      this.vendedorForm.patchValue({ nome: '' });
    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  obterVendedores() {

    this.getVendedorSub = this.vendedorService.obterVendedores()
      .subscribe(vendedores => {
        this.vendedores = vendedores;
      });
  }

  obterCep() {
    this.vendedorService.cep(this.vendedorForm.value.cep).subscribe(endereco => {
      this.vendedorForm.patchValue({ logradouro: endereco.logradouro });
      this.vendedorForm.patchValue({ bairro: endereco.bairro });
      this.vendedorForm.patchValue({ cidade: endereco.localidade });
      this.vendedorForm.patchValue({ estado: endereco.uf });
    });
  }

  pesquisarVendedores(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.vendedorService.pesquisarVendedores(offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(vendedores => {
          this.vendedores = vendedores.data;
          this.page_totalElements = vendedores.total;
          this.loader.close();
          if (this.vendedores.length === 0)
          {
            this.snack.open('Não existe vendedor com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todasVendedores(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.vendedorService.todasVendedores(offset)
        .subscribe(vendedores => {
          this.vendedores = vendedores.data;
          this.page_totalElements = vendedores.total;
          this.loader.close();
          if (this.vendedores.length === 0)
          {
            this.snack.open('Não existe nenhum registro!', 'OK', { duration: 4000 });
          }
        });

  }


  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todasVendedores(pageInfo.offset);
    } else {
      this.pesquisarVendedores(pageInfo.offset);
    }
  }


  submit() {

    
    this.loader.open();

    if (this.id > 0)
    {
      this.vendedorService.atualizarVendedor(this.id, this.vendedorForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Vendedor alterada!', 'OK', { duration: 4000 });
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
           this.vendedorService.adicionarVendedor(this.vendedorForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Vendedor adicionada!', 'OK', { duration: 4000 });
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

  changeEcommerce(event)
  {
     if (!event.checked)
     {
        this.vendedorForm.get('type').clearValidators();
        this.vendedorForm.get('bank_code').clearValidators();
        this.vendedorForm.get('agencia').clearValidators();
        this.vendedorForm.get('conta').clearValidators();
        this.vendedorForm.get('conta_dv').clearValidators();
     } else {
        this.vendedorForm.get('type').setValidators([Validators.required]);
        this.vendedorForm.get('bank_code').setValidators([Validators.required]);
        this.vendedorForm.get('agencia').setValidators([Validators.required]);
        this.vendedorForm.get('conta').setValidators([Validators.required]);
        this.vendedorForm.get('conta_dv').setValidators([Validators.required]);
     }
     this.vendedorForm.get('type').updateValueAndValidity();
     this.vendedorForm.get('bank_code').updateValueAndValidity();
     this.vendedorForm.get('agencia').updateValueAndValidity();
     this.vendedorForm.get('conta').updateValueAndValidity();
     this.vendedorForm.get('conta_dv').updateValueAndValidity();
  }

  removerVendedor(row) {
    this.confirmService.confirm({message: `Excluir ${row.nome}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.vendedorService.removerVendedor(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Vendedor excluida!', 'OK', { duration: 4000 });
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

  exportarVendedores() 
  {
    this.loader.open();

    let pesquisa  =  {
      nome: this.filterForm.value.pesquisarpor,
      conteudo: this.filterForm.value.search
    }

    this.vendedorService.exportarVendedores(pesquisa)
        .subscribe(response=> {
       let blob 	= new Blob([response], {type: 'application/vnd.ms-office'});
       this.loader.close();
         FileSaver.saveAs(blob, 'vendedores.xls');
       });
  }

}