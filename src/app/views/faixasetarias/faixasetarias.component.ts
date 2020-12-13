import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../shared/services/app-loader/app-loader.service';
import { FaixaetariaService } from './faixaetaria.service';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-faixasetarias',
  templateUrl: './faixasetarias.component.html',
  styleUrls: ['./faixasetarias.component.scss']
})
export class FaixasetariasComponent implements OnInit {

  public id: number;
  public filterForm: FormGroup;
  public faixaetariaForm: FormGroup;

  public getFaixaetariaSub: Subscription;

  public formulario: boolean;
  public InserirFaixaetaria: boolean;
  public AlterarFaixaetaria: boolean;
  public ExcluirFaixaetaria: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  faixasetarias: any = [];
  situacao: any;
  grupos: any;
  roldecoberturas: any;

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private faixaetariaService: FaixaetariaService,
    private confirmService: AppConfirmService


  ) { }

  ngOnInit() {

    this.page_totalElements = 0;
    this.page_pageNumber = 0;
    this.page_size = 10;

    this.filterForm = new FormGroup({
      search:         new FormControl('', [Validators.required]),
      pesquisarpor:   new FormControl('', [Validators.required])
    });

    this.filterForm.patchValue({ pesquisarpor: 'faixaetaria' });

    this.faixaetariaForm  = new FormGroup({
      idadede:                new FormControl('', [Validators.required]),
      idadeate:               new FormControl('', [Validators.required]),
    });
    this.formulario = false;

    this.InserirFaixaetaria =  this.AuthGuard.getPermissao('InserirFaixaetaria');
    this.AlterarFaixaetaria =  this.AuthGuard.getPermissao('AlterarFaixaetaria');
    this.ExcluirFaixaetaria =  this.AuthGuard.getPermissao('ExcluirFaixaetaria');

  }

  ngOnDestroy() {
    if (this.getFaixaetariaSub) {
      this.getFaixaetariaSub.unsubscribe();
    }
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.faixaetariaService.obterFaixaetaria(this.id).subscribe(faixaetaria => {
        this.faixaetariaForm.patchValue({ idadede: faixaetaria.idadede });
        this.faixaetariaForm.patchValue({ idadeate: faixaetaria.idadeate });
      });
    } else {
      this.faixaetariaForm.patchValue({ idadede: '' });
      this.faixaetariaForm.patchValue({ idadeate: '' });

    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  obterFaixasetarias() {

    this.getFaixaetariaSub = this.faixaetariaService.obterFaixasetarias()
      .subscribe(faixasetarias => {
        this.faixasetarias = faixasetarias;
      });
  }

  pesquisarFaixasetarias(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.faixaetariaService.pesquisarFaixasetarias(offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(faixasetarias => {
          this.faixasetarias = faixasetarias.data;
          this.page_totalElements = faixasetarias.total;
          this.loader.close();
          if (this.faixasetarias.length === 0)
          {
            this.snack.open('Não existe faixa etaria com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todosFaixasetarias(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.faixaetariaService.todosFaixasetarias(offset)
        .subscribe(faixasetarias => {
          this.faixasetarias = faixasetarias.data;
          this.page_totalElements = faixasetarias.total;
          this.loader.close();
          if (this.faixasetarias.length === 0)
          {
            this.snack.open('Não existe nenhum registro!', 'OK', { duration: 4000 });
          }
        });

  }


  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todosFaixasetarias(pageInfo.offset);
    } else {
      this.pesquisarFaixasetarias(pageInfo.offset);
    }
  }


  submit() {

    this.loader.open();

    if (this.id > 0)
    {
      this.faixaetariaService.atualizarFaixaetaria(this.id, this.faixaetariaForm.value)
      .subscribe(data => {
                this.obterFaixasetarias();
                this.loader.close();
                this.snack.open('Faixa etaria alterada!', 'OK', { duration: 4000 });
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
           this.faixaetariaService.adicionarFaixaetaria(this.faixaetariaForm.value)
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

  removerFaixaetaria(row) {
    this.confirmService.confirm({message: `Excluir faixa etária ${row.faixaetaria}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.faixaetariaService.removerFaixaetaria(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Faixa etaria excluido!', 'OK', { duration: 4000 });
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
