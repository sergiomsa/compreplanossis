import { AuthService as AuthGuard } from './../../../shared/services/auth/auth.service';
import { Component, OnInit, OnDestroy, NgModule, ViewChild } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { MatDialogRef, MatDialog, MatSnackBar, MatAutocomplete,  MatSidenav  } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { NgxTablePopupComponent } from './ngx-table-popup/ngx-table-popup.component';
import { Subscription } from 'rxjs';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { FormControl, FormsModule, FormBuilder, FormGroup,  Validators  } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';


@Component({
  selector: 'app-usuario-ngx-table',
  templateUrl: './usuario-ngx-table.component.html',
  animations: egretAnimations
})
export class UsuarioNgxTableComponent implements OnInit, OnDestroy {

  /* exporta a classe usuarios passando um array vazio que armazena qualquer tipo de dados */
  public usuarios: any = [];

  /* observavel: observa se alguma ação será realizada para poder agir conforme instrução */
  /* emite notificações sempre que ocorre uma mudança em um de seus itens e a partir disso podemos executar uma ação. */
  public getItemSub: Subscription;

  /* inicia a barra lateral */
  public isSideNavOpen: boolean;

  /* exporta a classe inserir */
  public InserirUsuario: boolean;

  /* exporta a classe alterar */
  public AlterarUsuario: boolean;

  /* exporta a classe excluir */
  public ExcluirUsuario: boolean;

  /* exporta a classe pesquisar */
  public pesquisarpor = 'name';

  /* decorator - Configura uma consulta de visualização. */
  @ViewChild(MatSidenav) private sideNav: MatSidenav;

  /* exporta a calsse filterForm */
  public filterForm: FormGroup;

  /* exporta a situação - vazia por definição '' */
  public password = '';

  /* É quando queremos utilizar a injeção de dependência - essencialmente para “conectar” as dependências no componente. */
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private usuarioService: UsuarioService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private fb: FormBuilder,
    public AuthGuard: AuthGuard
  ) { }

  /* é chamado depois que as propriedades ligadas a dados de uma diretiva são inicializadas. */
  ngOnInit() {

    /* cria e inicia o filtro de pesquias, executado somente quando sua entrada é alterada. */
    this.filterForm = new FormGroup({

      /* define search como um campo*/
      search: new FormControl('', [Validators.required]),

      /* define pesquisarpor como um campo  */
      pesquisarpor: new FormControl('', [Validators.required])
    });

    /* verifica a permissão para inserir */
    this.InserirUsuario =  this.AuthGuard.getPermissao('InserirUsuario');

    /* verifica a permissão para alterar */
    this.AlterarUsuario =  this.AuthGuard.getPermissao('AlterarUsuario');

    /* verifica a permissão para excluir */
    this.ExcluirUsuario =  this.AuthGuard.getPermissao('ExcluirUsuario');
    // this.sideNav.opened  = false;
   // this.getItems();
  }

  /* é chamado quando uma diretriz, canal ou serviço é destruído. */
  ngOnDestroy() {
    /* condiciona o argumento getItemSub para cancelar a inscrição passada nele */
    if (this.getItemSub) {
      /* caso haja inscrição no getItemSub ele limpa o conteudo */
      this.getItemSub.unsubscribe();
    }
  }

  getUsuarios() {

    /* inicia um Observable no usuarioService */
    this.getItemSub = this.usuarioService.getUsuarios()
      /* assim que a resposta vier ele passa os dados para o data */
      .subscribe(data => {
        /* o usuarios agora passa a conter os dados de data */
        this.usuarios = data;
      });
  }

  obterUsuarios() {

    /* inicia um Observable no usuarioService */
    this.usuarioService.obterUsuarios()
    .subscribe(data => {
      this.usuarios = data;
      this.loader.close();
      if (this.usuarios.length === 0)
      {
        this.snack.open('Não existe usuário com a pesquisa escolhida!', 'OK', { duration: 4000 });
      }
    });

  }

  /* função para abrir o PopUp - define o data como vazio(os campos do data vazios), caso a resposta seja novo */
  openPopUp(data: any = {}, isNew?) {
    /* pergunta se é novo considerando o que foi passado ao iniciar o PopUp */
    const title = isNew ? 'Adicionar Usuário' : 'Alterar Usuário';
    /* inicializa as definiões do PopUp quando ele abre */
    const dialogRef: MatDialogRef<any> = this.dialog.open(NgxTablePopupComponent, {
      /* definição de tamanho e  */
      width: '800px',
      disableClose: true,
      data: { title: title, payload: data }
    });
    /* define a ação após o o fechamento do PopUp */
    dialogRef.afterClosed()
    /* inicia a ação de observable - passa o que foi passado para o res */
    .subscribe(res => {
      /* nega a condição do res para validar caso não haja mudança */
      if (!res) {
        // se o usuario cancelar a ação
        return;
      }
      /* passa os dados para a função getUsuarios no caso de cancelar */
      this.getUsuarios();
    });
  }
  /* função para deletar uma row(linha) na tabela */
  deleteItem(row) {
    /* quando clicar em deletar exibe a mensagem de confirmação, exibindo tambem o campo nome(row.nome) da linha */
    this.confirmService.confirm({message: `Excluir ${row.name}?`})
    /* incia a ação do observable - passando uma condição para validar a ação de exclusão */
      .subscribe(res => {
        /* inicia a condição para o res(dados passados quando for excluir) */
        if (res) {
          /*  */
          this.loader.open();
          /* inicia a função remover - passando a linha que foi escolhida */
          this.usuarioService.removeItem(row)
            /*  */
            .subscribe(data => {
              /* inicia a função getUsuarios */
              this.getUsuarios();
              /* inicia a ação de fechar a tela de exclusão */
              this.loader.close();
              /* retorna uma mensagem confirmando a exclusão */
              this.snack.open('Usuário excluido!', 'OK', { duration: 4000 });
            },
            error => {
              /* fecha a janela de exclusão */
              this.loader.close();
              /* exibe uma mensagem de erro caso não seja possivel excluir */
              this.snack.open(error.error.id[0], 'OK', { duration: 6000 });
            }
          );
        }
      });
  }

  /*  */
  toggleSideNav() {
    /*  */
    this.isSideNavOpen  = !this.isSideNavOpen;
  }

  pesquisarUsuarios() {
    /* incia a pesquisa na tabela usuarios */
    this.loader.open();
    /* aciona o UsuarioService chamando os campos passados */
   this.usuarioService.pesquisarUsuarios(this.filterForm.value.pesquisarpor, this.filterForm.value.search)
      .subscribe(data => {
        this.usuarios = data;
        this.loader.close();
        if (this.usuarios.length === 0)
        {
          this.snack.open('Não existe usuário com a pesquisa escolhida!', 'OK', { duration: 4000 });
        }
      });

  }

  pesquisarPassword(password: any) {
    /*  */
   this.loader.open();
   /*  */
   this.usuarioService.pesquisarUsuarios('password', password)
        /*  */
      .subscribe(data => {
        /*  */
        this.usuarios = data;
        /*  */
        this.loader.close();
        /* condiciona a pesquisa perguntando se há mais alguma situação
        se for 0, finaliza a pesquisa*/
        if (this.usuarios.length === 0)
        // tslint:disable-next-line:one-line
        {
          /* exibe uma mensagem na tela */
          this.snack.open('Não existe usuário com a senha escolhida!', 'OK', { duration: 4000 });
        }
      });
  }
}
