import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../shared/services/app-loader/app-loader.service';
import { GrupoService } from './grupo.service';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.scss']
})
export class GruposComponent implements OnInit {

  public id: number;
  public filterForm: FormGroup;
  public grupoForm: FormGroup;

  public getGrupoSub: Subscription;

  public formulario: boolean;
  public InserirGrupo: boolean;
  public AlterarGrupo: boolean;
  public ExcluirGrupo: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  grupos: any = [];

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private grupoService: GrupoService,
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

    this.filterForm.patchValue({ pesquisarpor: 'grupo' });

    this.grupoForm 		= new FormGroup({
      grupo:     new FormControl('', [Validators.required,Validators.maxLength(100)]),
      descricao: new FormControl('', [Validators.required,Validators.maxLength(200)]),
      carencia:  new FormControl('', [Validators.required]),
      tempo:     new FormControl(),
	    sequencia: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    });
    this.formulario = false;

    this.InserirGrupo =  this.AuthGuard.getPermissao('InserirGrupo');
    this.AlterarGrupo =  this.AuthGuard.getPermissao('AlterarGrupo');
    this.ExcluirGrupo =  this.AuthGuard.getPermissao('ExcluirGrupo');

  }

  ngOnDestroy() {
    if (this.getGrupoSub) {
      this.getGrupoSub.unsubscribe();
    }
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.grupoService.obterGrupo(this.id).subscribe(grupo => {
        this.grupoForm.patchValue({ grupo: grupo.grupo });
        this.grupoForm.patchValue({ descricao: grupo.descricao });
        this.grupoForm.patchValue({ carencia: grupo.carencia });
        this.grupoForm.patchValue({ tempo: grupo.tempo });
		    this.grupoForm.patchValue({ sequencia: grupo.sequencia });
      });
    } else {
      this.grupoForm.patchValue({ grupo: '' });
      this.grupoForm.patchValue({ descricao: '' });
      this.grupoForm.patchValue({ carencia: '' });
      this.grupoForm.patchValue({ tempo: '' });
	    this.grupoForm.patchValue({ sequencia: 10 });
    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  obterGrupos() {

    this.getGrupoSub = this.grupoService.obterGrupos()
      .subscribe(grupos => {
        this.grupos = grupos;
      });
  }

  pesquisarGrupos(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.grupoService.pesquisarGrupos(offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(grupos => {
          this.grupos = grupos.data;
          this.page_totalElements = grupos.total;
          this.loader.close();
          if (this.grupos.length === 0)
          {
            this.snack.open('Não existe grupo com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todasGrupos(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.grupoService.todasGrupos(offset)
        .subscribe(grupos => {
          this.grupos = grupos.data;
          this.page_totalElements = grupos.total;
          this.loader.close();
          if (this.grupos.length === 0)
          {
            this.snack.open('Não existe nenhum registro!', 'OK', { duration: 4000 });
          }
        });
  }

  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todasGrupos(pageInfo.offset);
    } else {
      this.pesquisarGrupos(pageInfo.offset);
    }
  }

  submit() {

    this.loader.open();

    if (this.id > 0)
    {
      this.grupoService.atualizarGrupo(this.id, this.grupoForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Grupo alterado!', 'OK', { duration: 4000 });
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
           this.grupoService.adicionarGrupo(this.grupoForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Grupo adicionado!', 'OK', { duration: 4000 });
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

  removerGrupo(row) {
    this.confirmService.confirm({message: `Excluir ${row.grupo}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.grupoService.removerGrupo(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Grupo excluido!', 'OK', { duration: 4000 });
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
