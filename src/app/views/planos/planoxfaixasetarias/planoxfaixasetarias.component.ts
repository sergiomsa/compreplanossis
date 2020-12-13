import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { PlanoxfaixaetariaService } from './planoxfaixaetaria.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-planoxfaixasetarias',
  templateUrl: './planoxfaixasetarias.component.html',
  styleUrls: ['./planoxfaixasetarias.component.scss']
})
export class PlanoxfaixasetariasComponent implements OnInit {

  @Input() plano_id;

  public id: number;
  public filterForm: FormGroup;
  public planoxfaixaetariaForm: FormGroup;

  public formulario: boolean;
  public InserirPlanoxfaixaetaria: boolean;
  public AlterarPlanoxfaixaetaria: boolean;
  public ExcluirPlanoxfaixaetaria: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  planoxfaixasetarias: any = [];
  situacao: any;
  faixasetarias: any;
  abrangencias: any;

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private planofaixaetariaService: PlanoxfaixaetariaService,
    private confirmService: AppConfirmService

  ) { }

  ngOnInit() {

    this.obterFaixasetariasabrangencias();

    this.page_totalElements = 0;
    this.page_pageNumber = 0;
    this.page_size = 10;

    this.filterForm = new FormGroup({
      search:         new FormControl('', [Validators.required]),
      pesquisarpor:   new FormControl('', [Validators.required])
    });

    this.filterForm.patchValue({ pesquisarpor: 'situacao' });

    this.planoxfaixaetariaForm  = new FormGroup({
      plano_id:               new FormControl(''),
      faixaetaria_id:         new FormControl('', [Validators.required]),
	    abrangencia_id:         new FormControl('', [Validators.required]),
      valor:                  new FormControl('', [Validators.required]),
      codigo:                 new FormControl('', [Validators.required]),
      situacao:               new FormControl('', [Validators.required]),

    });
    this.formulario = false;

    this.InserirPlanoxfaixaetaria =  this.AuthGuard.getPermissao('InserirPlanoxfaixaetaria');
    this.AlterarPlanoxfaixaetaria =  this.AuthGuard.getPermissao('AlterarPlanoxfaixaetaria');
    this.ExcluirPlanoxfaixaetaria =  this.AuthGuard.getPermissao('ExcluirPlanoxfaixaetaria');

  }

  ngOnChanges()
  {
    this.todosPlanoxfaixasetarias();
  }

  ngOnDestroy() {
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;
    this.obterFaixasetariasabrangencias();

    if (this.id > 0)
    {
      this.planofaixaetariaService.obterPlanoxfaixaetaria(this.id).subscribe(planoxfaixaetaria => {
        this.planoxfaixaetariaForm.patchValue({ faixaetaria_id: planoxfaixaetaria.faixaetaria_id });
		    this.planoxfaixaetariaForm.patchValue({ abrangencia_id: planoxfaixaetaria.abrangencia_id });
        this.planoxfaixaetariaForm.patchValue({ valor: planoxfaixaetaria.valor });
        this.planoxfaixaetariaForm.patchValue({ codigo: planoxfaixaetaria.codigo });
        this.planoxfaixaetariaForm.patchValue({ situacao: planoxfaixaetaria.situacao });
      });
    } else {
      this.planoxfaixaetariaForm.patchValue({ faixaetaria_id: '' });
	    this.planoxfaixaetariaForm.patchValue({ abrangencia_id: '' });
      this.planoxfaixaetariaForm.patchValue({ valor: '' });
      this.planoxfaixaetariaForm.patchValue({ codigo: '' });
      this.planoxfaixaetariaForm.patchValue({ situacao: 'Ativo' });
    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  pesquisarPlanoxfaixasetarias(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.planofaixaetariaService.pesquisarPlanoxfaixasetarias(this.plano_id, offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(planoxfaixasetarias => {
          this.planoxfaixasetarias = planoxfaixasetarias.data;
          this.page_totalElements = planoxfaixasetarias.total;
          this.loader.close();
          if (this.planoxfaixasetarias.length === 0)
          {
            this.snack.open('Não existe faixa etaria com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todosPlanoxfaixasetarias(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      //this.loader.open();
     this.planofaixaetariaService.todosPlanoxfaixasetarias(this.plano_id,offset)
        .subscribe(planoxfaixasetarias => {
          this.planoxfaixasetarias  = planoxfaixasetarias.data;
          this.page_totalElements   = planoxfaixasetarias.total;
          this.loader.close();
          if (this.planoxfaixasetarias.length === 0)
          {
            this.snack.open('Não existe nenhum registro de faixa etária!', 'OK', { duration: 4000 });
          }
        });

  }


  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todosPlanoxfaixasetarias(pageInfo.offset);
    } else {
      this.pesquisarPlanoxfaixasetarias(pageInfo.offset);
    }
  }


  submit() {

    this.loader.open();

    this.planoxfaixaetariaForm.patchValue({ plano_id: this.plano_id });

    if (this.id > 0)
    {
      this.planofaixaetariaService.atualizarPlanoxfaixaetaria(this.id, this.planoxfaixaetariaForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Faixa etaria alterada!', 'OK', { duration: 4000 });
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
           this.planofaixaetariaService.adicionarPlanoxfaixaetaria(this.planoxfaixaetariaForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Faixa etaria adicionada!', 'OK', { duration: 4000 });
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

  removerPlanoxfaixaetaria(row) {
    this.confirmService.confirm({message: `Excluir Faixa etária ${row.faixaetaria.faixaetaria}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.planofaixaetariaService.removerPlanoxfaixaetaria(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Faixa etaria excluida!', 'OK', { duration: 4000 });
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

  obterFaixasetariasabrangencias() {
    this.planofaixaetariaService.obterFaixaetariasabrangencias().subscribe(response => {
     
      this.faixasetarias 	= response.faixaetarias;
      this.abrangencias 	= response.abrangencias;
    
    });
  }

}
