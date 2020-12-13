import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { PlanoxcoparticipacaoService } from './planoxcoparticipacao.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-planoxcoparticipacoes',
  templateUrl: './planoxcoparticipacoes.component.html',
  styleUrls: ['./planoxcoparticipacoes.component.scss']
})
export class PlanoxcoparticipacoesComponent implements OnInit {

  @Input() plano_id;

  public id: number;
  public filterForm: FormGroup;
  public planoxcoparticipacaoForm: FormGroup;

  public formulario: boolean;
  public InserirPlanoxcoparticipacao: boolean;
  public AlterarPlanoxcoparticipacao: boolean;
  public ExcluirPlanoxcoparticipacao: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  planoxcoparticipacoes: any = [];
  situacao: any;
  coparticipacoes: any;

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private planocoparticipacaoService: PlanoxcoparticipacaoService,
    private confirmService: AppConfirmService

  ) { }

  ngOnInit() {
    this.obterCoparticipacoes();

    this.page_totalElements = 0;
    this.page_pageNumber = 0;
    this.page_size = 10;

    this.filterForm = new FormGroup({
      search:         new FormControl('', [Validators.required]),
      pesquisarpor:   new FormControl('', [Validators.required])
    });

    this.filterForm.patchValue({ pesquisarpor: 'situacao' });

    this.planoxcoparticipacaoForm  = new FormGroup({
      plano_id:               new FormControl(''),
      coparticipacao_id:      new FormControl('', [Validators.required]),
      valor:                  new FormControl('', [Validators.required]),
      situacao:               new FormControl('', [Validators.required]),
      tipovalor:              new FormControl('V', [Validators.required]),

    });
    this.formulario = false;

    this.InserirPlanoxcoparticipacao =  this.AuthGuard.getPermissao('InserirPlanoxcoparticipacao');
    this.AlterarPlanoxcoparticipacao =  this.AuthGuard.getPermissao('AlterarPlanoxcoparticipacao');
    this.ExcluirPlanoxcoparticipacao =  this.AuthGuard.getPermissao('ExcluirPlanoxcoparticipacao');

  }

  ngOnChanges()
  {
    this.todosPlanoxcoparticipacoes();
  }

  ngOnDestroy() {
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.planocoparticipacaoService.obterPlanoxcoparticipacao(this.id).subscribe(planoxcoparticipacao => {
        this.planoxcoparticipacaoForm.patchValue({ coparticipacao_id: planoxcoparticipacao.coparticipacao_id });
        this.planoxcoparticipacaoForm.patchValue({ valor: planoxcoparticipacao.valor });
        this.planoxcoparticipacaoForm.patchValue({ situacao: planoxcoparticipacao.situacao });
        this.planoxcoparticipacaoForm.patchValue({ tipovalor: planoxcoparticipacao.tipovalor });
      });
    } else {
      this.planoxcoparticipacaoForm.patchValue({ coparticipacao_id: '' });
      this.planoxcoparticipacaoForm.patchValue({ valor: '' });
      this.planoxcoparticipacaoForm.patchValue({ situacao: 'Ativo' });
      this.planoxcoparticipacaoForm.patchValue({ tipovalor: 'V' });

    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  pesquisarPlanoxcoparticipacoes(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.planocoparticipacaoService.pesquisarPlanoxcoparticipacoes(this.plano_id, offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(planoxcoparticipacoes => {
          this.planoxcoparticipacoes = planoxcoparticipacoes.data;
          this.page_totalElements = planoxcoparticipacoes.total;
          this.loader.close();
          if (this.planoxcoparticipacoes.length === 0)
          {
            this.snack.open('Não existe cooparticipação com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todosPlanoxcoparticipacoes(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      //this.loader.open();
     this.planocoparticipacaoService.todosPlanoxcoparticipacoes(this.plano_id,offset)
        .subscribe(planoxcoparticipacoes => {
          this.planoxcoparticipacoes = planoxcoparticipacoes.data;
          this.page_totalElements = planoxcoparticipacoes.total;
          this.loader.close();
          if (this.planoxcoparticipacoes.length === 0)
          {
            this.snack.open('Não existe nenhum registro de coparticipação!', 'OK', { duration: 4000 });
          }
        });

  }


  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todosPlanoxcoparticipacoes(pageInfo.offset);
    } else {
      this.pesquisarPlanoxcoparticipacoes(pageInfo.offset);
    }
  }


  submit() {

    this.loader.open();

    this.planoxcoparticipacaoForm.patchValue({ plano_id: this.plano_id });

    if (this.id > 0)
    {
      this.planocoparticipacaoService.atualizarPlanoxcoparticipacao(this.id, this.planoxcoparticipacaoForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Cooparticipação alterada!', 'OK', { duration: 4000 });
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
    } else {
           this.planocoparticipacaoService.adicionarPlanoxcoparticipacao(this.planoxcoparticipacaoForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Cooparticipação adicionada!', 'OK', { duration: 4000 });
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

  removerPlanoxcoparticipacao(row) {
    this.confirmService.confirm({message: `Excluir Cooparticipação ${row.coparticipacao.coparticipacao}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.planocoparticipacaoService.removerPlanoxcoparticipacao(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Cooparticipação excluida!', 'OK', { duration: 4000 });
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

  obterCoparticipacoes() {
    this.planocoparticipacaoService.obterCoparticipacao().subscribe(response => {
      this.coparticipacoes = response;
    });
  }

}
