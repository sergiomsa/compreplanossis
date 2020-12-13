import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../shared/services/app-loader/app-loader.service';
import { RoldecoberturaService } from './roldecobertura.service';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rolsdecobertura',
  templateUrl: './rolsdecobertura.component.html',
  styleUrls: ['./rolsdecobertura.component.scss']
})
export class RolsdecoberturaComponent implements OnInit {

  public id: number;
  public filterForm: FormGroup;
  public roldecoberturaForm: FormGroup;

  public getRoldecoberturaSub: Subscription;

  public formulario: boolean;
  public InserirRoldecobertura: boolean;
  public AlterarRoldecobertura: boolean;
  public ExcluirRoldecobertura: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  rolsdecobertura: any = [];

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private roldecoberturaService: RoldecoberturaService,
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

    this.filterForm.patchValue({ pesquisarpor: 'roldecobertura' });

    this.roldecoberturaForm 		= new FormGroup({
      roldecobertura: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    });
    this.formulario = false;

    this.InserirRoldecobertura =  this.AuthGuard.getPermissao('InserirRoldecobertura');
    this.AlterarRoldecobertura =  this.AuthGuard.getPermissao('AlterarRoldecobertura');
    this.ExcluirRoldecobertura =  this.AuthGuard.getPermissao('ExcluirRoldecobertura');

  }

  ngOnDestroy() {
    if (this.getRoldecoberturaSub) {
      this.getRoldecoberturaSub.unsubscribe();
    }
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.roldecoberturaService.obterRoldecobertura(this.id).subscribe(roldecobertura => {
        this.roldecoberturaForm.patchValue({ roldecobertura: roldecobertura.roldecobertura });
      });
    } else {
      this.roldecoberturaForm.patchValue({ roldecobertura: '' });
    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  obterRolsdecobertura() {

    this.getRoldecoberturaSub = this.roldecoberturaService.obterRolsdecobertura()
      .subscribe(rolsdecobertura => {
        this.rolsdecobertura = rolsdecobertura;
      });
  }

  pesquisarRolsdecobertura(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.roldecoberturaService.pesquisarRolsdecobertura(offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(rolsdecobertura => {
          this.rolsdecobertura = rolsdecobertura.data;
          this.page_totalElements = rolsdecobertura.total;
          this.loader.close();
          if (this.rolsdecobertura.length === 0)
          {
            this.snack.open('Não existe rol de cobertura com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todasRolsdecobertura(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.roldecoberturaService.todasRolsdecobertura(offset)
        .subscribe(rolsdecobertura => {
          this.rolsdecobertura = rolsdecobertura.data;
          this.page_totalElements = rolsdecobertura.total;
          this.loader.close();
          if (this.rolsdecobertura.length === 0)
          {
            this.snack.open('Não existe nenhum registro!', 'OK', { duration: 4000 });
          }
        });
  }

  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todasRolsdecobertura(pageInfo.offset);
    } else {
      this.pesquisarRolsdecobertura(pageInfo.offset);
    }
  }

  submit() {

    this.loader.open();

    if (this.id > 0)
    {
      this.roldecoberturaService.atualizarRoldecobertura(this.id, this.roldecoberturaForm.value)
      .subscribe(data => {
                this.obterRolsdecobertura();
                this.loader.close();
                this.snack.open('Rol de cobertura alterada!', 'OK', { duration: 4000 });
                this.formulario = false;
            },
            (error => {
               this.loader.close();
               let message = '';
               if (error.error) {
                  for (const k in error.error)
                  {
                    message += error.error[k];
                    if (+k > 0)
                    { 
                      message += ' | ';
                    }
                  }
               }
               this.snack.open(message, 'OK', { duration: 6000 });
          })
       );
    } else {
           this.roldecoberturaService.adicionarRoldecobertura(this.roldecoberturaForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Rol de cobertura adicionada!', 'OK', { duration: 4000 });
                this.formulario = false;
                this.paginacao({ offset: this.pagina });
              },
              (error => {
                 this.loader.close();
                 let message = '';
                 if (error.error) {
                   for (const k in error.error)
                   {
                     message += error.error[k];
                     if (+k > 0)
                     { 
                       message += ' | ';
                     }
                   }
                 }
                 this.snack.open(message, 'OK', { duration: 6000 });
            })
         );
    }
  }

  removerRoldecobertura(row) {
    this.confirmService.confirm({message: `Excluir ${row.roldecobertura}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.roldecoberturaService.removerRoldecobertura(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Rol de cobertura excluida!', 'OK', { duration: 4000 });
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
