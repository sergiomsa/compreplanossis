import { AuthService as AuthGuard } from './../../../shared/services/auth/auth.service';
import { Component, OnInit, OnDestroy, NgModule, ViewChild } from '@angular/core';
import { PermissionService } from '../permission.service';
import { MatDialogRef, MatDialog, MatSnackBar, MatAutocomplete,  MatSidenav  } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { NgxTablePopupComponent } from './ngx-table-popup/ngx-table-popup.component';
import { Subscription } from 'rxjs';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { FormControl, FormsModule, FormBuilder, FormGroup,  Validators  } from '@angular/forms';



@Component({
  selector: 'app-permission-ngx-table',
  templateUrl: './permission-ngx-table.component.html',
  animations: egretAnimations
})
export class PermissionNgxTableComponent implements OnInit, OnDestroy {
  public permissions: any = [];
  public getItemSub: Subscription;
  public isSideNavOpen: boolean;
  public InserirPermissao: boolean;
  public AlterarPermissao:  boolean;
  public ExcluirPermissao: boolean;
  public pesquisarpor = 'nome';
  @ViewChild(MatSidenav) private sideNav: MatSidenav;
  public filterForm: FormGroup;
  public situacao = '';
  programas: any = [];
  programa_id: any;

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private permissionService: PermissionService,
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

    this.InserirPermissao =  this.AuthGuard.getPermissao('InserirPermissao');
    this.AlterarPermissao =  this.AuthGuard.getPermissao('AlterarPermissao' );
    this.ExcluirPermissao =  this.AuthGuard.getPermissao('ExcluirPermissao');
    // this.sideNav.opened  = false;
    this.obterProgramas();
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  getItems() {

    this.getItemSub = this.permissionService.getItems()
      .subscribe(data => {
        this.permissions = data;
      });
  }

  openPopUp(data: any = {}, isNew?) {
    const title = isNew ? 'Adicionar Permissão' : 'Alterar Permissão';
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
          this.permissionService.removeItem(row)
            .subscribe(data => {
              this.getItems();
              this.loader.close();
              this.snack.open('Permissão excluida!', 'OK', { duration: 4000 });
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
        this.obterProgramas();
    }
  }

  pesquisarPermissions() {
    this.loader.open();
   this.permissionService.pesquisarPermissions(this.programa_id, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
      .subscribe(data => {
        this.permissions = data;
        this.loader.close();
        if (this.permissions.length === 0)
        // tslint:disable-next-line:one-line
        {
          this.snack.open('Não existe Permissão com a pesquisa escolhida!', 'OK', { duration: 4000 });
        }
      });

  }

  pesquisarSituacao(situacao: any) {

   this.loader.open();
   this.permissionService.pesquisarPermissions(this.programa_id, 'situacao', situacao)
      .subscribe(data => {
        this.permissions = data;
        this.loader.close();
        if (this.permissions.length === 0)
        // tslint:disable-next-line:one-line
        {
          this.snack.open('Não existe Permissão com a situacao escolhida!', 'OK', { duration: 4000 });
        }
      });
  }

  pesquisarPrograma(programa_id)
  // tslint:disable-next-line:one-line
  {

    this.loader.open();
    this.permissionService.pesquisarPermissions(this.programa_id, 'programa_id', programa_id)
       .subscribe(data => {
         this.permissions = data;
         this.loader.close();
         if (this.permissions.length === 0)
         // tslint:disable-next-line:one-line
         {
           this.snack.open('Não existe permissão para o programa escolhido!', 'OK', { duration: 4000 });
         }
       });
   }

  obterProgramas() {
    this.permissionService.obterProgramas().subscribe(response => {
      this.programas = response;
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
