import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../shared/services/app-loader/app-loader.service';
import { CoparticipacaoService } from './coparticipacao.service';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-coparticipacoes',
  templateUrl: './coparticipacoes.component.html',
  styleUrls: ['./coparticipacoes.component.scss']
})
export class CoparticipacoesComponent implements OnInit {

  public id: number;
  public filterForm: FormGroup;
  public coparticipacaoForm: FormGroup;

  public getCoparticipacaoSub: Subscription;

  public formulario: boolean;
  public InserirCoparticipacao: boolean;
  public AlterarCoparticipacao: boolean;
  public ExcluirCoparticipacao: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  coparticipacoes: any = [];

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private coparticipacaoService: CoparticipacaoService,
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

    this.filterForm.patchValue({ pesquisarpor: 'coparticipacao' });

    this.coparticipacaoForm 		= new FormGroup({
      coparticipacao: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    });
    this.formulario = false;

    this.InserirCoparticipacao =  this.AuthGuard.getPermissao('InserirCoparticipacao');
    this.AlterarCoparticipacao =  this.AuthGuard.getPermissao('AlterarCoparticipacao');
    this.ExcluirCoparticipacao =  this.AuthGuard.getPermissao('ExcluirCoparticipacao');

  }

  ngOnDestroy() {
    if (this.getCoparticipacaoSub) {
      this.getCoparticipacaoSub.unsubscribe();
    }
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.coparticipacaoService.obterCoparticipacao(this.id).subscribe(coparticipacao => {
        this.coparticipacaoForm.patchValue({ coparticipacao: coparticipacao.coparticipacao });
      });
    } else {
      this.coparticipacaoForm.patchValue({ coparticipacao: '' });
    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  obterCoparticipacoes() {

    this.getCoparticipacaoSub = this.coparticipacaoService.obterCoparticipacoes()
      .subscribe(coparticipacoes => {
        this.coparticipacoes = coparticipacoes;
      });
  }

  pesquisarCoparticipacoes(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.coparticipacaoService.pesquisarCoparticipacoes(offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(coparticipacoes => {
          this.coparticipacoes = coparticipacoes.data;
          this.page_totalElements = coparticipacoes.total;
          this.loader.close();
          if (this.coparticipacoes.length === 0)
          {
            this.snack.open('Não existe coparticipação com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todasCoparticipacoes(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.coparticipacaoService.todasCoparticipacoes(offset)
        .subscribe(coparticipacoes => {
          this.coparticipacoes = coparticipacoes.data;
          this.page_totalElements = coparticipacoes.total;
          this.loader.close();
          if (this.coparticipacoes.length === 0)
          {
            this.snack.open('Não existe nenhum registro!', 'OK', { duration: 4000 });
          }
        });
  }

  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todasCoparticipacoes(pageInfo.offset);
    } else {
      this.pesquisarCoparticipacoes(pageInfo.offset);
    }
  }

  submit() {

    this.loader.open();

    if (this.id > 0)
    {
      this.coparticipacaoService.atualizarCoparticipacao(this.id, this.coparticipacaoForm.value)
      .subscribe(data => {
                this.obterCoparticipacoes();
                this.loader.close();
                this.snack.open('Coparticipação alterada!', 'OK', { duration: 4000 });
                this.formulario = false;
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
           this.coparticipacaoService.adicionarCoparticipacao(this.coparticipacaoForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Coparticipação adicionada!', 'OK', { duration: 4000 });
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

  removerCoparticipacao(row) {
    this.confirmService.confirm({message: `Excluir ${row.coparticipacao}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.coparticipacaoService.removerCoparticipacao(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Coparticipação excluida!', 'OK', { duration: 4000 });
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
