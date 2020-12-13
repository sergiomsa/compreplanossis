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
import { AreadeatuacaoestadoService } from "./areadeatuacaoestado.service";
import { AppConfirmService } from "../../../shared/services/app-confirm/app-confirm.service";
import { Subscription } from "rxjs";


@Component({
  selector: "app-areadeatuacaoestados",
  templateUrl: "./areadeatuacaoestados.component.html",
  styleUrls: ["./areadeatuacaoestados.component.scss"]
})
export class AreadeatuacaoestadosComponent implements OnInit {
  
  @Input() abrangencia_id;
  public id: number;
  public areadeatuacaoestado_id: number = 0;
  public estado: string = '';
  public areadeatuacaoestados: any = [];
  public estados: any = [];
  
  public selectedAreadeatuacaoestado = [];
  public filterForm: FormGroup;
  public areadeatuacaoestadoForm: FormGroup;
  public formulario: boolean;
  public InserirAreadeatuacaoestado: boolean;
  public AlterarAreadeatuacaoestado: boolean;
  public ExcluirAreadeatuacaoestado: boolean;
  public ExportarAreadeatuacaoestados: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  constructor(
    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private areadeatuacaoestadoService: AreadeatuacaoestadoService,
    private confirmService: AppConfirmService
  ) {}

  ngOnInit() {

    this.areadeatuacaoestadoService.obterEstados().subscribe(estados => {
      this.estados                      = estados;
    });

    this.page_totalElements = 0;
    this.page_pageNumber = 0;
    this.page_size = 10;

    this.filterForm = new FormGroup({
      search: new FormControl("", [Validators.required]),
    });

    this.areadeatuacaoestadoForm    = new FormGroup({
      abrangencia_id:                 new FormControl(""),
      estado_id:                      new FormControl("", [Validators.required])
    });
	
    this.formulario 				        = false;
    this.InserirAreadeatuacaoestado = this.AuthGuard.getPermissao("InserirAreadeatuacaoestado");
    this.AlterarAreadeatuacaoestado = this.AuthGuard.getPermissao("AlterarAreadeatuacaoestado");
    this.ExcluirAreadeatuacaoestado = this.AuthGuard.getPermissao("ExcluirAreadeatuacaoestado");
  }

  ngOnDestroy() {
    
  }

  ngOnChanges()
  {
    this.pesquisa = "total";
    this.areadeatuacaoestadoService.todosAreadeatuacaoestados(this.abrangencia_id,1).subscribe(areadeatuacaoestados => {
      this.areadeatuacaoestados         = areadeatuacaoestados.data;
      this.page_totalElements   		    = areadeatuacaoestados.total;
      if (this.areadeatuacaoestados.length > 0) {
         this.areadeatuacaoestado_id       = this.areadeatuacaoestados[0].id;
         this.estado                       = this.areadeatuacaoestados[0].estado.uf;
         this.selectedAreadeatuacaoestado  = [];
         this.selectedAreadeatuacaoestado.splice(0, this.selectedAreadeatuacaoestado.length);
         this.selectedAreadeatuacaoestado.push(this.areadeatuacaoestados[0]);
      }
    });
  }

  onSelectAreadeatuacaoestado({ selected }) {
    this.areadeatuacaoestado_id = selected[0].id;
    this.estado                 = selected[0].estado.uf;
  }

  abrirFormulario(id) {
    this.id = id;
    this.formulario = true;

    if (this.id > 0) {
      this.areadeatuacaoestadoService.obterAreadeatuacaoestado(this.id).subscribe(areadeatuacaoestado => {
        this.areadeatuacaoestadoForm.patchValue({ estado_id: areadeatuacaoestado.estado_id });
      });
    } else {
      this.areadeatuacaoestadoForm.patchValue({ estado_id: "" });
    }
  }

  cancelarFormulario() {
    this.formulario = false;
  }

  pesquisarAreadeatuacaoestados(offset = 0) {
    this.pesquisa = "parcial";
    offset = offset + 1;
    this.formulario = false;
    this.loader.open();
    this.areadeatuacaoestadoService
      .pesquisarAreadeatuacaoestados(
        this.abrangencia_id,
        offset,
        this.filterForm.value.pesquisarpor,
        this.filterForm.value.search
      )
      .subscribe(areadeatuacaoestados => {
        this.areadeatuacaoestados 			    = areadeatuacaoestados.data;
        this.page_totalElements 			      = areadeatuacaoestados.total;
         
        if (this.areadeatuacaoestados.length > 0) {
          this.areadeatuacaoestado_id       	= this.areadeatuacaoestados[0].id;
          this.estado                         = this.areadeatuacaoestados[0].estado.uf;
          this.selectedAreadeatuacaoestado  	= [];
          this.selectedAreadeatuacaoestado.splice(0, this.selectedAreadeatuacaoestado.length);
          this.selectedAreadeatuacaoestado.push(this.areadeatuacaoestados[0]);  
        }

        this.loader.close();
        if (this.areadeatuacaoestados.length === 0) {
          this.snack.open("Não existe estado com a pesquisa escolhida!", "OK", {
            duration: 4000
          });
        }
      });
  }

  todosAreadeatuacaoestados(offset = 0) {
    this.pesquisa = "total";
    offset = offset + 1;
    this.formulario = false;
    this.loader.open();
    this.areadeatuacaoestadoService.todosAreadeatuacaoestados(this.abrangencia_id,offset).subscribe(areadeatuacaoestados => {
      this.areadeatuacaoestados         = areadeatuacaoestados.data;
      this.page_totalElements   		    = areadeatuacaoestados.total;
      if (this.areadeatuacaoestados.length > 0) {
          this.areadeatuacaoestado_id       = this.areadeatuacaoestados[0].id;
          this.estado                       = this.areadeatuacaoestados[0].estado.uf;
          this.selectedAreadeatuacaoestado  = [];
          this.selectedAreadeatuacaoestado.splice(0, this.selectedAreadeatuacaoestado.length);
          this.selectedAreadeatuacaoestado.push(this.areadeatuacaoestados[0]);
      }
      this.loader.close();
      if (this.areadeatuacaoestados.length === 0) {
        this.snack.open("Não existe nenhum registro!", "OK", {
          duration: 4000
        });
      }
    });
  }

  paginacao(pageInfo) {
    this.pagina = pageInfo.offset;
    if (this.pesquisa == "total") {
      this.todosAreadeatuacaoestados(pageInfo.offset);
    } else {
      this.pesquisarAreadeatuacaoestados(pageInfo.offset);
    }
  }

  submit() {

    this.loader.open();
    this.areadeatuacaoestadoForm.patchValue({ abrangencia_id: this.abrangencia_id });

    if (this.id > 0) {
      this.areadeatuacaoestadoService.atualizarAreadeatuacaoestado(this.id, this.areadeatuacaoestadoForm.value).subscribe(
        data => {
          this.loader.close();
          this.snack.open("Estado alterado!", "OK", { duration: 4000 });
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
      this.areadeatuacaoestadoService.adicionarAreadeatuacaoestado(this.areadeatuacaoestadoForm.value).subscribe(
        data => {
          this.loader.close();
          this.snack.open("Estado adicionado!", "OK", { duration: 4000 });
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

  removerAreadeatuacaoestado(row) {
    this.confirmService
      .confirm({ message: `Excluir estado ${row.estado.estado}?` })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.areadeatuacaoestadoService.removerAreadeatuacaoestado(row).subscribe(
            data => {
              this.loader.close();
              this.snack.open("Estado excluido!", "OK", { duration: 4000 });
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