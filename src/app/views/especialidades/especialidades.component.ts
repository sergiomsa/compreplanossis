import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../shared/services/app-loader/app-loader.service';
import { EspecialidadeService } from './especialidade.service';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-especialidades',
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.scss']
})
export class EspecialidadesComponent implements OnInit {

  public id: number;
  public filterForm: FormGroup;
  public especialidadeForm: FormGroup;

  public getEspecialidadeSub: Subscription;

  public formulario: boolean;
  public InserirEspecialidade: boolean;
  public AlterarEspecialidade: boolean;
  public ExcluirEspecialidade: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  especialidades: any = [];

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private especialidadeService: EspecialidadeService,
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

    this.filterForm.patchValue({ pesquisarpor: 'especialidade' });

    this.especialidadeForm 		= new FormGroup({
      especialidade: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    });
    this.formulario = false;

    this.InserirEspecialidade =  this.AuthGuard.getPermissao('InserirEspecialidade');
    this.AlterarEspecialidade =  this.AuthGuard.getPermissao('AlterarEspecialidade');
    this.ExcluirEspecialidade =  this.AuthGuard.getPermissao('ExcluirEspecialidade');

  }

  ngOnDestroy() {
    if (this.getEspecialidadeSub) {
      this.getEspecialidadeSub.unsubscribe();
    }
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.especialidadeService.obterEspecialidade(this.id).subscribe(especialidade => {
        this.especialidadeForm.patchValue({ especialidade: especialidade.especialidade });
      });
    } else {
      this.especialidadeForm.patchValue({ especialidade: '' });
    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  obterEspecialidades() {

    this.getEspecialidadeSub = this.especialidadeService.obterEspecialidades()
      .subscribe(especialidades => {
        this.especialidades = especialidades;
      });
  }

  pesquisarEspecialidades(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.especialidadeService.pesquisarEspecialidades(offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(especialidades => {
          this.especialidades = especialidades.data;
          this.page_totalElements = especialidades.total;
          this.loader.close();
          if (this.especialidades.length === 0)
          {
            this.snack.open('Não existe especialidade com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todasEspecialidades(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.especialidadeService.todasEspecialidades(offset)
        .subscribe(especialidades => {
          this.especialidades = especialidades.data;
          this.page_totalElements = especialidades.total;
          this.loader.close();
          if (this.especialidades.length === 0)
          {
            this.snack.open('Não existe nenhum registro!', 'OK', { duration: 4000 });
          }
        });
  }

  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todasEspecialidades(pageInfo.offset);
    } else {
      this.pesquisarEspecialidades(pageInfo.offset);
    }
  }

  submit() {

    this.loader.open();

    if (this.id > 0)
    {
      this.especialidadeService.atualizarEspecialidade(this.id, this.especialidadeForm.value)
      .subscribe(data => {
                this.obterEspecialidades();
                this.loader.close();
                this.snack.open('Especialidade alterada!', 'OK', { duration: 4000 });
                this.formulario = false;
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
           this.especialidadeService.adicionarEspecialidade(this.especialidadeForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Especialidade adicionada!', 'OK', { duration: 4000 });
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

  removerEspecialidade(row) {
    this.confirmService.confirm({message: `Excluir ${row.especialidade}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.especialidadeService.removerEspecialidade(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Especialidade excluida!', 'OK', { duration: 4000 });
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
