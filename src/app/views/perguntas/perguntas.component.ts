import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../shared/services/app-loader/app-loader.service';
import { ContratacaoService } from './pergunta.service';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perguntas',
  templateUrl: './perguntas.component.html',
  styleUrls: ['./perguntas.component.scss']
})
export class PerguntasComponent implements OnInit {

  public id: number;
  public filterForm: FormGroup;
  public perguntaForm: FormGroup;

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

  perguntas: any = [];
  operadoras: any = [];

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private perguntaService: ContratacaoService,
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

    this.filterForm.patchValue({ pesquisarpor: 'pergunta' });

    this.perguntaForm 		= new FormGroup({
      pergunta: new FormControl('', [Validators.required,Validators.maxLength(200)]),
      sequencia: new FormControl(0, [Validators.required]),
      operadora_id: new FormControl(0, [Validators.required]),
      ativo: new FormControl(true, [Validators.required]),
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

    this.perguntaService.obterOperadora().subscribe(response => {
      this.operadoras = response;
    });

    if (this.id > 0)
    {
      this.perguntaService.obterContratacao(this.id).subscribe(pergunta => {
        this.perguntaForm.patchValue({ ativo: pergunta.ativo });
        this.perguntaForm.patchValue({ sequencia: pergunta.sequencia });
        this.perguntaForm.patchValue({ pergunta: pergunta.pergunta });
        this.perguntaForm.patchValue({ operadora_id: pergunta.operadora_id });
      });
    } else {
      this.perguntaForm.patchValue({ ativo: true });
      this.perguntaForm.patchValue({ sequencia: 0 });
      this.perguntaForm.patchValue({ pergunta: '' });
    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  obterPerguntas() {

    this.getContratacaoSub = this.perguntaService.obterPerguntas()
      .subscribe(perguntas => {
        this.perguntas = perguntas;
      });
  }

  pesquisarPerguntas(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.perguntaService.pesquisarPerguntas(offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(perguntas => {
          this.perguntas = perguntas.data;
          this.page_totalElements = perguntas.total;
          this.loader.close();
          if (this.perguntas.length === 0)
          {
            this.snack.open('Não existe pergunta com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todasPerguntas(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.perguntaService.todasPerguntas(offset)
        .subscribe(perguntas => {
          this.perguntas = perguntas.data;
          this.page_totalElements = perguntas.total;
          this.loader.close();
          if (this.perguntas.length === 0)
          {
            this.snack.open('Não existe nenhum registro!', 'OK', { duration: 4000 });
          }
        });
  }

  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todasPerguntas(pageInfo.offset);
    } else {
      this.pesquisarPerguntas(pageInfo.offset);
    }
  }

  submit() {

    this.loader.open();

    if (this.id > 0)
    {
      this.perguntaService.atualizarContratacao(this.id, this.perguntaForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Pergunta alterada!', 'OK', { duration: 4000 });
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
           this.perguntaService.adicionarContratacao(this.perguntaForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Pergunta adicionada!', 'OK', { duration: 4000 });
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
    this.confirmService.confirm({message: `Excluir ${row.pergunta}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.perguntaService.removerContratacao(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Pergunta excluida!', 'OK', { duration: 4000 });
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
  
  traduzBoolean(value)
  {
    if (value)
    {
        return "Sim";
    } else {
        return "Não";
    }
  }

}
