import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService as AuthGuard } from "../../shared/services/auth/auth.service";
import {
  MatSnackBar,
  MatSidenav,
  MatTabGroup,
  MatTable
} from "@angular/material";
import { AppLoaderService } from "../../shared/services/app-loader/app-loader.service";
import { AbrangenciaService } from "./abrangencia.service";
import { AppConfirmService } from "../../shared/services/app-confirm/app-confirm.service";
import { Subscription } from "rxjs";


@Component({
  selector: "app-abrangencias",
  templateUrl: "./abrangencias.component.html",
  styleUrls: ["./abrangencias.component.scss"]
})
export class AbrangenciasComponent implements OnInit {
  public id: number;
  public abrangencia_id: number = 0;
  public abrangencias: any = [];
  public tab_id: number = 0;
  public selectedAbrangencia = [];
  public filterForm: FormGroup;
  public abrangenciaForm: FormGroup;

  public formulario: boolean;
  public InserirAbrangencia: boolean;
  public AlterarAbrangencia: boolean;
  public ExcluirAbrangencia: boolean;
  public ExportarAbrangencias: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;
  messages 				= {emptyMessage: 'Nenhum registro', loadingMessage: 'Carregando', totalMessage: 'registro(s)', selectedMessage: 'selecionado(s)' };
  
  constructor(
    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private abrangenciaService: AbrangenciaService,
    private confirmService: AppConfirmService
  ) {}

  ngOnInit() {
    this.page_totalElements = 0;
    this.page_pageNumber = 0;
    this.page_size = 10;

    this.filterForm = new FormGroup({
      search: new FormControl("", [Validators.required]),
      pesquisarpor: new FormControl("", [Validators.required])
    });

    this.filterForm.patchValue({ pesquisarpor: "abrangencia" });

    this.abrangenciaForm              = new FormGroup({
      abrangencia:                    new FormControl("", [Validators.required]),
      situacao:                       new FormControl("", [Validators.required])
    });
	
    this.formulario = false;
    this.InserirAbrangencia = this.AuthGuard.getPermissao("InserirAbrangencia");
    this.AlterarAbrangencia = this.AuthGuard.getPermissao("AlterarAbrangencia");
    this.ExcluirAbrangencia = this.AuthGuard.getPermissao("ExcluirAbrangencia");
  }

  ngOnDestroy() {
   
  }

  onSelectAbrangencia({ selected }) {

      this.abrangencia_id = selected[0].id;
        
  }

  abrirFormulario(id) {
    this.id = id;
    this.formulario = true;

    if (this.id > 0) {
      this.abrangenciaService.obterAbrangencia(this.id).subscribe(abrangencia => {
        this.abrangenciaForm.patchValue({ abrangencia: abrangencia.abrangencia });
        this.abrangenciaForm.patchValue({ situacao: abrangencia.situacao });
      });
    } else {
      this.abrangenciaForm.patchValue({ abrangencia: "" });
      this.abrangenciaForm.patchValue({ situacao: "Ativo" });
    }
  }

  cancelarFormulario() {
    this.formulario = false;
  }

  pesquisarAbrangencias(offset = 0) {
    this.pesquisa = "parcial";
    offset = offset + 1;
    this.formulario = false;
    this.loader.open();
    this.abrangenciaService
      .pesquisarAbrangencias(
        offset,
        this.filterForm.value.pesquisarpor,
        this.filterForm.value.search
      )
      .subscribe(abrangencias => {
        this.abrangencias = abrangencias.data;
        this.page_totalElements = abrangencias.total;
        if (this.abrangencias.length > 0) 
        {
          this.abrangencia_id       = this.abrangencias[0].id;
          this.selectedAbrangencia  = [];
          this.selectedAbrangencia.splice(0, this.selectedAbrangencia.length);
          this.selectedAbrangencia.push(this.abrangencias[0]);  
        }
        this.loader.close();
        if (this.abrangencias.length === 0) {
          this.snack.open("Não existe abrangencia com a pesquisa escolhida!", "OK", {
            duration: 4000
          });
        }
      });
  }

  todosAbrangencias(offset = 0) {
    this.pesquisa = "total";
    offset = offset + 1;
    this.formulario = false;
    this.loader.open();
    this.abrangenciaService.todosAbrangencias(offset).subscribe(abrangencias => {
      this.abrangencias         = abrangencias.data;
      this.page_totalElements   = abrangencias.total;
      if (this.abrangencias.length > 0) 
      {
        this.abrangencia_id       = this.abrangencias[0].id;
        this.selectedAbrangencia  = [];
        this.selectedAbrangencia.splice(0, this.selectedAbrangencia.length);
        this.selectedAbrangencia.push(this.abrangencias[0]);
      }
      this.loader.close();
      if (this.abrangencias.length === 0) {
        this.snack.open("Não existe nenhum registro!", "OK", {
          duration: 4000
        });
      }
    });
  }

  paginacao(pageInfo) {
    this.pagina = pageInfo.offset;
    if (this.pesquisa == "total") {
      this.todosAbrangencias(pageInfo.offset);
    } else {
      this.pesquisarAbrangencias(pageInfo.offset);
    }
  }

  submit() {
    this.loader.open();

    if (this.id > 0) {
      this.abrangenciaService.atualizarAbrangencia(this.id, this.abrangenciaForm.value).subscribe(
        data => {
          this.loader.close();
          this.snack.open("Abrangencia alterada!", "OK", { duration: 4000 });
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
      this.abrangenciaService.adicionarAbrangencia(this.abrangenciaForm.value).subscribe(
        data => {
          this.loader.close();
          this.snack.open("Abrangencia adicionada!", "OK", { duration: 4000 });
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

  removerAbrangencia(row) {
    this.confirmService
      .confirm({ message: `Excluir abrangencia ${row.abrangencia}?` })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.abrangenciaService.removerAbrangencia(row).subscribe(
            data => {
              this.loader.close();
              this.snack.open("Abrangencia excluido!", "OK", { duration: 4000 });
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