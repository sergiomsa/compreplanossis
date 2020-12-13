import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { PlanoxvigenciaService } from './planoxvigencia.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';

@Component({
  selector: 'app-planoxvigencias',
  templateUrl: './planoxvigencias.component.html',
  styleUrls: ['./planoxvigencias.component.scss']
})
export class PlanoxvigenciasComponent implements OnInit {

  @Input() plano_id;

  public id: number;
  public planoxvigenciaForm: FormGroup;

  public formulario: boolean;
  public InserirPlanoxvigencia: boolean;
  public AlterarPlanoxvigencia: boolean;
  public ExcluirPlanoxvigencia: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  planoxvigencias: any = [];

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private planovigenciaService: PlanoxvigenciaService,
    private confirmService: AppConfirmService

  ) { }

  ngOnInit() {
  
    this.page_totalElements = 0;
    this.page_pageNumber = 0;
    this.page_size = 10;

    this.planoxvigenciaForm  =  new FormGroup({
      plano_id:               	new FormControl(''),
      diavencimento:        	  new FormControl('', [Validators.required]),
      diade:               	 	  new FormControl('', [Validators.required]),
      diaate:               	  new FormControl('', [Validators.required]),
      somanomes:       		  	  new FormControl('', [Validators.required]),
    });

    this.formulario = false;
    this.InserirPlanoxvigencia =  this.AuthGuard.getPermissao('InserirPlanoxvigencia');
    this.AlterarPlanoxvigencia =  this.AuthGuard.getPermissao('AlterarPlanoxvigencia');
    this.ExcluirPlanoxvigencia =  this.AuthGuard.getPermissao('ExcluirPlanoxvigencia');
  }

  ngOnChanges()
  {
    this.todosPlanoxvigencias();
  }

  ngOnDestroy() {
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.planovigenciaService.obterPlanoxvigencia(this.id).subscribe(planoxvigencia => {
        this.planoxvigenciaForm.patchValue({ diavencimento: planoxvigencia.diavencimento });
        this.planoxvigenciaForm.patchValue({ diade: planoxvigencia.diade });
        this.planoxvigenciaForm.patchValue({ diaate: planoxvigencia.diaate });
	      this.planoxvigenciaForm.patchValue({ somanomes: planoxvigencia.somanomes });
      });
    } else {
      this.planoxvigenciaForm.patchValue({ diavencimento: '' });
      this.planoxvigenciaForm.patchValue({ diade: '' });
      this.planoxvigenciaForm.patchValue({ diaate: '' });
	    this.planoxvigenciaForm.patchValue({ somanomes: '' });	
    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  todosPlanoxvigencias(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      //this.loader.open();
    this.planovigenciaService.todosPlanoxvigencias(this.plano_id,offset)
        .subscribe(planoxvigencias => {
          this.planoxvigencias 		  = planoxvigencias.data;
          this.page_totalElements 	= planoxvigencias.total;
          this.loader.close();
          if (this.planoxvigencias.length === 0)
          {
            this.snack.open('Não existe nenhum registro de vigência!', 'OK', { duration: 4000 });
          }
        });

  }

  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
      this.todosPlanoxvigencias(pageInfo.offset);
  }

  submit() {

    this.loader.open();
    this.planoxvigenciaForm.patchValue({ plano_id: this.plano_id });

    if (this.id > 0)
    {
      this.planovigenciaService.atualizarPlanoxvigencia(this.id, this.planoxvigenciaForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Vigência alterada!', 'OK', { duration: 4000 });
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
           this.planovigenciaService.adicionarPlanoxvigencia(this.planoxvigenciaForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Vigência adicionada!', 'OK', { duration: 4000 });
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

  removerPlanoxvigencia(row) {
    this.confirmService.confirm({message: `Excluir vigência  ${row.diavencimento}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.planovigenciaService.removerPlanoxvigencia(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Vigência excluida!', 'OK', { duration: 4000 });
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
