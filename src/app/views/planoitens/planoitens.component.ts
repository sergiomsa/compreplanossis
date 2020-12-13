import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../shared/services/app-loader/app-loader.service';
import { PlanoitemService } from './planoitem.service';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-planoitens',
  templateUrl: './planoitens.component.html',
  styleUrls: ['./planoitens.component.scss']
})
export class PlanoitensComponent implements OnInit {

  public id: number;
  public filterForm: FormGroup;
  public planoitemForm: FormGroup;

  public getPlanoitemSub: Subscription;

  public formulario: boolean;
  public InserirPlanoitem: boolean;
  public AlterarPlanoitem: boolean;
  public ExcluirPlanoitem: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  planoitens: any = [];

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private planoitemService: PlanoitemService,
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

    this.filterForm.patchValue({ pesquisarpor: 'item' });

    this.planoitemForm 		= new FormGroup({
      item: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    });
    this.formulario = false;

    this.InserirPlanoitem =  this.AuthGuard.getPermissao('InserirPlanoitem');
    this.AlterarPlanoitem =  this.AuthGuard.getPermissao('AlterarPlanoitem');
    this.ExcluirPlanoitem =  this.AuthGuard.getPermissao('ExcluirPlanoitem');

  }

  ngOnDestroy() {
    if (this.getPlanoitemSub) {
      this.getPlanoitemSub.unsubscribe();
    }
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.planoitemService.obterPlanoitem(this.id).subscribe(planoitem => {
        this.planoitemForm.patchValue({ item: planoitem.item });
      });
    } else {
      this.planoitemForm.patchValue({ item: '' });
    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  obterPlanoitens() {

    this.getPlanoitemSub = this.planoitemService.obterPlanoitens()
      .subscribe(planoitens => {
        this.planoitens = planoitens;
      });
  }

  pesquisarPlanoitens(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.planoitemService.pesquisarPlanoitens(offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(planoitens => {
          this.planoitens = planoitens.data;
          this.page_totalElements = planoitens.total;
          this.loader.close();
          if (this.planoitens.length === 0)
          {
            this.snack.open('Não existe item com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todasPlanoitens(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.planoitemService.todasPlanoitens(offset)
        .subscribe(planoitens => {
          this.planoitens = planoitens.data;
          this.page_totalElements = planoitens.total;
          this.loader.close();
          if (this.planoitens.length === 0)
          {
            this.snack.open('Não existe nenhum registro!', 'OK', { duration: 4000 });
          }
        });
  }

  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todasPlanoitens(pageInfo.offset);
    } else {
      this.pesquisarPlanoitens(pageInfo.offset);
    }
  }

  submit() {

    this.loader.open();

    if (this.id > 0)
    {
      this.planoitemService.atualizarPlanoitem(this.id, this.planoitemForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Item alterado!', 'OK', { duration: 4000 });
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
    } else {
           this.planoitemService.adicionarPlanoitem(this.planoitemForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Item adicionado!', 'OK', { duration: 4000 });
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

  removerPlanoitem(row) {
    this.confirmService.confirm({message: `Excluir ${row.item}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.planoitemService.removerPlanoitem(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Item excluido!', 'OK', { duration: 4000 });
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
