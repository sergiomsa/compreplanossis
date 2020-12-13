import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../shared/services/app-loader/app-loader.service';
import { ProcedimentoService } from './procedimento.service';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-procedimentos',
  templateUrl: './procedimentos.component.html',
  styleUrls: ['./procedimentos.component.scss']
})
export class ProcedimentosComponent implements OnInit {

  public id: number;
  public filterForm: FormGroup;
  public procedimentoForm: FormGroup;

  public getProcedimentoSub: Subscription;

  public formulario: boolean;
  public InserirProcedimento: boolean;
  public AlterarProcedimento: boolean;
  public ExcluirProcedimento: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  procedimentos: any = [];
  situacao: any;
  grupos: any;

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private procedimentoService: ProcedimentoService,
    private confirmService: AppConfirmService

  ) { }

  ngOnInit() {

    this.page_totalElements = 0;
    this.page_pageNumber = 0;
    this.page_size = 10;

    this.filterForm = new FormGroup({
      search:         new FormControl('', [Validators.required]),
      pesquisarpor:   new FormControl('', [Validators.required])
    });

    this.filterForm.patchValue({ pesquisarpor: 'procedimento' });

    this.procedimentoForm  = new FormGroup({
      codigo:                 new FormControl('', [Validators.required]),
      procedimento:           new FormControl('', [Validators.required]),
      descricao:              new FormControl('', [Validators.required]),
      grupo_id:               new FormControl('', [Validators.required]),
      rolans:                 new FormControl('', [Validators.required]),
      carencia:               new FormControl('', [Validators.required]),
      tempo:                  new FormControl(),
      situacao:               new FormControl('', [Validators.required]),
    });

    this.formulario         = false;

    this.InserirProcedimento =  this.AuthGuard.getPermissao('InserirProcedimento');
    this.AlterarProcedimento =  this.AuthGuard.getPermissao('AlterarProcedimento');
    this.ExcluirProcedimento =  this.AuthGuard.getPermissao('ExcluirProcedimento');

    this.obterGrupos();
   

  }

  ngOnDestroy() {
    if (this.getProcedimentoSub) {
      this.getProcedimentoSub.unsubscribe();
    }
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.procedimentoService.obterProcedimento(this.id).subscribe(procedimento => {
        if (procedimento.rolans=='S')
        {
          procedimento.rolans	= true;
        } else {
          procedimento.rolans	= false;
        }
        this.procedimentoForm.patchValue({ codigo: procedimento.codigo });
        this.procedimentoForm.patchValue({ procedimento: procedimento.procedimento });
        this.procedimentoForm.patchValue({ descricao: procedimento.descricao });
        this.procedimentoForm.patchValue({ grupo_id: procedimento.grupo_id });
        this.procedimentoForm.patchValue({ rolans: procedimento.rolans });
        this.procedimentoForm.patchValue({ carencia: procedimento.carencia });
        this.procedimentoForm.patchValue({ tempo: procedimento.tempo });
        this.procedimentoForm.patchValue({ situacao: procedimento.situacao });
       
      });
    } else {
       this.procedimentoForm.patchValue({ codigo:'' });
       this.procedimentoForm.patchValue({ procedimento:'' });
       this.procedimentoForm.patchValue({ descricao: '' });
       this.procedimentoForm.patchValue({ grupo_id: '' });
       this.procedimentoForm.patchValue({ rolans: false });
       this.procedimentoForm.patchValue({ carencia: '' });
       this.procedimentoForm.patchValue({ tempo: '' });
       this.procedimentoForm.patchValue({ situacao: 'Ativo' });
    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  obterProcedimentos() {

    this.getProcedimentoSub = this.procedimentoService.obterProcedimentos()
      .subscribe(procedimentos => {
        this.procedimentos = procedimentos;
      });
  }

  pesquisarProcedimentos(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
     this.loader.open();
     this.procedimentoService.pesquisarProcedimentos(offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(procedimentos => {
          this.procedimentos        = procedimentos.data;
          this.page_totalElements   = procedimentos.total;
          this.loader.close();
          if (this.procedimentos.length === 0)
          {
            this.snack.open('Não existe procedimento com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  todosProcedimentos(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.procedimentoService.todosProcedimentos(offset)
        .subscribe(procedimentos => {
          this.procedimentos = procedimentos.data;
          this.page_totalElements = procedimentos.total;
          this.loader.close();
          if (this.procedimentos.length === 0)
          {
            this.snack.open('Não existe nenhum registro!', 'OK', { duration: 4000 });
          }
        });

  }


  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todosProcedimentos(pageInfo.offset);
    } else {
      this.pesquisarProcedimentos(pageInfo.offset);
    }
  }


  submit() {

    this.loader.open();

    if (this.id > 0)
    {
      this.procedimentoService.atualizarProcedimento(this.id, this.procedimentoForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Procedimento alterado!', 'OK', { duration: 4000 });
                this.formulario = false;
                this.paginacao({ offset: this.pagina });
            },
            (error => {
               this.loader.close();
               let message = '';
               if (error.error)
               {
                    for (const k in error.error)
                    message += error.error[k] + ' | ';
               }
               this.snack.open(message, 'OK', { duration: 6000 });
          })
       );
    } else {
           this.procedimentoService.adicionarProcedimento(this.procedimentoForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Procedimento adicionado!', 'OK', { duration: 4000 });
                this.formulario = false;
                this.paginacao({ offset: this.pagina });
              },
              (error => {
                 this.loader.close();
                 let message = '';
                 if (error.error)
                 {
                      for (const k in error.error)
                          message += error.error[k] + ' | ';
                 }
                 this.snack.open(message, 'OK', { duration: 6000 });
            })
         );
    }
  }

  removerProcedimento(row) {
    this.confirmService.confirm({message: `Excluir ${row.procedimento}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.procedimentoService.removerProcedimento(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Procedimento excluido!', 'OK', { duration: 4000 });
              this.paginacao({ offset: this.pagina });
            },
            error => {
              this.loader.close();
              this.snack.open(error.error.id[0], 'OK', { duration: 6000 });
            }
          );
        }
      });
  }

  obterGrupos() {
    this.procedimentoService.obterGrupo().subscribe(response => {
      this.grupos = response;
    });
  }

  
}
