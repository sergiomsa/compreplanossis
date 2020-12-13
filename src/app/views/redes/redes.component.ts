import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { AuthService as AuthGuard } from '../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../shared/services/app-loader/app-loader.service';
import { RedeService } from './rede.service';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-redes',
  templateUrl: './redes.component.html',
  styleUrls: ['./redes.component.scss']
})
export class RedesComponent implements OnInit {

  public id: number;
  public filterForm: FormGroup;
  public redeForm: FormGroup;

  public getRedeSub: Subscription;

  public formulario: boolean;
  public InserirRede: boolean;
  public AlterarRede: boolean;
  public ExcluirRede: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  redes: any = [];

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private redeService: RedeService,
    private confirmService: AppConfirmService

  ) { }

  ngOnInit() {

    this.page_totalElements = 0;
    this.page_pageNumber 	  = 0;
    this.page_size 			    = 10;

    this.filterForm 		    = new FormGroup({
      search: new FormControl('', [Validators.required]),
      pesquisarpor: new FormControl('', [Validators.required])
    });

    this.filterForm.patchValue({ pesquisarpor: 'rede' });

    this.redeForm 		= new FormGroup({
      rede: new FormControl('', [Validators.required,Validators.maxLength(100)]),
	    url:  new FormControl('', [Validators.required,CustomValidators.url]),
    });

    this.formulario   = false;
    this.InserirRede  =  this.AuthGuard.getPermissao('InserirRede');
    this.AlterarRede  =  this.AuthGuard.getPermissao('AlterarRede');
    this.ExcluirRede  =  this.AuthGuard.getPermissao('ExcluirRede');

  }

  ngOnDestroy() {
    if (this.getRedeSub) {
      this.getRedeSub.unsubscribe();
    }
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.redeService.obterRede(this.id).subscribe(rede => {
        this.redeForm.patchValue({ rede: rede.rede });
		this.redeForm.patchValue({ url: rede.url });
      });
    } else {
      this.redeForm.patchValue({ rede: '' });
	  this.redeForm.patchValue({ url: '' });
    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  obterRedes() {

    this.getRedeSub = this.redeService.obterRedes()
      .subscribe(redes => {
        this.redes = redes;
      });
  }

  pesquisarRedes(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.redeService.pesquisarRedes(offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(redes => {
          this.redes = redes.data;
          this.page_totalElements = redes.total;
          this.loader.close();
          if (this.redes.length === 0)
          {
            this.snack.open('Não existe rede com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todasRedes(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.redeService.todasRedes(offset)
        .subscribe(redes => {
          this.redes = redes.data;
          this.page_totalElements = redes.total;
          this.loader.close();
          if (this.redes.length === 0)
          {
            this.snack.open('Não existe nenhum registro!', 'OK', { duration: 4000 });
          }
        });
  }

  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todasRedes(pageInfo.offset);
    } else {
      this.pesquisarRedes(pageInfo.offset);
    }
  }

  submit() {

    this.loader.open();

    if (this.id > 0)
    {
      this.redeService.atualizarRede(this.id, this.redeForm.value)
      .subscribe(data => {
                this.obterRedes();
                this.loader.close();
                this.snack.open('Rede alterada!', 'OK', { duration: 4000 });
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
           this.redeService.adicionarRede(this.redeForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Rede adicionada!', 'OK', { duration: 4000 });
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

  removerRede(row) {
    this.confirmService.confirm({message: `Excluir ${row.rede}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.redeService.removerRede(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Rede excluida!', 'OK', { duration: 4000 });
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
