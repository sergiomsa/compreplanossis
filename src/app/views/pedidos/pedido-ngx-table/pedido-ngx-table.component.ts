import { Component, OnInit, ViewChild} from '@angular/core';
import { PedidoService } from '../pedido.service';
import { MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';
import { BoletoPopupComponent } from './boleto-popup/boleto-popup.component';

@Component({
  selector: 'app-pedido-ngx-table',
  templateUrl: './pedido-ngx-table.component.html',
  styleUrls: ['./pedido-ngx-table.component.css'],
  animations: egretAnimations,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class PedidoNgxTableComponent implements OnInit {

  @ViewChild('TablePedido') TablePedido: any;

  public pedidos: any = [];
  public isSideNavOpen: boolean;
  public filterForm: FormGroup;
  public filter1Form: FormGroup;
  public minDate = new Date(2000, 0, 1);
  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;
  public datainicio: any;
  public datafim: any;
  public messages = { emptyMessage: 'Nenhum registro', loadingMessage: 'Carregando', totalMessage: 'registro(s)', selectedMessage: 'selecionado(s)' };

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private pedidoService: PedidoService,
    private loader: AppLoaderService
  ) { }

  ngOnInit() {

    this.page_totalElements       = 0;
    this.page_pageNumber          = 0;
    this.page_size                = 10;

    this.filter1Form              = new FormGroup({
      status:                     new FormControl('', [Validators.required]),
      payment_method:             new FormControl('', [Validators.required]),
      datainicio:                 new FormControl('', [Validators.required, CustomValidators.date]),
      datafim:                    new FormControl('', [Validators.required, CustomValidators.date]),
    });

    this.datainicio             = '2018-08-01';
    this.datafim                = '2999-12-31';

    this.filter1Form.patchValue({ status: '99' });
    this.filter1Form.patchValue({ payment_method: '99' });
    this.filter1Form.patchValue({ datainicio: this.datainicio });
    this.filter1Form.patchValue({ datafim: this.datafim });

    this.filter1Form.controls['datainicio'].valueChanges.subscribe(
      (selectedValue) => {
        this.datainicio = selectedValue.format('YYYY-MM-DD');
      }
    );

    this.filter1Form.controls['datafim'].valueChanges.subscribe(
      (selectedValue) => {
        this.datafim = selectedValue.format('YYYY-MM-DD');
      }
    );

    this.filterForm             = new FormGroup({
      pesquisarpor: new FormControl('', [Validators.required]),
      search: new FormControl()
    });

    this.filterForm.patchValue({ pesquisarpor: '' });

  }

  paginacao(pageInfo) {
    this.pesquisarPedidos(pageInfo.offset);
  }

  toggleSideNav() {
    this.isSideNavOpen = !this.isSideNavOpen;
  }

  pesquisarPedidos(offset = 0) 
  {
    offset = offset + 1;
   
    //this.loader.open();
    const pesquisa = {
      campo: this.filterForm.value.pesquisarpor,
      conteudo: this.filterForm.value.search,
      status: this.filter1Form.value.status,
      payment_method: this.filter1Form.value.payment_method,
      datainicio: this.datainicio,
      datafim: this.datafim,
      pagina: offset,
    }

    this.pedidoService.pesquisarPedidos(pesquisa)
      .subscribe(response => {
        this.pedidos            = response.data;
        this.page_totalElements = response.total;
        //this.loader.close();
        if (this.pedidos.length === 0) {
          this.snack.open('Não existe pedidos com a pesquisa escolhida!', 'OK', { duration: 4000 });
        } else {
          this.isSideNavOpen = false;
        }
      });
  }

  exportarPedidos() 
  {
    this.loader.open();
    const pesquisa = {
      campo: this.filterForm.value.pesquisarpor,
      conteudo: this.filterForm.value.search,
      status: this.filter1Form.value.status,
      payment_method: this.filter1Form.value.payment_method,
      datainicio: this.datainicio,
      datafim: this.datafim
    }

    this.pedidoService.exportarPedidos(pesquisa)
        .subscribe(response=> {
       let blob 	= new Blob([response], {type: 'application/vnd.ms-office'});
       this.loader.close();
         FileSaver.saveAs(blob, 'pedidos.xls');
       });
  }

  toggleExpandRow(row) {
    this.TablePedido.rowDetail.toggleExpandRow(row);
  }
  
  onDetailToggle(event) {
    
  }

  enviarEmail(id) 
  {
    this.loader.open();
    this.pedidoService.enviarEmail(id)
    .subscribe(response => {
      this.loader.close();
      this.snack.open('Documentação enviada para o email: '+response, 'OK', { duration: 4000 });
    });
  }

  enviarCadastro(id) 
  {
    this.loader.open();
    this.pedidoService.enviarCadastro(id)
    .subscribe(response => {
      this.loader.close();
      this.snack.open('Situação atualizada: ', 'OK', { duration: 4000 });
    });
  }

  onSelectPedido(payment_link) 
  {

      const dialogRef: MatDialogRef<any> = this.dialog.open(BoletoPopupComponent, {
        width: '800px',
        disableClose: true,
        data: payment_link
      });
      dialogRef.afterClosed()
        .subscribe(res => {
          if (!res) {
            return;
          }
        });
   }
}