import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { PlanoxabrangenciaService } from './planoxabrangencia.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';

@Component({
  selector: 'app-planoxabrangencias',
  templateUrl: './planoxabrangencias.component.html',
  styleUrls: ['./planoxabrangencias.component.scss']
})
export class PlanoxabrangenciasComponent implements OnInit {

  @Input() plano_id;

  public id: number;
  public filterForm: FormGroup;
  public planoxabrangenciaForm: FormGroup;

  public formulario: boolean;
  public InserirPlanoxabrangencia: boolean;
  public AlterarPlanoxabrangencia: boolean;
  public ExcluirPlanoxabrangencia: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  planoxabrangencias: any = [];
  situacao: any;
  abrangencias: any;

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private planoabrangenciaService: PlanoxabrangenciaService,
    private confirmService: AppConfirmService

  ) { }

  ngOnInit() {
    this.obterAbrangencias();

    this.page_totalElements = 0;
    this.page_pageNumber = 0;
    this.page_size = 10;

    this.filterForm = new FormGroup({
      search:         new FormControl('', [Validators.required]),
      pesquisarpor:   new FormControl('', [Validators.required])
    });

    this.filterForm.patchValue({ pesquisarpor: 'abrangencia' });

    this.planoxabrangenciaForm  = new FormGroup({
      plano_id:               new FormControl(''),
      abrangencia_id:         new FormControl('', [Validators.required]),
      valor:                  new FormControl('', [Validators.required]),
      codigo:                 new FormControl('', [Validators.required]),
      situacao:               new FormControl('', [Validators.required]),

    });
    this.formulario = false;

    this.InserirPlanoxabrangencia =  this.AuthGuard.getPermissao('InserirPlanoxabrangencia');
    this.AlterarPlanoxabrangencia =  this.AuthGuard.getPermissao('AlterarPlanoxabrangencia');
    this.ExcluirPlanoxabrangencia =  this.AuthGuard.getPermissao('ExcluirPlanoxabrangencia');

  }

  ngOnChanges()
  {
    this.todosPlanoxabrangencias();
  }

  ngOnDestroy() {
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.planoabrangenciaService.obterPlanoxabrangencia(this.id).subscribe(planoxabrangencia => {
        this.planoxabrangenciaForm.patchValue({ abrangencia_id: planoxabrangencia.abrangencia_id });
        this.planoxabrangenciaForm.patchValue({ valor: planoxabrangencia.valor });
        this.planoxabrangenciaForm.patchValue({ codigo: planoxabrangencia.codigo });
        this.planoxabrangenciaForm.patchValue({ situacao: planoxabrangencia.situacao });

      });
    } else {
      this.planoxabrangenciaForm.patchValue({ abrangencia_id: '' });
      this.planoxabrangenciaForm.patchValue({ valor: '' });
      this.planoxabrangenciaForm.patchValue({ codigo: '' });
      this.planoxabrangenciaForm.patchValue({ situacao: 'Ativo' });


    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  pesquisarPlanoxabrangencias(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
    this.loader.open();
    this.planoabrangenciaService.pesquisarPlanoxabrangencias(this.plano_id, offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(planoxabrangencias => {
          this.planoxabrangencias = planoxabrangencias.data;
          this.page_totalElements = planoxabrangencias.total;
          this.loader.close();
          if (this.planoxabrangencias.length === 0)
          {
            this.snack.open('Não existe faixa etaria com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todosPlanoxabrangencias(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      //this.loader.open();
    this.planoabrangenciaService.todosPlanoxabrangencias(this.plano_id,offset)
        .subscribe(planoxabrangencias => {
          this.planoxabrangencias = planoxabrangencias.data;
          this.page_totalElements = planoxabrangencias.total;
          this.loader.close();
          if (this.planoxabrangencias.length === 0)
          {
            this.snack.open('Não existe nenhum registro de abrangência!', 'OK', { duration: 4000 });
          }
        });

  }


  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todosPlanoxabrangencias(pageInfo.offset);
    } else {
      this.pesquisarPlanoxabrangencias(pageInfo.offset);
    }
  }


  submit() {

    this.loader.open();
    this.planoxabrangenciaForm.patchValue({ plano_id: this.plano_id });

    if (this.id > 0)
    {
      this.planoabrangenciaService.atualizarPlanoxabrangencia(this.id, this.planoxabrangenciaForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Abrangência alterada!', 'OK', { duration: 4000 });
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
           this.planoabrangenciaService.adicionarPlanoxabrangencia(this.planoxabrangenciaForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Abrangência adicionada!', 'OK', { duration: 4000 });
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

  removerPlanoxabrangencia(row) {
    this.confirmService.confirm({message: `Excluir Faixa etária ${row.abrangencia.abrangencia}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.planoabrangenciaService.removerPlanoxabrangencia(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Abrangência excluida!', 'OK', { duration: 4000 });
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

  obterAbrangencias() {
    this.planoabrangenciaService.obterAbrangencia().subscribe(response => {
      this.abrangencias = response;
    });
  }

}
