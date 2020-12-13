import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { PlanoxcarenciaService } from './planoxcarencia.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-planoxcarencias',
  templateUrl: './planoxcarencias.component.html',
  styleUrls: ['./planoxcarencias.component.scss']
})
export class PlanoxcarenciasComponent implements OnInit {

  @Input() plano_id;

  public id: number;
  public filterForm: FormGroup;
  public planoxcarenciaForm: FormGroup;

  public formulario: boolean;
  public InserirPlanoxcarencia: boolean;
  public AlterarPlanoxcarencia: boolean;
  public ExcluirPlanoxcarencia: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  planoxcarencias: any = [];
  situacao: any;
  procedimentos: any;

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private planocarenciaService: PlanoxcarenciaService,
    private confirmService: AppConfirmService

  ) { }

  ngOnInit() {
    this.obterProcedimentos();

    this.page_totalElements = 0;
    this.page_pageNumber = 0;
    this.page_size = 10;

    this.filterForm = new FormGroup({
      search:         new FormControl('', [Validators.required]),
      pesquisarpor:   new FormControl('', [Validators.required])
    });

    this.filterForm.patchValue({ pesquisarpor: 'carencia' });

    this.planoxcarenciaForm  = new FormGroup({
      plano_id:               new FormControl(''),
      procedimento_id:        new FormControl('', [Validators.required]),
      carencia:               new FormControl('', [Validators.required]),
      tempo:                  new FormControl('', [Validators.required]),

    });
    this.formulario = false;

    this.InserirPlanoxcarencia =  this.AuthGuard.getPermissao('InserirPlanoxcarencia');
    this.AlterarPlanoxcarencia =  this.AuthGuard.getPermissao('AlterarPlanoxcarencia');
    this.ExcluirPlanoxcarencia =  this.AuthGuard.getPermissao('ExcluirPlanoxcarencia');

  }

  ngOnChanges()
  {
    this.todosPlanoxcarencias();
  }

  ngOnDestroy() {
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.planocarenciaService.obterPlanoxcarencia(this.id).subscribe(planoxcarencia => {
        this.planoxcarenciaForm.patchValue({ procedimento_id: planoxcarencia.procedimento_id });
        this.planoxcarenciaForm.patchValue({ carencia: planoxcarencia.carencia });
        this.planoxcarenciaForm.patchValue({ tempo: planoxcarencia.tempo });

      });
    } else {
      this.planoxcarenciaForm.patchValue({ procedimento_id: '' });
      this.planoxcarenciaForm.patchValue({ carencia: '' });
      this.planoxcarenciaForm.patchValue({ tempo: '' });


    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  pesquisarPlanoxcarencias(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.planocarenciaService.pesquisarPlanoxcarencias(this.plano_id, offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(planoxcarencias => {
          this.planoxcarencias = planoxcarencias.data;
          this.page_totalElements = planoxcarencias.total;
          this.loader.close();
          if (this.planoxcarencias.length === 0)
          {
            this.snack.open('Não existe carência com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todosPlanoxcarencias(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      //this.loader.open();
     this.planocarenciaService.todosPlanoxcarencias(this.plano_id,offset)
        .subscribe(planoxcarencias => {
          this.planoxcarencias = planoxcarencias.data;
          this.page_totalElements = planoxcarencias.total;
          this.loader.close();
          if (this.planoxcarencias.length === 0)
          {
            this.snack.open('Não existe nenhum registro de carência!', 'OK', { duration: 4000 });
          }
        });

  }


  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todosPlanoxcarencias(pageInfo.offset);
    } else {
      this.pesquisarPlanoxcarencias(pageInfo.offset);
    }
  }


  submit() {

    this.loader.open();

    this.planoxcarenciaForm.patchValue({ plano_id: this.plano_id });

    if (this.id > 0)
    {
      this.planocarenciaService.atualizarPlanoxcarencia(this.id, this.planoxcarenciaForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Carência alterada!', 'OK', { duration: 4000 });
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
           this.planocarenciaService.adicionarPlanoxcarencia(this.planoxcarenciaForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Carência adicionada!', 'OK', { duration: 4000 });
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

  removerPlanoxcarencia(row) {
    this.confirmService.confirm({message: `Excluir Carência ${row.dcarencia}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.planocarenciaService.removerPlanoxcarencia(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Carência excluida!', 'OK', { duration: 4000 });
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
    this.planocarenciaService.obterProcedimento().subscribe(response => {
      this.procedimentos = response;
    });
  }

}
