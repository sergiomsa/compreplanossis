import { AuthService as AuthGuard } from './../../../shared/services/auth/auth.service';
import { Component, OnInit, OnDestroy, NgModule, ViewChild } from '@angular/core';
import { ModuloService } from '../modulo.service';
import { MatDialogRef, MatDialog, MatSnackBar, MatAutocomplete,  MatSidenav  } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { NgxTablePopupComponent } from './ngx-table-popup/ngx-table-popup.component';
import { Subscription } from 'rxjs';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { FormControl, FormsModule, FormBuilder, FormGroup,  Validators  } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-modulo-ngx-table',
  templateUrl: './modulo-ngx-table.component.html',
  animations: egretAnimations
})
export class ModuloNgxTableComponent implements OnInit, OnDestroy {

  /* exporta a classe modulos passando um array vazio que armazena qualquer tipo de dados */
  public modulos: any = [];

  /* observavel: observa se alguma ação será realizada para poder agir conforme instrução */
  /* emite notificações sempre que ocorre uma mudança em um de seus itens e a partir disso podemos executar uma ação. */
  public getItemSub: Subscription;

  /* inicia a barra lateral */
  public isSideNavOpen: boolean;

  /* exporta a classe inserir */
  public InserirModulo: boolean;

  /* exporta a classe alterar */
  public AlterarModulo: boolean;

  /* exporta a classe excluir */
  public ExcluirModulo: boolean;

  /* exporta a classe pesquisar */
  public pesquisarpor = 'modulo';

  /* decorator - Configura uma consulta de visualização. */
  @ViewChild(MatSidenav) private sideNav: MatSidenav;

  /* exporta a calsse filterForm */
  public filterForm: FormGroup;

  /* exporta a situação - vazia por definição '' */
  public situacao = '';

  /* É quando queremos utilizar a injeção de dependência - essencialmente para “conectar” as dependências no componente. */
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private moduloService: ModuloService,
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
    this.InserirModulo =  this.AuthGuard.getPermissao('InserirModulo');

    /* verifica a permissão para alterar */
    this.AlterarModulo =  this.AuthGuard.getPermissao('AlterarModulo');

    /* verifica a permissão para excluir */
    this.ExcluirModulo =  this.AuthGuard.getPermissao('ExcluirModulo');
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

  getModulos() {

    /* inicia um Observable no moduloService */
    this.getItemSub = this.moduloService.getModulos()
      /* assim que a resposta vier ele passa os dados para o data */
      .subscribe(data => {
        /* o modulos agora passa a conter os dados de data */
        this.modulos = data;
      });
  }

  /* função para abrir o PopUp - define o data como vazio(os campos do data vazios), caso a resposta seja novo */
  openPopUp(data: any = {}, isNew?) {
    /* pergunta se é novo considerando o que foi passado ao iniciar o PopUp */
    const title = isNew ? 'Adicionar módulo' : 'Alterar módulo';
    /* inicializa as definiões do PopUp quando ele abre */
    const dialogRef: MatDialogRef<any> = this.dialog.open(NgxTablePopupComponent, {
      /* definição de tamanho e  */
      width: '720px',
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
      /* passa os dados para a função getModulos no caso de cancelar */
      this.getModulos();
    });
  }
  /* função para deletar uma row(linha) na tabela */
  deleteItem(row) {
    /* quando clicar em deletar exibe a mensagem de confirmação, exibindo tambem o campo nome(row.nome) da linha */
    this.confirmService.confirm({message: `Excluir ${row.modulo}?`})
    /* incia a ação do observable - passando uma condição para validar a ação de exclusão */
      .subscribe(res => {
        /* inicia a condição para o res(dados passados quando for excluir) */
        if (res) {
          /*  */
          this.loader.open();
          /* inicia a função remover - passando a linha que foi escolhida */
          this.moduloService.removeItem(row)
            /*  */
            .subscribe(data => {
              /* inicia a função getModulos */
              this.getModulos();
              /* inicia a ação de fechar a tela de exclusão */
              this.loader.close();
              /* retorna uma mensagem confirmando a exclusão */
              this.snack.open('Módulo excluido!', 'OK', { duration: 4000 });
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

  pesquisarModulos() {
    /* incia a pesquisa na tabela modulos */
    this.loader.open();
    /* aciona o ModuloService chamando os campos passados */
   this.moduloService.pesquisarModulos(this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        /* envias os dados para o parametro data */
      .subscribe(data => {
        /* relaciona modulos a data */
        this.modulos = data;
        /* aciona o fechamento da pesquisa */
        this.loader.close();
        /* condiciona a pesquisa modulos a  verificando se há um proximo dado
        se for 0, finaliza a verificação*/
        if (this.modulos.length === 0)
        // tslint:disable-next-line:one-line
        {
          /* retorna uma mensagem na tela */
          this.snack.open('Não existe módulo com a pesquisa escolhida!', 'OK', { duration: 4000 });
        }
      });

  }

  pesquisarSituacao(situacao: any) {
    /*  */
   this.loader.open();
   /*  */
   this.moduloService.pesquisarModulos('situacao', situacao)
        /*  */
      .subscribe(data => {
        /*  */
        this.modulos = data;
        /*  */
        this.loader.close();
        /* condiciona a pesquisa perguntando se há mais alguma situação
        se for 0, finaliza a pesquisa*/
        if (this.modulos.length === 0)
        // tslint:disable-next-line:one-line
        {
          /* exibe uma mensagem na tela */
          this.snack.open('Não existe módulo com a situacao escolhida!', 'OK', { duration: 4000 });
        }
      });
  }
}
