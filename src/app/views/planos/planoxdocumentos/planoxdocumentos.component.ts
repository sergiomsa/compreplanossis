import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../../shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { PlanoxdocumentosService } from "./planoxdocumentos.service";
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';

@Component({
  selector: "app-planoxdocumentos",
  templateUrl: "./planoxdocumentos.component.html",
  styleUrls: ["./planoxdocumentos.component.scss"]
})
export class PlanoxdocumentosComponent implements OnInit {
  
  @Input() plano_id;
  @ViewChild("fileInput") fileInput;
  public id: number;
  public planoxdocumentoForm: FormGroup;
  public formulario: boolean;
  public pdf: boolean;
  public documento: any;
  public InserirPlanoxdocumento: boolean;
  public AlterarPlanoxdocumento: boolean;
  public ExcluirPlanoxdocumento: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;
  public planoxdocumentos: any = [];
   
  constructor(
    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private planoxdocumentosService: PlanoxdocumentosService,
    private confirmService: AppConfirmService
  ) {}

  ngOnInit() {
    
    this.planoxdocumentoForm =  new FormGroup({
      plano_id:                 new FormControl(''),
      documento:           		  new FormControl('', [Validators.required]),
	    docfile:                  new FormControl('')
    });

    this.page_totalElements     = 0;
    this.page_pageNumber        = 0;
    this.page_size              = 10;
    this.formulario             = false;
    this.pdf                    = false;
    this.InserirPlanoxdocumento = this.AuthGuard.getPermissao('InserirPlanoxdocumento');
    this.AlterarPlanoxdocumento = this.AuthGuard.getPermissao('AlterarPlanoxdocumento');
    this.ExcluirPlanoxdocumento = this.AuthGuard.getPermissao('ExcluirPlanoxdocumento');

  }

  ngOnChanges()
  {
   
	this.planoxdocumentosService.todosPlanoxdocumentos(this.plano_id,1)
        .subscribe(planoxdocumentos => {
          this.planoxdocumentos 	  	= planoxdocumentos.data;
          this.page_totalElements 		= planoxdocumentos.total;
          if (this.planoxdocumentos.length === 0)
          {
            this.snack.open('Não existe nenhum registro de documento!', 'OK', { duration: 4000 });
          }
        });
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;
    this.pdf        = false;

    if (this.id > 0)
    {
      this.planoxdocumentosService.obterPlanoxdocumento(this.id).subscribe(planoxdocumento => {
      this.planoxdocumentoForm.patchValue({ documento: planoxdocumento.documento });
      });
    } else {
      this.planoxdocumentoForm.patchValue({ documento: '' });
	    this.planoxdocumentoForm.patchValue({ docfile: '' });
    }

  }

  verDocumento(documento) 
  {
    this.pdf        = true;
    this.documento  = documento;
  }
  cancelarFormulario() {
    this.formulario = false;
    this.pdf        = false;
  }

   todosPlanoxdocumentos(offset=0) {
    this.pesquisa   ='total';
    offset          = offset+1;
    this.formulario = false;
    this.pdf        = false;
      //this.loader.open();
    this.planoxdocumentosService.todosPlanoxdocumentos(this.plano_id,offset)
        .subscribe(planoxdocumentos => {
          this.planoxdocumentos 	  	= planoxdocumentos.data;
          this.page_totalElements 		= planoxdocumentos.total;
          this.loader.close();
          if (this.planoxdocumentos.length === 0)
          {
            this.snack.open('Não existe nenhum registro de documento!', 'OK', { duration: 4000 });
          }
        });

  }

  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    this.todosPlanoxdocumentos(pageInfo.offset);
  }

  submit() {
 
    this.planoxdocumentoForm.patchValue({ plano_id: this.plano_id });
	  const documento			= this.fileInput.nativeElement;
    const formdata 			= new FormData();
    if (documento.files[0])
    {
      formdata.append("file", documento.files[0]);
    }
	  formdata.append("plano_id",  this.plano_id);
    formdata.append("documento", this.planoxdocumentoForm.value.documento);
	
    if (this.id > 0)
    {
	    this.loader.open();
      this.planoxdocumentosService.atualizarPlanoxdocumento(this.id, formdata)
			.subscribe(data => {
                this.loader.close();
                this.snack.open('Documento alterado!', 'OK', { duration: 4000 });
                this.formulario = false;
                this.paginacao({ offset: this.pagina });
            },
            (error => {
              console.log(error);
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
	     this.loader.open();
       this.planoxdocumentosService.adicionarPlanoxdocumento(formdata)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Documento adicionado!', 'OK', { duration: 4000 });
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

  removerPlanoxdocumento(row) {

    this.confirmService.confirm({message: `Excluir Documento ${row.documento}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.planoxdocumentosService.removerPlanoxdocumento(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Documento excluido!', 'OK', { duration: 4000 });
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

}