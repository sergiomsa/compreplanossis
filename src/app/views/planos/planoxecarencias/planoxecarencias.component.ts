import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { PlanoxecarenciaService } from './planoxecarencia.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-planoxecarencias',
  templateUrl: './planoxecarencias.component.html',
  styleUrls: ['./planoxecarencias.component.scss']
})
export class PlanoxecarenciasComponent implements OnInit {

  @Input() plano_id;

  public id: number;
  public filterForm: FormGroup;
  public planoxecarenciaForm: FormGroup;

  public formulario: boolean;
  public InserirPlanoxecarencia: boolean;
  public AlterarPlanoxecarencia: boolean;
  public ExcluirPlanoxecarencia: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  planoxecarencias: any = [];
  situacao: any;
  grupos: any;

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private planocarenciaService: PlanoxecarenciaService,
    private confirmService: AppConfirmService

  ) { }

  ngOnInit() {
    this.obterGrupos();

    this.page_totalElements = 0;
    this.page_pageNumber = 0;
    this.page_size = 10;

    this.filterForm = new FormGroup({
      search:         new FormControl('', [Validators.required]),
      pesquisarpor:   new FormControl('', [Validators.required])
    });

    this.filterForm.patchValue({ pesquisarpor: 'carencia' });

    this.planoxecarenciaForm  = new FormGroup({
      plano_id:               new FormControl(''),
      grupo_id:        		  new FormControl('', [Validators.required]),
      carencia:               new FormControl('', [Validators.required]),
      tempo:                  new FormControl('', [Validators.required]),

    });
    this.formulario = false;

    this.InserirPlanoxecarencia =  this.AuthGuard.getPermissao('InserirPlanoxecarencia');
    this.AlterarPlanoxecarencia =  this.AuthGuard.getPermissao('AlterarPlanoxecarencia');
    this.ExcluirPlanoxecarencia =  this.AuthGuard.getPermissao('ExcluirPlanoxecarencia');

  }

  ngOnChanges()
  {
    this.todosPlanoxecarencias();
  }

  ngOnDestroy() {
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.planocarenciaService.obterPlanoxecarencia(this.id).subscribe(planoxecarencia => {
        this.planoxecarenciaForm.patchValue({ grupo_id: planoxecarencia.grupo_id });
        this.planoxecarenciaForm.patchValue({ carencia: planoxecarencia.carencia });
        this.planoxecarenciaForm.patchValue({ tempo: planoxecarencia.tempo });

      });
    } else {
      this.planoxecarenciaForm.patchValue({ grupo_id: '' });
      this.planoxecarenciaForm.patchValue({ carencia: '' });
      this.planoxecarenciaForm.patchValue({ tempo: '' });


    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  pesquisarPlanoxecarencias(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.planocarenciaService.pesquisarPlanoxecarencias(this.plano_id, offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(planoxecarencias => {
          this.planoxecarencias = planoxecarencias.data;
          this.page_totalElements = planoxecarencias.total;
          this.loader.close();
          if (this.planoxecarencias.length === 0)
          {
            this.snack.open('Não existe carência com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todosPlanoxecarencias(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      //this.loader.open();
     this.planocarenciaService.todosPlanoxecarencias(this.plano_id,offset)
        .subscribe(planoxecarencias => {
          this.planoxecarencias = planoxecarencias.data;
          this.page_totalElements = planoxecarencias.total;
          this.loader.close();
          if (this.planoxecarencias.length === 0)
          {
            this.snack.open('Não existe nenhum registro de carência!', 'OK', { duration: 4000 });
          }
        });

  }


  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todosPlanoxecarencias(pageInfo.offset);
    } else {
      this.pesquisarPlanoxecarencias(pageInfo.offset);
    }
  }


  submit() {

    this.loader.open();

    this.planoxecarenciaForm.patchValue({ plano_id: this.plano_id });

    if (this.id > 0)
    {
      this.planocarenciaService.atualizarPlanoxecarencia(this.id, this.planoxecarenciaForm.value)
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
           this.planocarenciaService.adicionarPlanoxecarencia(this.planoxecarenciaForm.value)
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

  removerPlanoxecarencia(row) {
    this.confirmService.confirm({message: `Excluir Carência ${row.dcarencia}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.planocarenciaService.removerPlanoxecarencia(row)
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

  obterGrupos() {
    this.planocarenciaService.obterGrupo().subscribe(response => {
      this.grupos = response;
    });
  }

}
