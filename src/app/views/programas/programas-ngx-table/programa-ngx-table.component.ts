import { AuthService as AuthGuard } from './../../../shared/services/auth/auth.service';
import { Component, OnInit, OnDestroy, NgModule, ViewChild } from '@angular/core';
import { ProgramaService } from '../programa.service';
import { MatDialogRef, MatDialog, MatSnackBar, MatAutocomplete,  MatSidenav  } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { NgxTablePopupComponent } from './ngx-table-popup/ngx-table-popup.component';
import { Subscription } from 'rxjs';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { FormControl, FormsModule, FormBuilder, FormGroup,  Validators  } from '@angular/forms';

@Component({
  selector: 'app-programa-ngx-table',
  templateUrl: './programa-ngx-table.component.html',
  animations: egretAnimations
})
export class ProgramaNgxTableComponent implements OnInit, OnDestroy {
  public programas: any = [];
  public getItemSub: Subscription;
  public isSideNavOpen: boolean;
  public InserirPrograma: boolean;
  public AlterarPrograma: boolean;
  public ExcluirPrograma: boolean;
  public pesquisarpor = 'name';
  @ViewChild(MatSidenav) private sideNav: MatSidenav;
  public filterForm: FormGroup;
  public situacao = '';
  modulos: any = [];
  modulo_id: any;

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private programaService: ProgramaService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private fb: FormBuilder,
    public AuthGuard: AuthGuard
  ) { }

  ngOnInit() {

    this.filterForm = new FormGroup({
      search: new FormControl('', [Validators.required]),
      pesquisarpor: new FormControl('', [Validators.required])
    });

    this.InserirPrograma =  this.AuthGuard.getPermissao('InserirPrograma');
    this.AlterarPrograma =  this.AuthGuard.getPermissao('AlterarPrograma');
    this.ExcluirPrograma =  this.AuthGuard.getPermissao('ExcluirPrograma');
    // this.sideNav.opened  = false;
    this.obterModulos();
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  getItems() {

    this.getItemSub = this.programaService.getItems()
      .subscribe(data => {
        this.programas = data;
      });
  }

  openPopUp(data: any = {}, isNew?) {
    const title = isNew ? 'Adicionar Programa' : 'Alterar Programa';
    const dialogRef: MatDialogRef<any> = this.dialog.open(NgxTablePopupComponent, {
      width: '800px',
      disableClose: true,
      data: { title: title, payload: data }
    });

    dialogRef.afterClosed()
    .subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.getItems();
    });
  }

  deleteItem(row) {
    this.confirmService.confirm({message: `Excluir ${row.name}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.programaService.removeItem(row)
            .subscribe(data => {
              this.getItems();
              this.loader.close();
              this.snack.open('Programa excluido!', 'OK', { duration: 4000 });
            },
            error => {
              this.loader.close();
              this.snack.open(error.error.id[0], 'OK', { duration: 6000 });
            }
          );
        }
      });
  }

  toggleSideNav() {
    this.isSideNavOpen  = !this.isSideNavOpen;
    if (this.isSideNavOpen)
    // tslint:disable-next-line:one-line
    {
        this.obterModulos();
    }
  }

  pesquisarProgramas() {
    this.loader.open();
   this.programaService.pesquisarProgramas(this.modulo_id, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
      .subscribe(data => {
        this.programas = data;
        this.loader.close();
        if (this.programas.length === 0)
        // tslint:disable-next-line:one-line
        {
          this.snack.open('Não existe programa com a pesquisa escolhida!', 'OK', { duration: 4000 });
        }
      });

  }

  pesquisarSituacao(situacao: any) {

   this.loader.open();
   this.programaService.pesquisarProgramas(this.modulo_id, 'situacao', situacao)
      .subscribe(data => {
        this.programas = data;
        this.loader.close();
        if (this.programas.length === 0)
        // tslint:disable-next-line:one-line
        {
          this.snack.open('Não existe programa com a situacao escolhida!', 'OK', { duration: 4000 });
        }
      });
  }

  pesquisarModulo(modulo_id)
  // tslint:disable-next-line:one-line
  {

    this.loader.open();
    this.programaService.pesquisarProgramas(this.modulo_id, 'modulo_id', modulo_id)
       .subscribe(data => {
         this.programas = data;
         this.loader.close();
         if (this.programas.length === 0)
         // tslint:disable-next-line:one-line
         {
           this.snack.open('Não existe Modulo o escolhido!', 'OK', { duration: 4000 });
         }
       });
   }

  obterModulos() {
    this.programaService.obterModulos().subscribe(response => {
      this.modulos = response;
      // tslint:disable-next-line:one-line
      /*2
      if (this.clientes.lenght() === 1){
         this.cliente_id = this.clientes[0].id;
      } else {
         this.cliente_id = 0;
      }
      */
    });
  }


}
