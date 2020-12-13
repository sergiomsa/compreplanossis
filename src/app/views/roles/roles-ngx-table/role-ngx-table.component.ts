import { AuthService as AuthGuard } from './../../../shared/services/auth/auth.service';
import {
  Component,
  OnInit,
  OnDestroy,
  NgModule,
  ViewChild
} from '@angular/core';
import { RoleService } from '../role.service';
import {
  MatDialogRef,
  MatDialog,
  MatSnackBar,
  MatAutocomplete,
  MatSidenav
} from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { NgxTablePopupComponent } from './ngx-table-popup/ngx-table-popup.component';
import { Subscription } from 'rxjs';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import {
  FormControl,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import * as _ from 'lodash';

@Component({
  selector: 'app-role-ngx-table',
  templateUrl: './role-ngx-table.component.html',
  styleUrls: ['./role-ngx-table.component.css'],
  animations: egretAnimations
})
export class RoleNgxTableComponent implements OnInit, OnDestroy {
  /* exporta a classe roles passando um array vazio que armazena qualquer tipo de dados */
  public roles: any = [];

  /* observavel: observa se alguma ação será realizada para poder agir conforme instrução */
  /* emite notificações sempre que ocorre uma mudança em um de seus itens e a partir disso podemos executar uma ação. */
  public getItemSub: Subscription;

  /* inicia a barra lateral */
  public isSideNavOpen: boolean;

  /* exporta a classe inserir */
  public InserirRole: boolean;

  /* exporta a classe alterar */
  public AlterarRole: boolean;

  /* exporta a classe excluir */
  public ExcluirRole: boolean;

  /* exporta a classe pesquisar */
  public pesquisarpor = 'nome';

  /*  */
  rows = [];
  /*  */
  selectedRole = [];
  /*  */
  selectedPermissao = [];
  /*  */
  cadastroPermissao = [];
  /*  */
  inserirPermissao = [];
  /*  */
  excluirPermissao = [];
  /*  */
  permissoes: any = [];
  /*  */
  programas: any = [];
  /*  */
  modulos: any = [];
  /*  */
  programa_id: any;
  /*  */
  modulo_id = 0;
  /*  */
  role_id: any;

  /* decorator - Configura uma consulta de visualização. */
  @ViewChild(MatSidenav) private sideNav: MatSidenav;

  /* exporta a calsse filterForm */
  public filterForm: FormGroup;

  /* exporta a situação - vazia por definição '' */
  public situacao = '';

  public showFiller = false;

  /* É quando queremos utilizar a injeção de dependência - essencialmente para “conectar” as dependências no componente. */
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private roleService: RoleService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private fb: FormBuilder,
    public AuthGuard: AuthGuard
  ) {}

  /* é chamado depois que as propriedades ligadas a dados de uma diretiva são inicializadas. */
  ngOnInit() {
    /* cria e inicia o filtro de pesquias, executado somente quando sua entrada é alterada. */
    this.filterForm = new FormGroup({
      search: new FormControl('', [Validators.required]),
      pesquisarpor: new FormControl('', [Validators.required])
    });
    /* passa o selectdRole como um array vazio */
    this.selectedRole = [];
    /* Passa o selectedPermissao como um array vazio */
    this.selectedPermissao = [];
    /*  */
    this.cadastroPermissao = [];
    /*  */
    this.inserirPermissao = [];
    /*  */
    this.excluirPermissao = [];
    /* verifica a permissão do usuário para Inserir um papel */
    this.InserirRole = this.AuthGuard.getPermissao('InserirRole');
    /*  verifica a permissão do usuário pra alterar um papel*/
    this.AlterarRole = this.AuthGuard.getPermissao('AlterarRole');
    /* verifica a permissão do usário para excluir em papel */
    this.ExcluirRole = this.AuthGuard.getPermissao('ExcluirRole');
    /* obtem a classe obterModulos do service */
    this.obterModulos();
  }

  /* é chamado quando uma diretriz, canal ou serviço é destruído. */
  ngOnDestroy() {
    /* condiciona o argumento getItemSub para cancelar a inscrição passada nele */
    if (this.getItemSub) {
      /* caso haja inscrição no getItemSub ele limpa o conteudo */
      this.getItemSub.unsubscribe();
    }
  }

  getRoles() {
    /* inicia um Observable no roleService */
    this.getItemSub = this.roleService
      .getRoles()
      /* assim que a resposta vier ele passa os dados para o data */
      .subscribe(data => {
        /* o roles agora passa a conter os dados de data */
        this.roles = data;
        /* obter o permission_role  o registro 0 do data *
        /* this.roles[0].id */
      });
  }

  /* função para abrir o PopUp - define o data como vazio(os campos do data vazios), caso a resposta seja novo */
  openPopUp(data: any = {}, isNew?) {
    /* pergunta se é novo considerando o que foi passado ao iniciar o PopUp */
    const title = isNew ? 'Adicionar Papéis' : 'Alterar Papéis';
    /* inicializa as definiões do PopUp quando ele abre */
    const dialogRef: MatDialogRef<any> = this.dialog.open(
      NgxTablePopupComponent,
      {
        /* definição de tamanho e  */
        width: '720px',
        disableClose: true,
        data: { title: title, payload: data }
      }
    );
    /* define a ação após o o fechamento do PopUp */
    dialogRef
      .afterClosed()
      /* inicia a ação de observable - passa o que foi passado para o res */
      .subscribe(res => {
        /* nega a condição do res para validar caso não haja mudança */
        if (!res) {
          // se o usuario cancelar a ação
          return;
        }
        /* passa os dados para a função getRoles no caso de cancelar */
        this.getRoles();
        this.selectedRole   = [];
        this.selectedRole.splice(0, this.selectedRole.length);
        let result          = this.roles;
        result              = _.find(this.roles, (role) => {
          return role.id === this.role_id;
        });
        this.selectedRole.push(result);
      });
  }
  /* função para deletar uma row(linha) na tabela */
  deleteItem(row) {
    /* quando clicar em deletar exibe a mensagem de confirmação, exibindo tambem o campo nome(row.nome) da linha */
    this.confirmService
      .confirm({ message: `Excluir ${row.nome}?` })
      /* incia a ação do observable - passando uma condição para validar a ação de exclusão */
      .subscribe(res => {
        /* inicia a condição para o res(dados passados quando for excluir) */
        if (res) {
          /*  */
          this.loader.open();
          /* inicia a função remover - passando a linha que foi escolhida */
          this.roleService
            .removeItem(row)
            /*  */
            .subscribe(
              data => {
                /* inicia a função getRoles */
                this.getRoles();
                /* inicia a ação de fechar a tela de exclusão */
                this.loader.close();
                /* retorna uma mensagem confirmando a exclusão */

                this.role_id      = this.roles[0].id;
                this.selectedRole = [];
                this.selectedRole.splice(0, this.selectedRole.length);
                this.selectedRole.push(this.roles[0]);

                this.snack.open('Papéis excluido!', 'OK', { duration: 4000 });
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
    this.isSideNavOpen = !this.isSideNavOpen;
    if (this.isSideNavOpen) {
      // tslint:disable-next-line:one-line
      this.obterModulos();
    }
  }

  pesquisarRoles() {
    /* incia a pesquisa na tabela roles */
    this.loader.open();
    /* aciona o RoleService chamando os campos passados */
    this.roleService
      .pesquisarRoles(
        this.filterForm.value.pesquisarpor,
        this.filterForm.value.search
      )
      /* envias os dados para o parametro data */
      .subscribe(data => {
        /* relaciona roles a data */
        this.roles = data;
        /* aciona o fechamento da pesquisa */
        this.loader.close();
        /* condiciona a pesquisa roles a  verificando se há um proximo dado
        se for 0, finaliza a verificação*/
        if (this.roles.length === 0) {
          // tslint:disable-next-line:one-line
          /* retorna uma mensagem na tela */
          this.snack.open('Não existe papeis com a pesquisa escolhida!', 'OK', {
            duration: 4000
          });
        } else {
          this.role_id 			= this.roles[0].id;
          this.selectedRole 	= [];
          this.selectedRole.splice(0, this.selectedRole.length);
          this.selectedRole.push(this.roles[0]);
          /*  */
          this.roleService
            .obterPermissoes(this.role_id, 0, 0)
            /*  */
            // tslint:disable-next-line:no-shadowed-variable
            .subscribe(data => {
              /*  */
              this.permissoes 		= data;
              this.cadastroPermissao = [];
              this.selectedPermissao = [];
              /*  */
              // tslint:disable-next-line:one-line
              for (const k in data) {
                if (data[k].tem) {
                  // tslint:disable-next-line:one-line
                  this.cadastroPermissao.push(data[k]);
                  this.selectedPermissao.push(data[k]);
                }
              }
            });
        }
      });
  }

  pesquisarProgramas() {
    this.loader.open();
    this.programa_id = 0;
    this.roleService.pesquisarProgramas('modulo_id', this.modulo_id).subscribe(data => {
      this.programas = data;
      if (this.programas.length === 0) {
        // tslint:disable-next-line:one-line
        this.loader.close();
        this.snack.open('Não existe programa com a pesquisa escolhida!', 'OK', {
          duration: 4000
        });
      } else {
        this.roleService
          .obterPermissoes(this.role_id, this.modulo_id, 0)
          // tslint:disable-next-line:no-shadowed-variable
          .subscribe(data => {
            this.permissoes 		= data;
            this.cadastroPermissao 	= [];
            this.selectedPermissao 	= [];
            for (const k in data) {
              if (data[k].tem) {
                this.cadastroPermissao.push(data[k]);
                this.selectedPermissao.push(data[k]);
              }
            }
            this.loader.close();
          });
      }
    });
  }

  obterModulos() // tslint:disable-next-line:one-line
  {
    this.roleService.obterModulos().subscribe(response => {
      this.modulos = response;
    });
  }

  obterPermissoes() {
    this.loader.open();
    this.roleService
      .obterPermissoes(this.role_id, this.modulo_id, this.programa_id)
      .subscribe(data => {
        this.permissoes 		= data;
        this.cadastroPermissao 	= [];
        this.selectedPermissao 	= [];
        for (const k in data) {
          if (data[k].tem) {
            this.cadastroPermissao.push(data[k]);
            this.selectedPermissao.push(data[k]);
          }
        }
        this.loader.close();
      });
  }

  onSelectRole({ selected }) {
    this.loader.open();
    this.role_id 				= selected[0].id;
    this.programas 				= [];
    this.modulo_id 				= 0;
    this.roleService.obterPermissoes(this.role_id, 0, 0).subscribe(data => {
      this.permissoes 			= data;
      this.cadastroPermissao 	= [];
      this.selectedPermissao 	= [];
      for (const k in data) {
        if (data[k].tem) {
          this.cadastroPermissao.push(data[k]);
          this.selectedPermissao.push(data[k]);
        }
      }
      this.loader.close();
    });
  }

  onSelectPermissao({ selected }) // tslint:disable-next-line:one-line
  {
    this.selectedPermissao.splice(0, this.selectedPermissao.length);
    this.selectedPermissao.push(...selected);

    this.inserirPermissao = _.difference(
      this.selectedPermissao,
      this.cadastroPermissao
    );
    this.excluirPermissao = _.difference(
      this.cadastroPermissao,
      this.selectedPermissao
    );

    if (this.inserirPermissao.length === 1) {
      // tslint:disable-next-line:one-line
      this.loader.open();
      const inserirpermissao = {
        role_id: this.role_id,
        store_id: this.inserirPermissao[0].permission_id,
        destroy_id: 0
      };

      /* Chamar a API aqui passando como paramento  */
      this.roleService
        .gravarPermissoes(inserirpermissao)
        .subscribe(
          data => {
            // this.items = data;
            this.roles          = data;
            this.selectedRole   = [];
            this.selectedRole.splice(0, this.selectedRole.length);
            let result          = this.roles;
            result              = _.find(this.roles, (role) => {
              return role.id === this.role_id;
            });
            this.selectedRole.push(result);
            for (const k in this.inserirPermissao) {
              this.cadastroPermissao.push(this.inserirPermissao[k]);
            }
            this.inserirPermissao = [];
            this.loader.close();
            this.snack.open('Permissão Adicionado!', 'OK', { duration: 4000 });
          },
          error => {
            this.loader.close();
            let message = '';
            if (error.error) {
              for (const k in error.error) message += error.error[k] + ' | ';
            }
            this.snack.open(message, 'OK', { duration: 6000 });
          }
        );
    }

    if (this.excluirPermissao.length === 1) {
      this.loader.open();
      const excluirpermissao = {
        role_id: this.role_id,
        store_id: 0,
        destroy_id: this.excluirPermissao[0].permission_id
      };
      /* Chamar a API aqui passando como paramento  */
      this.roleService.gravarPermissoes(excluirpermissao).subscribe(
        data => {
          // this.items = data;
          this.roles 				= data;
          this.selectedRole   		= [];
          this.selectedRole.splice(0, this.selectedRole.length);
          let result          		= this.roles;
          result              		= _.find(this.roles, (role) => {
            return role.id === this.role_id;
          });
          this.selectedRole.push(result);

          this.excluirPermissao 	= _.difference(
            this.cadastroPermissao,
            this.selectedPermissao
          );
          this.cadastroPermissao 	= _.difference(
            this.cadastroPermissao,
            this.excluirPermissao
          );
          this.excluirPermissao 	= [];
          this.loader.close();
          this.snack.open('Permissão excluída!', 'OK', { duration: 4000 });
        },
        error => {
          this.loader.close();
          let message 				= '';
          if (error.error) {
            for (const k in error.error) message += error.error[k] + ' | ';
          }
          this.snack.open(message, 'OK', { duration: 6000 });
        }
      );
    }
  }

  confirmarPermissao() {
    this.loader.open();
    var store = [];
    var destroy = [];

    for (const k in this.inserirPermissao) {
      store.push(this.inserirPermissao[k].permission_id);
    }

    for (const i in this.excluirPermissao) {
      destroy.push(this.excluirPermissao[i].permission_id);
    }

    const permissao = {
      role_id: this.role_id,
      store_id: store,
      destroy_id: destroy
    };

    /* Chamar a API aqui passando como paramento  */
    this.roleService.gravarPermissoes(permissao).subscribe(
      data => {
        // this.items = data;
        this.roles 				= data;
        this.selectedRole   	= [];
        this.selectedRole.splice(0, this.selectedRole.length);
        let result          	= this.roles;
        result              	= _.find(this.roles, (role) => {
          return role.id === this.role_id;
        });
        this.selectedRole.push(result);

        // tslint:disable-next-line:forin
        for (const k in this.inserirPermissao) {
          this.cadastroPermissao.push(this.inserirPermissao[k]);
        }

        this.inserirPermissao 	= _.difference(
          this.selectedPermissao,
          this.cadastroPermissao
        );
        this.cadastroPermissao 	= _.difference(
          this.cadastroPermissao,
          this.excluirPermissao
        );
        this.inserirPermissao 	= [];
        this.excluirPermissao 	= [];
        this.loader.close();
        this.snack.open('Permissões confirmadas!', 'OK', { duration: 4000 });
      },
      error => {
        this.loader.close();
        let message = '';
        if (error.error) {
          for (const k in error.error) message += error.error[k] + ' | ';
        }
        this.snack.open(message, 'OK', { duration: 6000 });
      }
    );
  }
}
