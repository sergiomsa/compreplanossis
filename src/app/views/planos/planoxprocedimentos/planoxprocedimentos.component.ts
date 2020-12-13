import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { PlanoxprocedimentoService } from './planoxprocedimento.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-planoxprocedimentos',
  templateUrl: './planoxprocedimentos.component.html',
  styleUrls: ['./planoxprocedimentos.component.scss']
})
export class PlanoxprocedimentosComponent implements OnInit {

  @Input() plano_id;

  public id: number;
  public filterForm: FormGroup;
  public planoxprocedimentoForm: FormGroup;

  public formulario: boolean;
  public InserirPlanoxprocedimento: boolean;
  public AlterarPlanoxprocedimento: boolean;
  public ExcluirPlanoxprocedimento: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  planoxprocedimentos: any = [];
  situacao: any;
  procedimentos: any;
  roldecoberturas: any;

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private planoprocedimentoService: PlanoxprocedimentoService,
    private confirmService: AppConfirmService

  ) { }

  ngOnInit() {
    this.obterProcedimentos();
    this.obterRoldecoberturas();
    this.page_totalElements = 0;
    this.page_pageNumber = 0;
    this.page_size = 10;

    this.filterForm = new FormGroup({
      search:         new FormControl('', [Validators.required]),
      pesquisarpor:   new FormControl('', [Validators.required])
    });

    this.filterForm.patchValue({ pesquisarpor: 'situacao' });

    this.planoxprocedimentoForm  = new FormGroup({
      plano_id:               new FormControl(''),
      procedimento_id:        new FormControl('', [Validators.required]),
      roldecobertura_id:      new FormControl('', [Validators.required]),
      sequencia:              new FormControl('', [Validators.required]),
      situacao:               new FormControl('', [Validators.required]),

    });
    this.formulario = false;

    this.InserirPlanoxprocedimento =  this.AuthGuard.getPermissao('InserirPlanoxprocedimento');
    this.AlterarPlanoxprocedimento =  this.AuthGuard.getPermissao('AlterarPlanoxprocedimento');
    this.ExcluirPlanoxprocedimento =  this.AuthGuard.getPermissao('ExcluirPlanoxprocedimento');

  }

  ngOnChanges()
  {
    this.todosPlanoxprocedimentos();
  }

  ngOnDestroy() {
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.planoprocedimentoService.obterPlanoxprocedimento(this.id).subscribe(planoxprocedimento => {
        this.planoxprocedimentoForm.patchValue({ procedimento_id: planoxprocedimento.procedimento_id });
        this.planoxprocedimentoForm.patchValue({ roldecobertura_id: planoxprocedimento.roldecobertura_id });
        this.planoxprocedimentoForm.patchValue({ sequencia: planoxprocedimento.sequencia });
        this.planoxprocedimentoForm.patchValue({ situacao: planoxprocedimento.situacao });

      });
    } else {
      this.planoxprocedimentoForm.patchValue({ procedimento_id: '' });
      this.planoxprocedimentoForm.patchValue({ roldecobertura_id: '' });
      this.planoxprocedimentoForm.patchValue({ sequencia: 10 });
      this.planoxprocedimentoForm.patchValue({ situacao: 'Ativo' });


    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  pesquisarPlanoxprocedimentos(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.planoprocedimentoService.pesquisarPlanoxprocedimentos(this.plano_id, offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(planoxprocedimentos => {
          this.planoxprocedimentos = planoxprocedimentos.data;
          this.page_totalElements = planoxprocedimentos.total;
          this.loader.close();
          if (this.planoxprocedimentos.length === 0)
          {
            this.snack.open('Não existe procedimento com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todosPlanoxprocedimentos(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      //this.loader.open();
     this.planoprocedimentoService.todosPlanoxprocedimentos(this.plano_id,offset)
        .subscribe(planoxprocedimentos => {
          this.planoxprocedimentos = planoxprocedimentos.data;
          this.page_totalElements = planoxprocedimentos.total;
          this.loader.close();
          if (this.planoxprocedimentos.length === 0)
          {
            this.snack.open('Não existe nenhum registro de procedimento!', 'OK', { duration: 4000 });
          }
        });

  }


  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todosPlanoxprocedimentos(pageInfo.offset);
    } else {
      this.pesquisarPlanoxprocedimentos(pageInfo.offset);
    }
  }


  submit() {

    this.loader.open();

    this.planoxprocedimentoForm.patchValue({ plano_id: this.plano_id });

    if (this.id > 0)
    {
      this.planoprocedimentoService.atualizarPlanoxprocedimento(this.id, this.planoxprocedimentoForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Procedimento alterado!', 'OK', { duration: 4000 });
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
           this.planoprocedimentoService.adicionarPlanoxprocedimento(this.planoxprocedimentoForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Procedimento adicionado!', 'OK', { duration: 4000 });
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

  removerPlanoxprocedimento(row) {
    this.confirmService.confirm({message: `Excluir Procedimento ${row.procedimento.procedimento}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.planoprocedimentoService.removerPlanoxprocedimento(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Procedimento excluido!', 'OK', { duration: 4000 });
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

  obterProcedimentos() {
    this.planoprocedimentoService.obterProcedimento().subscribe(response => {
      this.procedimentos = response;
    });
  }

  obterRoldecoberturas() {
    this.planoprocedimentoService.obterRoldecobertura().subscribe(response => {
      this.roldecoberturas = response;
    });
  }

}
