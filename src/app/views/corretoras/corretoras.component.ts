import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../shared/services/app-loader/app-loader.service';
import { CorretoraService } from './corretora.service';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomValidators } from 'ng2-validation';
import { truncate } from 'fs';

@Component({
  selector: 'app-corretoras',
  templateUrl: './corretoras.component.html',
  styleUrls: ['./corretoras.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class CorretorasComponent implements OnInit {


  public id: number;
  public filterForm: FormGroup;
  public corretoraForm: FormGroup;
  public getCorretoraSub: Subscription;

  public formulario: boolean;
  public InserirCorretora: boolean;
  public AlterarCorretora: boolean;
  public ExcluirCorretora: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  operadoras: any = [];
  corretoras: any = [];
  corretora: any   = [];
  public maskcep        = [ /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/ ];
  public maskcnpj       = [ /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/ ];
  public masktelefone   = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/];
  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private corretoraService: CorretoraService,
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

    this.filterForm.patchValue({ pesquisarpor: 'corretora' });

    this.corretoraForm = new FormGroup({
      cnpj:                 new FormControl('', [Validators.required]),
      corretora:            new FormControl('', [Validators.required]),
      email:               	new FormControl('', [Validators.required, Validators.email]),
      contato:             	new FormControl(''),
      equipe:               new FormControl('', [Validators.required]),
      telefone:             new FormControl('', [CustomValidators.phone('BD')]),
      cep:                  new FormControl('', [Validators.required]),
      logradouro:           new FormControl('', [Validators.required]),
      numero:               new FormControl('', [Validators.required]),
      bairro:               new FormControl('', [Validators.required]),
      complemento:          new FormControl(''),
      cidade:               new FormControl('', [Validators.required]),
      estado:               new FormControl('', [Validators.required]),
      operadora_id:  	    new FormControl('', [Validators.required]), 
  
    });
    this.formulario = false;

    this.InserirCorretora =  this.AuthGuard.getPermissao('InserirCorretora');
    this.AlterarCorretora =  this.AuthGuard.getPermissao('AlterarCorretora');
    this.ExcluirCorretora =  this.AuthGuard.getPermissao('ExcluirCorretora');

  }

  ngOnDestroy() {
    if (this.getCorretoraSub) {
      this.getCorretoraSub.unsubscribe();
    }
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    this.corretoraService.obterOperadoras().subscribe(response => {
      this.operadoras = response;
    });

    if (this.id > 0)
    {
      this.corretoraService.obterCorretora(this.id).subscribe(corretora => {
        this.corretoraForm.patchValue({ cnpj: corretora.cnpj });
        this.corretoraForm.patchValue({ corretora: corretora.corretora });
        this.corretoraForm.patchValue({ equipe: corretora.equipe });
        this.corretoraForm.patchValue({ cep: corretora.cep });
        this.corretoraForm.patchValue({ logradouro: corretora.logradouro });
        this.corretoraForm.patchValue({ numero: corretora.numero });
        this.corretoraForm.patchValue({ complemento: corretora.complemento });
        this.corretoraForm.patchValue({ bairro: corretora.bairro });
        this.corretoraForm.patchValue({ cidade: corretora.cidade });
        this.corretoraForm.patchValue({ estado: corretora.estado });
        this.corretoraForm.patchValue({ contato: corretora.contato });
	      this.corretoraForm.patchValue({ telefone: corretora.telefone });
        this.corretoraForm.patchValue({ email: corretora.email });
        this.corretoraForm.patchValue({ operadora_id: corretora.operadora_id });
      });
    } else {
      this.corretoraForm.patchValue({ cnpj: '' });
      this.corretoraForm.patchValue({ corretora: '' });
      this.corretoraForm.patchValue({ equipe: ''});
      this.corretoraForm.patchValue({ cep: '' });
      this.corretoraForm.patchValue({ logradouro: '' });
      this.corretoraForm.patchValue({ numero: '' });
      this.corretoraForm.patchValue({ complemento: '' });
      this.corretoraForm.patchValue({ bairro: '' });
      this.corretoraForm.patchValue({ cidade: '' });
      this.corretoraForm.patchValue({ estado: '' });
      this.corretoraForm.patchValue({ contato: '' });
	    this.corretoraForm.patchValue({ telefone: '' });
      this.corretoraForm.patchValue({ email: '' });
    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  podeExcluir(row) {
    
    if (row.adesoes_count ==0 && row.vendedores_count ==0 && row.users_count ==0)
    {
      return true;
    }

    return false;
  }

  obterCorretoras() {

    this.getCorretoraSub = this.corretoraService.obterCorretoras()
      .subscribe(corretoras => {
        this.corretoras = corretoras;
      });
  }

  obterCep() {
    this.corretoraService.cep(this.corretoraForm.value.cep).subscribe(endereco => {
      this.corretoraForm.patchValue({ logradouro: endereco.logradouro });
      this.corretoraForm.patchValue({ bairro: endereco.bairro });
      this.corretoraForm.patchValue({ cidade: endereco.localidade });
      this.corretoraForm.patchValue({ estado: endereco.uf });
    });
  }

  pesquisarCorretoras(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.corretoraService.pesquisarCorretoras(offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(corretoras => {
          this.corretoras = corretoras.data;
          this.page_totalElements = corretoras.total;
          this.loader.close();
          if (this.corretoras.length === 0)
          {
            this.snack.open('Não existe corretora com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todasCorretoras(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.corretoraService.todasCorretoras(offset)
        .subscribe(corretoras => {
          this.corretoras = corretoras.data;
          this.page_totalElements = corretoras.total;
          this.loader.close();
          if (this.corretoras.length === 0)
          {
            this.snack.open('Não existe nenhum registro!', 'OK', { duration: 4000 });
          }
        });

  }


  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todasCorretoras(pageInfo.offset);
    } else {
      this.pesquisarCorretoras(pageInfo.offset);
    }
  }


  submit() {

    
    this.loader.open();

    if (this.id > 0)
    {
      this.corretoraService.atualizarCorretora(this.id, this.corretoraForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Corretora alterada!', 'OK', { duration: 4000 });
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
           this.corretoraService.adicionarCorretora(this.corretoraForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Corretora adicionada!', 'OK', { duration: 4000 });
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

  removerCorretora(row) {
    this.confirmService.confirm({message: `Excluir ${row.corretora}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.corretoraService.removerCorretora(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Corretora excluida!', 'OK', { duration: 4000 });
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
