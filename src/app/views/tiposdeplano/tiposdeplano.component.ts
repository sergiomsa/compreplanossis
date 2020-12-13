import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../shared/services/app-loader/app-loader.service';
import { TipodeplanoService } from './tipodeplano.service';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tiposdeplano',
  templateUrl: './tiposdeplano.component.html',
  styleUrls: ['./tiposdeplano.component.scss']
})
export class TiposdeplanoComponent implements OnInit {

  public id: number;
  public filterForm: FormGroup;
  public tipodeplanoForm: FormGroup;

  public getTipodeplanoSub: Subscription;

  public formulario: boolean;
  public InserirTipodeplano: boolean;
  public AlterarTipodeplano: boolean;
  public ExcluirTipodeplano: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  tiposdeplano: any = [];

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private tipodeplanoService: TipodeplanoService,
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

    this.filterForm.patchValue({ pesquisarpor: 'tipodeplano' });

    this.tipodeplanoForm 		= new FormGroup({
      tipodeplano: new FormControl('', [Validators.required,Validators.maxLength(100)]),
      carenciapor: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    });
    this.formulario = false;

    this.InserirTipodeplano =  this.AuthGuard.getPermissao('InserirTipodeplano');
    this.AlterarTipodeplano =  this.AuthGuard.getPermissao('AlterarTipodeplano');
    this.ExcluirTipodeplano =  this.AuthGuard.getPermissao('ExcluirTipodeplano');

  }

  ngOnDestroy() {
    if (this.getTipodeplanoSub) {
      this.getTipodeplanoSub.unsubscribe();
    }
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.tipodeplanoService.obterTipodeplano(this.id).subscribe(tipodeplano => {
        this.tipodeplanoForm.patchValue({ tipodeplano: tipodeplano.tipodeplano });
        this.tipodeplanoForm.patchValue({ carenciapor: tipodeplano.carenciapor });
      });
    } else {
      this.tipodeplanoForm.patchValue({ tipodeplano: '' });
      this.tipodeplanoForm.patchValue({ carenciapor: '' });
    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  obterTiposdeplano() {

    this.getTipodeplanoSub = this.tipodeplanoService.obterTiposdeplano()
      .subscribe(tiposdeplano => {
        this.tiposdeplano = tiposdeplano;
      });
  }

  pesquisarTiposdeplano(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.tipodeplanoService.pesquisarTiposdeplano(offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(tiposdeplano => {
          this.tiposdeplano = tiposdeplano.data;
          this.page_totalElements = tiposdeplano.total;
          this.loader.close();
          if (this.tiposdeplano.length === 0)
          {
            this.snack.open('Não existe tipo de plano com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todasTiposdeplano(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.tipodeplanoService.todasTiposdeplano(offset)
        .subscribe(tiposdeplano => {
          this.tiposdeplano = tiposdeplano.data;
          this.page_totalElements = tiposdeplano.total;
          this.loader.close();
          if (this.tiposdeplano.length === 0)
          {
            this.snack.open('Não existe nenhum registro!', 'OK', { duration: 4000 });
          }
        });
  }

  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todasTiposdeplano(pageInfo.offset);
    } else {
      this.pesquisarTiposdeplano(pageInfo.offset);
    }
  }

  submit() {

    this.loader.open();

    if (this.id > 0)
    {
      this.tipodeplanoService.atualizarTipodeplano(this.id, this.tipodeplanoForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Tipo de plano alterado!', 'OK', { duration: 4000 });
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
           this.tipodeplanoService.adicionarTipodeplano(this.tipodeplanoForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Tipo de plano adicionado!', 'OK', { duration: 4000 });
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

  removerTipodeplano(row) {
    this.confirmService.confirm({message: `Excluir ${row.tipodeplano}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.tipodeplanoService.removerTipodeplano(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Tipo de plano excluido!', 'OK', { duration: 4000 });
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
