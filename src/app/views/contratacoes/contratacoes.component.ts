import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../shared/services/app-loader/app-loader.service';
import { ContratacaoService } from './contratacao.service';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contratacoes',
  templateUrl: './contratacoes.component.html',
  styleUrls: ['./contratacoes.component.scss']
})
export class ContratacoesComponent implements OnInit {

  public id: number;
  public filterForm: FormGroup;
  public contratacaoForm: FormGroup;

  public getContratacaoSub: Subscription;

  public formulario: boolean;
  public InserirContratacao: boolean;
  public AlterarContratacao: boolean;
  public ExcluirContratacao: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  contratacoes: any = [];

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private contratacaoService: ContratacaoService,
    private confirmService: AppConfirmService

  ) { }

  ngOnInit() {

    this.page_totalElements = 0;
    this.page_pageNumber 	= 0;
    this.page_size 			= 10;

    this.filterForm 		= new FormGroup({
      search: new FormControl('', [Validators.required]),
      pesquisarpor: new FormControl('', [Validators.required])
    });

    this.filterForm.patchValue({ pesquisarpor: 'contratacao' });

    this.contratacaoForm 		= new FormGroup({
      tipodepessoa: new FormControl('', [Validators.required]),
      contratacao: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    });
    this.formulario = false;

    this.InserirContratacao =  this.AuthGuard.getPermissao('InserirContratacao');
    this.AlterarContratacao =  this.AuthGuard.getPermissao('AlterarContratacao');
    this.ExcluirContratacao =  this.AuthGuard.getPermissao('ExcluirContratacao');

  }

  ngOnDestroy() {
    if (this.getContratacaoSub) {
      this.getContratacaoSub.unsubscribe();
    }
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.contratacaoService.obterContratacao(this.id).subscribe(contratacao => {
        this.contratacaoForm.patchValue({ tipodepessoa: contratacao.tipodepessoa });
        this.contratacaoForm.patchValue({ contratacao: contratacao.contratacao });
      });
    } else {
      this.contratacaoForm.patchValue({ tipodepessoa: 'F' });
      this.contratacaoForm.patchValue({ contratacao: '' });
    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  obterContratacoes() {

    this.getContratacaoSub = this.contratacaoService.obterContratacoes()
      .subscribe(contratacoes => {
        this.contratacoes = contratacoes;
      });
  }

  pesquisarContratacoes(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.contratacaoService.pesquisarContratacoes(offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(contratacoes => {
          this.contratacoes = contratacoes.data;
          this.page_totalElements = contratacoes.total;
          this.loader.close();
          if (this.contratacoes.length === 0)
          {
            this.snack.open('Não existe contratação com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todasContratacoes(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.contratacaoService.todasContratacoes(offset)
        .subscribe(contratacoes => {
          this.contratacoes = contratacoes.data;
          this.page_totalElements = contratacoes.total;
          this.loader.close();
          if (this.contratacoes.length === 0)
          {
            this.snack.open('Não existe nenhum registro!', 'OK', { duration: 4000 });
          }
        });
  }

  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todasContratacoes(pageInfo.offset);
    } else {
      this.pesquisarContratacoes(pageInfo.offset);
    }
  }

  submit() {

    this.loader.open();

    if (this.id > 0)
    {
      this.contratacaoService.atualizarContratacao(this.id, this.contratacaoForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Contratação alterada!', 'OK', { duration: 4000 });
                this.formulario = false;
                this.paginacao({ offset: this.pagina });
            },
            (error => {
               this.loader.close();
               let message = '';
               if (error.error) {
                  for (const k in error.error)
                  {
                    message += error.error[k];
                    if (+k > 0)
                    { 
                      message += ' | ';
                    }
                  }
               }
               this.snack.open(message, 'OK', { duration: 6000 });
          })
       );
    } else {
           this.contratacaoService.adicionarContratacao(this.contratacaoForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Contratação adicionada!', 'OK', { duration: 4000 });
                this.formulario = false;
                this.paginacao({ offset: this.pagina });
              },
              (error => {
                 this.loader.close();
                 let message = '';
                 if (error.error) {
                   for (const k in error.error)
                   {
                     message += error.error[k];
                     if (+k > 0)
                     { 
                       message += ' | ';
                     }
                   }
                 }
                 this.snack.open(message, 'OK', { duration: 6000 });
            })
         );
    }
  }

  removerContratacao(row) {
    this.confirmService.confirm({message: `Excluir ${row.contratacao}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.contratacaoService.removerContratacao(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Contratação excluida!', 'OK', { duration: 4000 });
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
