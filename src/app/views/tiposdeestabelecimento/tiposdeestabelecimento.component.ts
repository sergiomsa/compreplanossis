import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../shared/services/app-loader/app-loader.service';
import { TipodeestabelecimentoService } from './tipodeestabelecimento.service';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tiposdeestabelecimento',
  templateUrl: './tiposdeestabelecimento.component.html',
  styleUrls: ['./tiposdeestabelecimento.component.scss']
})
export class TiposdeestabelecimentoComponent implements OnInit {

  public id: number;
  public filterForm: FormGroup;
  public tipodeestabelecimentoForm: FormGroup;

  public getTipodeestabelecimentoSub: Subscription;

  public formulario: boolean;
  public InserirTipodeestabelecimento: boolean;
  public AlterarTipodeestabelecimento: boolean;
  public ExcluirTipodeestabelecimento: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  tiposdeestabelecimento: any = [];

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private tipodeestabelecimentoService: TipodeestabelecimentoService,
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

    this.filterForm.patchValue({ pesquisarpor: 'tipodeestabelecimento' });

    this.tipodeestabelecimentoForm 		= new FormGroup({
      tipodeestabelecimento: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    });
    this.formulario = false;

    this.InserirTipodeestabelecimento =  this.AuthGuard.getPermissao('InserirTipodeestabelecimento');
    this.AlterarTipodeestabelecimento =  this.AuthGuard.getPermissao('AlterarTipodeestabelecimento');
    this.ExcluirTipodeestabelecimento =  this.AuthGuard.getPermissao('ExcluirTipodeestabelecimento');

  }

  ngOnDestroy() {
    if (this.getTipodeestabelecimentoSub) {
      this.getTipodeestabelecimentoSub.unsubscribe();
    }
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.tipodeestabelecimentoService.obterTipodeestabelecimento(this.id).subscribe(tipodeestabelecimento => {
        this.tipodeestabelecimentoForm.patchValue({ tipodeestabelecimento: tipodeestabelecimento.tipodeestabelecimento });
      });
    } else {
      this.tipodeestabelecimentoForm.patchValue({ tipodeestabelecimento: '' });
    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  obterTiposdeestabelecimento() {

    this.getTipodeestabelecimentoSub = this.tipodeestabelecimentoService.obterTiposdeestabelecimento()
      .subscribe(tiposdeestabelecimento => {
        this.tiposdeestabelecimento = tiposdeestabelecimento;
      });
  }

  pesquisarTiposdeestabelecimento(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.tipodeestabelecimentoService.pesquisarTiposdeestabelecimento(offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(tiposdeestabelecimento => {
          this.tiposdeestabelecimento = tiposdeestabelecimento.data;
          this.page_totalElements = tiposdeestabelecimento.total;
          this.loader.close();
          if (this.tiposdeestabelecimento.length === 0)
          {
            this.snack.open('Não existe tipodeestabelecimento com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todasTiposdeestabelecimento(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.tipodeestabelecimentoService.todasTiposdeestabelecimento(offset)
        .subscribe(tiposdeestabelecimento => {
          this.tiposdeestabelecimento = tiposdeestabelecimento.data;
          this.page_totalElements = tiposdeestabelecimento.total;
          this.loader.close();
          if (this.tiposdeestabelecimento.length === 0)
          {
            this.snack.open('Não existe nenhum registro!', 'OK', { duration: 4000 });
          }
        });
  }

  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todasTiposdeestabelecimento(pageInfo.offset);
    } else {
      this.pesquisarTiposdeestabelecimento(pageInfo.offset);
    }
  }

  submit() {

    this.loader.open();

    if (this.id > 0)
    {
      this.tipodeestabelecimentoService.atualizarTipodeestabelecimento(this.id, this.tipodeestabelecimentoForm.value)
      .subscribe(data => {
                this.obterTiposdeestabelecimento();
                this.loader.close();
                this.snack.open('Tipo de estabelecimento alterado!', 'OK', { duration: 4000 });
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
           this.tipodeestabelecimentoService.adicionarTipodeestabelecimento(this.tipodeestabelecimentoForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Tipo de estabelecimento adicionado!', 'OK', { duration: 4000 });
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

  removerTipodeestabelecimento(row) {
    this.confirmService.confirm({message: `Excluir ${row.tipodeestabelecimento}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.tipodeestabelecimentoService.removerTipodeestabelecimento(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Tipo de estabelecimento excluido!', 'OK', { duration: 4000 });
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
