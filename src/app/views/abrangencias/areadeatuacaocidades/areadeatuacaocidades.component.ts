import { Component, OnInit, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService as AuthGuard } from "../../../shared/services/auth/auth.service";
import {
  MatSnackBar,
  MatSidenav,
  MatTabGroup,
  MatTable
} from "@angular/material";
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { AreadeatuacaocidadeService } from "./areadeatuacaocidade.service";
import { AppConfirmService } from "../../../shared/services/app-confirm/app-confirm.service";
import { Subscription } from "rxjs";


@Component({
  selector: "app-areadeatuacaocidades",
  templateUrl: "./areadeatuacaocidades.component.html",
  styleUrls: ["./areadeatuacaocidades.component.scss"]
})
export class AreadeatuacaocidadesComponent implements OnInit {
  
  @Input() areadeatuacaoestado_id;
  @Input() estado;
  public id: number;
  public areadeatuacaocidade_id: number = 0;
  public areadeatuacaocidades: any = [];
  public cidades: any = [];
  
  public selectedAreadeatuacaocidade = [];
  public filterForm: FormGroup;
  public areadeatuacaocidadeForm: FormGroup;
  public formulario: boolean;
  public InserirAreadeatuacaocidade: boolean;
  public AlterarAreadeatuacaocidade: boolean;
  public ExcluirAreadeatuacaocidade: boolean;
  public ExportarAreadeatuacaocidades: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  constructor(
    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private areadeatuacaocidadeService: AreadeatuacaocidadeService,
    private confirmService: AppConfirmService
  ) {}

  ngOnInit() {

    this.page_totalElements = 0;
    this.page_pageNumber = 0;
    this.page_size = 10;

    this.filterForm = new FormGroup({
      search: new FormControl("", [Validators.required]),
    });

    this.areadeatuacaocidadeForm    = new FormGroup({
      areadeatuacaoestado_id:                 new FormControl(""),
      cidade_id:                      new FormControl("", [Validators.required])
    });
	
    this.formulario 				        = false;
    this.InserirAreadeatuacaocidade = this.AuthGuard.getPermissao("InserirAreadeatuacaocidade");
    this.AlterarAreadeatuacaocidade = this.AuthGuard.getPermissao("AlterarAreadeatuacaocidade");
    this.ExcluirAreadeatuacaocidade = this.AuthGuard.getPermissao("ExcluirAreadeatuacaocidade");
  }

  ngOnDestroy() {
    
  }

  ngOnChanges()
  {
    
    this.pesquisa = "total";
    
    this.areadeatuacaocidadeService.todosAreadeatuacaocidades(this.areadeatuacaoestado_id,1).subscribe(areadeatuacaocidades => {
      this.areadeatuacaocidades         = areadeatuacaocidades.data;
      this.page_totalElements   		    = areadeatuacaocidades.total;
    });
    this.areadeatuacaocidadeService.obterCidades(this.estado).subscribe(cidades => {
      this.cidades                      = cidades;
    });

  }

  abrirFormulario(id) {
    this.id = id;
    this.formulario = true;

    if (this.id > 0) {
      this.areadeatuacaocidadeService.obterAreadeatuacaocidade(this.id).subscribe(areadeatuacaocidade => {
        this.areadeatuacaocidadeForm.patchValue({ cidade_id: areadeatuacaocidade.cidade_id });
      });
    } else {
      this.areadeatuacaocidadeForm.patchValue({ cidade_id: "" });
    }
  }

  cancelarFormulario() {
    this.formulario = false;
  }

  pesquisarAreadeatuacaocidades(offset = 0) {
    this.pesquisa = "parcial";
    offset = offset + 1;
    this.formulario = false;
    this.loader.open();
    this.areadeatuacaocidadeService
      .pesquisarAreadeatuacaocidades(
        this.areadeatuacaoestado_id,
        offset,
        this.filterForm.value.pesquisarpor,
        this.filterForm.value.search
      )
      .subscribe(areadeatuacaocidades => {
        this.areadeatuacaocidades 			    = areadeatuacaocidades.data;
        this.page_totalElements 			      = areadeatuacaocidades.total;
        this.loader.close();
        if (this.areadeatuacaocidades.length === 0) {
          this.snack.open("Não existe cidade com a pesquisa escolhida!", "OK", {
            duration: 4000
          });
        }
      });
  }

  todosAreadeatuacaocidades(offset = 0) {
    this.pesquisa = "total";
    offset = offset + 1;
    this.formulario = false;
    this.loader.open();
    this.areadeatuacaocidadeService.todosAreadeatuacaocidades(this.areadeatuacaoestado_id,offset).subscribe(areadeatuacaocidades => {
      this.areadeatuacaocidades         = areadeatuacaocidades.data;
      this.page_totalElements   		    = areadeatuacaocidades.total;
      this.loader.close();
      if (this.areadeatuacaocidades.length === 0) {
        this.snack.open("Não existe nenhum registro!", "OK", {
          duration: 4000
        });
      }
    });
  }

  paginacao(pageInfo) {
    this.pagina = pageInfo.offset;
    if (this.pesquisa == "total") {
      this.todosAreadeatuacaocidades(pageInfo.offset);
    } else {
      this.pesquisarAreadeatuacaocidades(pageInfo.offset);
    }
  }

  submit() {

    this.loader.open();
    this.areadeatuacaocidadeForm.patchValue({ areadeatuacaoestado_id: this.areadeatuacaoestado_id });

    if (this.id > 0) {
      this.areadeatuacaocidadeService.atualizarAreadeatuacaocidade(this.id, this.areadeatuacaocidadeForm.value).subscribe(
        data => {
          this.loader.close();
          this.snack.open("Cidade alterada!", "OK", { duration: 4000 });
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
      this.areadeatuacaocidadeService.adicionarAreadeatuacaocidade(this.areadeatuacaocidadeForm.value).subscribe(
        data => {
          this.loader.close();
          this.snack.open("Cidade adicionada!", "OK", { duration: 4000 });
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

  removerAreadeatuacaocidade(row) {
    this.confirmService
      .confirm({ message: `Excluir cidade ${row.cidade.cidade}?` })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.areadeatuacaocidadeService.removerAreadeatuacaocidade(row).subscribe(
            data => {
              this.loader.close();
              this.snack.open("Cidade excluida!", "OK", { duration: 4000 });
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
}