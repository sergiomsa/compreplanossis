import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService as AuthGuard } from "../../shared/services/auth/auth.service";
import {
  MatSnackBar,
  MatSidenav,
} from "@angular/material";
import { AppLoaderService } from "../../shared/services/app-loader/app-loader.service";
import { PlanoService } from "./plano.service";
import { AppConfirmService } from "../../shared/services/app-confirm/app-confirm.service";
import { QuillEditorComponent } from 'ngx-quill/src/quill-editor.component';
import * as _ from "lodash";

@Component({
  selector: "app-planos",
  templateUrl: "./planos.component.html",
  styleUrls: ["./planos.component.scss"]
})
export class PlanosComponent implements OnInit {
  @Input()selectedIndex: number
  public id: number;
  public plano_id: number = 0;
  public carenciapor: string = '';
  public precobaseadoem: string = '';
  public selectedPlano = [];
  public filterForm: FormGroup;
  public planoForm: FormGroup;
  public contratoForm: FormGroup;
  public isSideNavOpen: boolean;
  @ViewChild(MatSidenav)
  @ViewChild('editor') editor: QuillEditorComponent;
  @ViewChild("fileInput") fileInput;
  private sideNav: MatSidenav;
  public formulario: boolean;
  public InserirPlano: boolean;
  public AlterarPlano: boolean;
  public ExcluirPlano: boolean;
  public ExportarPlanos: boolean;
  public segmentacao: any;
  public contratacao:any;
  public registroans:any;
  public pesquisa: any;
  public cor: any;
  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  planos: any = [];
  operadoras: any;
  contratacoes: any;
  segmentacoes: any;
  abrangencias: any;
  integracoes: any;
  tiposdeplano: any;
  tipodeplano_id: any;
  contratacao_id: any;
  abrangencia_id: any;
  operadora_id: any;
  editorData: any ="";
  editorDatad: any ="";
  messages 				= {emptyMessage: 'Nenhum registro', loadingMessage: 'Carregando', totalMessage: 'registro(s)', selectedMessage: 'selecionado(s)' };
  
  constructor(
    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private planoService: PlanoService,
    private confirmService: AppConfirmService
  ) {}

  ngOnInit() {
    this.selectedIndex = 0;
    this.page_totalElements = 0;
    this.page_pageNumber = 0;
    this.page_size = 10;

    this.obterSelecao();
    
    this.filterForm = new FormGroup({
      search: new FormControl("", [Validators.required]),
      pesquisarpor: new FormControl("", [Validators.required])
    });

    this.filterForm.patchValue({ pesquisarpor: "plano" });

    this.planoForm              = new FormGroup({
      plano:                  new FormControl("", [Validators.required]),
      nomecurto:              new FormControl("", [Validators.required]),
      descricao:              new FormControl(""),
      declaracao:             new FormControl(""),
      registroans:            new FormControl("", [Validators.required]),
      valor:                  new FormControl(""),
      tipodeplano_id:         new FormControl("", [Validators.required]),
      operadora_id:           new FormControl("", [Validators.required]),
      contratacao_id:         new FormControl("", [Validators.required]),
      integracao_id:          new FormControl(""),
      segmentacao_id:         new FormControl("", [Validators.required]),
      cor:                    new FormControl(""),
      qtde_min_vidas:         new FormControl('', [Validators.required]),
      qtde_max_vidas:         new FormControl('', [Validators.required]),
      venderonline:           new FormControl("", [Validators.required]),
      precobaseadoem:         new FormControl("", [Validators.required]),
      situacao:               new FormControl("", [Validators.required])
    });

    this.contratoForm         = new FormGroup({
      plano_id:               new FormControl(""),
      docfile:                new FormControl("", [Validators.required])
    });

    this.formulario = false;

    this.InserirPlano = this.AuthGuard.getPermissao("InserirPlano");
    this.AlterarPlano = this.AuthGuard.getPermissao("AlterarPlano");
    this.ExcluirPlano = this.AuthGuard.getPermissao("ExcluirPlano");
  }

  ngOnDestroy() {
  }

  toggleSideNav() {
    this.isSideNavOpen = !this.isSideNavOpen;
  }

  onSelectPlano({ selected }) {

    this.selectedIndex           = 0;
    this.carenciapor             = this.selectedPlano[0].tipodeplano.carenciapor;
    this.precobaseadoem          = this.selectedPlano[0].precobaseadoem;
    this.plano_id                = this.selectedPlano[0].id;
     
  }

  abrirFormulario(id) {

    this.obterSelecao();
    this.id = id;
    this.formulario = true;

    if (this.id > 0) {
      this.planoService.obterPlano(this.id).subscribe(plano => {

        if (plano.venderonline=='S')
        {
          plano.venderonline	= true;
        } else {
          plano.venderonline	= false;
        }
        
        this.planoForm.patchValue({ plano: plano.plano });
        this.planoForm.patchValue({ nomecurto: plano.nomecurto });
        this.planoForm.patchValue({ descricao: plano.descricao });
        this.planoForm.patchValue({ registroans: plano.registroans });
        this.planoForm.patchValue({ tipodeplano_id: plano.tipodeplano_id });
        this.planoForm.patchValue({ operadora_id: plano.operadora_id });
        this.planoForm.patchValue({ contratacao_id: plano.contratacao_id });
        this.planoForm.patchValue({ segmentacao_id: plano.segmentacao_id });
        this.planoForm.patchValue({ integracao_id: plano.integracao_id });
        this.planoForm.patchValue({ cor: plano.cor });
        this.planoForm.patchValue({ qtde_min_vidas: plano.qtde_min_vidas });
        this.planoForm.patchValue({ qtde_max_vidas: plano.qtde_max_vidas });
        this.planoForm.patchValue({ venderonline: plano.venderonline });
        this.planoForm.patchValue({ precobaseadoem: plano.precobaseadoem });
        this.planoForm.patchValue({ situacao: plano.situacao });

        if ( plano.precobaseadoem !='P')
        {
          this.planoForm.patchValue({ valor: 0 });
        } else {
          this.planoForm.patchValue({ valor: plano.valor });
        }

        this.editorData       = plano.descricao;
        this.editorDatad      = plano.declaracao;
        this.segmentacao      = plano.tipodeplano.segmentacao;
        this.contratacao      = plano.tipodeplano.contratacao;
        this.registroans      = plano.tipodeplano.registroans;

        this.planoForm.get('segmentacao_id').clearValidators();
        this.planoForm.get('contratacao_id').clearValidators();
        this.planoForm.get('registroans').clearValidators();

        if (plano.tipodeplano.segmentacao==1)
        {
          this.planoForm.get('segmentacao_id').setValidators([Validators.required]);
        }

        if (plano.tipodeplano.contratacao==1)
        {
          this.planoForm.get('contratacao_id').setValidators([Validators.required]);
        }

        if (plano.tipodeplano.registroans==1)
        {
          this.planoForm.get('registroans').setValidators([Validators.required]);
        }

        this.planoForm.get('segmentacao_id').updateValueAndValidity();
        this.planoForm.get('contratacao_id').updateValueAndValidity();
        this.planoForm.get('registroans').updateValueAndValidity();

      });
    } else {
      this.planoForm.patchValue({ plano: "" });
      this.planoForm.patchValue({ nomecurto: "" });
      this.planoForm.patchValue({ descricao: "" });
      this.planoForm.patchValue({ registroans: "" });
      this.planoForm.patchValue({ valor: "" });
      this.planoForm.patchValue({ tipodeplano_id: "" });
      this.planoForm.patchValue({ operadora_id: "" });
      this.planoForm.patchValue({ contratacao_id: 0 });
      this.planoForm.patchValue({ segmentacao_id: 0 });
      this.planoForm.patchValue({ cor: "" });
      this.planoForm.patchValue({ qtde_min_vidas: 1 });
      this.planoForm.patchValue({ qtde_max_vidas: 999 });
      this.planoForm.patchValue({ venderonline: true });
      this.planoForm.patchValue({ precobaseadoem: "" });
      this.planoForm.patchValue({ situacao: "Ativo" });
      this.planoForm.patchValue({ integracao_id: 1 });
      this.editorData   = '';
      this.editorDatad  = '';
      this.segmentacao  = 1;
      this.contratacao  = 1;
      this.registroans  = 1;
    }
  }

  cancelarFormulario() {
    this.formulario = false;
  }

  pesquisarTipodeplano(tipodeplano_id) {
    this.loader.open();
    this.planoService
      .pesquisarPlanos(this.pagina, "tipodeplano_id", tipodeplano_id)
      .subscribe(planos => {
        this.planos = planos.data;
        this.page_totalElements = planos.total;
        this.loader.close();
        if (this.planos.length === 0) {
          this.snack.open("Não existe o Tipo de plano escolhido!", "OK", {
            duration: 4000
          });
        }
      });
  }

  pesquisarOperadora(operadora_id) {
    this.loader.open();
    this.planoService
      .pesquisarPlanos(this.pagina, "operadora_id", operadora_id)
      .subscribe(planos => {
        this.planos = planos.data;
        this.page_totalElements = planos.total;
        this.loader.close();
        if (this.planos.length === 0) {
          this.snack.open("Não existe a Operadora escolhida!", "OK", {
            duration: 4000
          });
        }
      });
  }

  pesquisarContratacao(contratacao_id) {
    this.loader.open();
    this.planoService
      .pesquisarPlanos(this.pagina, "contratacao_id", contratacao_id)
      .subscribe(planos => {
        this.planos = planos.data;
        this.page_totalElements = planos.total;
        this.loader.close();
        if (this.planos.length === 0) {
          this.snack.open("Não existe a Contratação escolhida!", "OK", {
            duration: 4000
          });
        }
      });
  }

  pesquisarAbrangencia(abrangencia_id) {
    this.loader.open();
    this.planoService
      .pesquisarPlanos(this.pagina, "abrangencia_id", abrangencia_id)
      .subscribe(planos => {
        this.planos = planos.data;
        this.page_totalElements = planos.total;
        this.loader.close();
        if (this.planos.length === 0) {
          this.snack.open("Não existe a Abrangência escolhida!", "OK", {
            duration: 4000
          });
        }
      });
  }

  pesquisarSegmentacao(segmentacao_id) {
    this.loader.open();
    this.planoService
      .pesquisarPlanos(this.pagina, "segmentacao_id", segmentacao_id)
      .subscribe(planos => {
        this.planos = planos.data;
        this.page_totalElements = planos.total;
        this.loader.close();
        if (this.planos.length === 0) {
          this.snack.open("Não existe a segmentacao escolhida!", "OK", {
            duration: 4000
          });
        }
      });
  }

  pesquisarPlanos(offset = 0) {
    this.pesquisa = "parcial";
    offset = offset + 1;
    this.formulario = false;
    this.loader.open();
    this.planoService
      .pesquisarPlanos(
        offset,
        this.filterForm.value.pesquisarpor,
        this.filterForm.value.search
      )
      .subscribe(planos => {
        this.planos = planos.data;
        this.page_totalElements = planos.total;
        if (this.planos.length > 0) 
        {
          this.selectedIndex           = 0;
          this.plano_id                = this.planos[0].id;
          this.carenciapor             = this.planos[0].tipodeplano.carenciapor;
          this.precobaseadoem          = this.planos[0].precobaseadoem;
          this.selectedPlano           = [];
          this.selectedPlano.splice(0, this.selectedPlano.length);
          this.selectedPlano.push(this.planos[0]);
        }
        this.loader.close();
        if (this.planos.length === 0) {
          this.snack.open("Não existe plano com a pesquisa escolhida!", "OK", {
            duration: 4000
          });
        }
      });
  }

  todosPlanos(offset = 0) {
    this.pesquisa = "total";
    offset = offset + 1;
    this.formulario = false;
    this.loader.open();
    this.planoService.todosPlanos(offset).subscribe(planos => {
      this.planos = planos.data;
      this.page_totalElements = planos.total;
      if (this.planos.length > 0) 
      {
        this.selectedIndex           = 0;
        this.plano_id                = this.planos[0].id;
        this.carenciapor             = this.planos[0].tipodeplano.carenciapor;
        this.precobaseadoem          = this.planos[0].precobaseadoem;
        this.selectedPlano           = [];
        this.selectedPlano.splice(0, this.selectedPlano.length);
        this.selectedPlano.push(this.planos[0]);
      }
      this.loader.close();
      if (this.planos.length === 0) {
        this.snack.open("Não existe nenhum registro!", "OK", {
          duration: 4000
        });
      }
    });
  }

  paginacao(pageInfo) {
    this.pagina = pageInfo.offset;
    if (this.pesquisa == "total") {
      this.todosPlanos(pageInfo.offset);
    } else {
      this.pesquisarPlanos(pageInfo.offset);
    }
  }


  submit() {
    this.loader.open();

    if (this.planoForm.value.precobaseadoem !='P')
    {
      this.planoForm.patchValue({ valor: 0 });
    }

    this.planoForm.patchValue({ descricao: this.editorData });
    this.planoForm.patchValue({ declaracao: this.editorDatad });

    if (this.id > 0) {
      this.planoService.atualizarPlano(this.id, this.planoForm.value).subscribe(
        data => {
          this.loader.close();
          this.snack.open("Plano alterado!", "OK", { duration: 4000 });
          this.formulario = false;
          this.paginacao({ offset: this.pagina });
        },
        error => {
          this.loader.close();
          let message = "";
          if (error.error) {
            for (const k in error.error) message += error.error[k] + " | ";
          }
          this.snack.open(message, "OK", { duration: 6000 });
        }
      );
    } else {
      this.planoService.adicionarPlano(this.planoForm.value).subscribe(
        data => {
          this.loader.close();
          this.snack.open("Plano adicionado!", "OK", { duration: 4000 });
          this.formulario = false;
          this.paginacao({ offset: this.pagina });
        },
        error => {
          this.loader.close();
          let message = "";
          if (error.error) {
            for (const k in error.error) message += error.error[k] + " | ";
          }
          this.snack.open(message, "OK", { duration: 6000 });
        }
      );
    }
  }

  submitContrato() {

    this.loader.open();

    const documento			= this.fileInput.nativeElement;
    const formdata 			= new FormData();

    if (documento.files[0])
    {
      formdata.append("docfile", documento.files[0]);
    }

	  formdata.append("plano_id",  this.plano_id.toString());
  
    this.planoService.adicionarContrato(formdata).subscribe(
        data => {
          this.loader.close();
          this.snack.open("Contrato enviado com sucesso!", "OK", { duration: 4000 });
        },
        error => {
          this.loader.close();
          let message = "";
          if (error.error) {
            for (const k in error.error) message += error.error[k] + " | ";
          }
          this.snack.open(message, "OK", { duration: 6000 });
        }
      );
    
  }

  removerPlano(row) {
    this.confirmService
      .confirm({ message: `Excluir ${row.plano}?` })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.planoService.removerPlano(row).subscribe(
            data => {
              this.loader.close();
              this.snack.open("Plano excluido!", "OK", { duration: 4000 });
              this.paginacao({ offset: this.pagina });
            },
            error => {
              this.loader.close();
              this.snack.open(error.error.id[0], "OK", { duration: 6000 });
            }
          );
        }
      });
  }

  pesquisarSituacao(situacao: any) {
    this.loader.open();
    this.planoService
      .pesquisarPlanos(this.pagina, "situacao", situacao)
      .subscribe(planos => {
        this.planos = planos.data;
        this.page_totalElements = planos.total;
        this.loader.close();
        if (this.planos.length === 0) {
          this.snack.open(
            "Não existe plano com a situacao escolhida!",
            "OK",
            { duration: 4000 }
          );
        }
      });
  }

  obterSelecao() {
    this.planoService.obterSelecao().subscribe(response => {
      this.tiposdeplano = response.tiposdeplano;
      this.operadoras   = response.operadoras;
      this.contratacoes = response.contratacoes;
      this.segmentacoes = response.segmentacoes;
      this.integracoes  = response.integracoes;
    });
  }

  obterTiposdeplano() {
    this.planoService.obterTipodeplano().subscribe(response => {
      this.tiposdeplano = response;
    });
  }

  obterOperadoras() {
    this.planoService.obterOperadora().subscribe(response => {
      this.operadoras = response;
    });
  }

  obterContratacoes() {
    this.planoService.obterContratacao().subscribe(response => {
      this.contratacoes = response;
    });
  }

  obterAbrangencias() {
    this.planoService.obterAbrangencia().subscribe(response => {
      this.abrangencias = response;
    });
  }

  onTipodeplano(tipodeplano) {

    this.segmentacao      = tipodeplano.segmentacao;
    this.contratacao      = tipodeplano.contratacao;
    this.registroans      = tipodeplano.registroans;

    this.planoForm.get('segmentacao_id').clearValidators();
    this.planoForm.get('contratacao_id').clearValidators();
    this.planoForm.get('registroans').clearValidators();
    
    if (tipodeplano.segmentacao==1)
    {
      this.planoForm.get('segmentacao_id').setValidators([Validators.required]);
    } else {
      this.planoForm.patchValue({ segmentacao_id: 0 });
    }

    if (tipodeplano.contratacao==1)
    {
      this.planoForm.get('contratacao_id').setValidators([Validators.required]);
    } else {
      this.planoForm.patchValue({ contratacao_id: 0 });
    }

    if (tipodeplano.registroans==1)
    {
      this.planoForm.get('registroans').setValidators([Validators.required]);
    } else {
      this.planoForm.patchValue({ registroans: 0 });
    }

    this.planoForm.get('segmentacao_id').updateValueAndValidity();
    this.planoForm.get('contratacao_id').updateValueAndValidity();
    this.planoForm.get('registroans').updateValueAndValidity();

  }

}