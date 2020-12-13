import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { PlanoxitemService } from './planoxitem.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-planoxitens',
  templateUrl: './planoxitens.component.html',
  styleUrls: ['./planoxitens.component.scss']
})
export class PlanoxitensComponent implements OnInit {

  @Input() plano_id;

  public id: number;
  public filterForm: FormGroup;
  public planoxitemForm: FormGroup;

  public formulario: boolean;
  public InserirPlanoxitem: boolean;
  public AlterarPlanoxitem: boolean;
  public ExcluirPlanoxitem: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  planoxitens: any = [];
  situacao: any;
  itens: any;
  roldecoberturas: any;

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private planoitemService: PlanoxitemService,
    private confirmService: AppConfirmService

  ) { }

  ngOnInit() {
    this.obterItens();
    this.page_totalElements = 0;
    this.page_pageNumber = 0;
    this.page_size = 10;

    this.filterForm = new FormGroup({
      search:         new FormControl('', [Validators.required]),
      pesquisarpor:   new FormControl('', [Validators.required])
    });

    this.filterForm.patchValue({ pesquisarpor: 'situacao' });

    this.planoxitemForm  = new FormGroup({
      plano_id:       new FormControl(''),
      item_id:        new FormControl('', [Validators.required]),
   
    });
    this.formulario = false;

    this.InserirPlanoxitem =  this.AuthGuard.getPermissao('InserirPlanoxitem');
    this.AlterarPlanoxitem =  this.AuthGuard.getPermissao('AlterarPlanoxitem');
    this.ExcluirPlanoxitem =  this.AuthGuard.getPermissao('ExcluirPlanoxitem');

  }

  ngOnChanges()
  {
    this.todosPlanoxitens();
  }

  ngOnDestroy() {
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.planoitemService.obterPlanoxitem(this.id).subscribe(planoxitem => {
        this.planoxitemForm.patchValue({ item_id: planoxitem.item_id });
      });
    } else {
      this.planoxitemForm.patchValue({ item_id: '' });
    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  pesquisarPlanoxitens(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.planoitemService.pesquisarPlanoxitens(this.plano_id, offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(planoxitens => {
          this.planoxitens = planoxitens.data;
          this.page_totalElements = planoxitens.total;
          this.loader.close();
          if (this.planoxitens.length === 0)
          {
            this.snack.open('Não existe item com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todosPlanoxitens(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      //this.loader.open();
     this.planoitemService.todosPlanoxitens(this.plano_id,offset)
        .subscribe(planoxitens => {
          this.planoxitens = planoxitens.data;
          this.page_totalElements = planoxitens.total;
          this.loader.close();
          if (this.planoxitens.length === 0)
          {
            this.snack.open('Não existe nenhum registro de item!', 'OK', { duration: 4000 });
          }
        });

  }


  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todosPlanoxitens(pageInfo.offset);
    } else {
      this.pesquisarPlanoxitens(pageInfo.offset);
    }
  }


  submit() {

    this.loader.open();

    this.planoxitemForm.patchValue({ plano_id: this.plano_id });

    if (this.id > 0)
    {
      this.planoitemService.atualizarPlanoxitem(this.id, this.planoxitemForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Item alterado!', 'OK', { duration: 4000 });
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
           this.planoitemService.adicionarPlanoxitem(this.planoxitemForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Item adicionado!', 'OK', { duration: 4000 });
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

  removerPlanoxitem(row) {
    this.confirmService.confirm({message: `Excluir Item ${row.item.item}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.planoitemService.removerPlanoxitem(row)
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

  obterItens() {
    this.planoitemService.obterItem().subscribe(response => {
      this.itens = response;
    });
  }

}
