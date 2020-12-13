import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatAutocomplete,
  MatSnackBar
} from '@angular/material';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ModuloService } from '../../modulo.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './ngx-table-popup.component.html'
})
export class NgxTablePopupComponent implements OnInit {
  /*  */
  [x: string]: any;
  /*  */
  public moduloForm: FormGroup;
  /*  */
  situacao: any;

  /* mascaras usadas nos campos que necessitam validar as informações passadas */
  // public masktelefone = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  // public maskcelular  = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  // public maskcnpj     = [ /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/ ];
  // public maskcep      = [ /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/ ];
  // public maskdata     = [ /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/ ];

  constructor(
    private moduloService: ModuloService,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NgxTablePopupComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService
  ) {}

  ngOnInit() {
    /* FormControl: Rastreia o valor e o status de validação de um controle de formulário individual */
    this.moduloForm = new FormGroup({
      /* passa o campo cnpj  - vazio e requer validação */
      modulo:       new FormControl('', [Validators.required]),
      sequencia:    new FormControl('', [Validators.required]),
      icone:        new FormControl('', [Validators.maxLength(100)]),
      situacao:     new FormControl('', [Validators.required])
    });

    /*  */
    if (this.data.payload.id)
    // tslint:disable-next-line:one-line
    {
      /*  */
      this.moduloService.obterModulo(this.data.payload.id).subscribe(modulo => {
        this.moduloForm.patchValue({ modulo: modulo.modulo });
        this.moduloForm.patchValue({ sequencia: modulo.sequencia });
        this.moduloForm.patchValue({ icone: modulo.icone });
        this.moduloForm.patchValue({ situacao: modulo.situacao });
      });
    } else {
      this.moduloForm.patchValue({ situacao: 'Ativo' });
    }
  }

  submit() {
    /*consistir api para incluir e alterar*/

    this.loader.open();

    if (this.data.payload.id)
    // tslint:disable-next-line:one-line
    {
      this.moduloService.updateItem(this.data.payload.id, this.moduloForm.value)
      // tslint:disable-next-line:no-shadowed-variable
      .subscribe(data => {
               // this.modulos = data;
                this.loader.close();
                this.snack.open('Módulo alterado!', 'OK', { duration: 4000 });
                this.dialogRef.close(this.moduloForm.value);
            },
            (error => {
               this.loader.close();
               let message = '';
               if (error.error)
               // tslint:disable-next-line:one-line
               {
                    // tslint:disable-next-line:curly
                    // tslint:disable-next-line:forin
                    for (const k in error.error)
                    message += error.error[k] + ' | ';
               }
               this.snack.open(message, 'OK', { duration: 6000 });
          })
       );
    } else {
           this.moduloService.addItem(this.moduloForm.value)
            // tslint:disable-next-line:no-shadowed-variable
              .subscribe(data => {
                // this.items = data;
                this.loader.close();
                this.snack.open('Módulo Adicionado!', 'OK', { duration: 4000 });
                this.dialogRef.close(this.moduloForm.value);
              },
              (error => {
                 this.loader.close();
                 let message = '';
                 if (error.error)
                 // tslint:disable-next-line:one-line
                 {
                      // tslint:disable-next-line:curly
                      for (const k in error.error)
                          message += error.error[k] + ' | ';
                 }
                 this.snack.open(message, 'OK', { duration: 6000 });
            })
         );
    }
   // console.log(this.moduloForm.value);
    // const title = isNew ? 'Adicionar Modulo' : 'Alterar Modulo';
    // this.dialogRef.close(this.moduloForm.value);
    /* */
  }

  /*obterCep() {
    this.moduloService.cep(this.moduloForm.value.cep).subscribe(endereco => {
      this.moduloForm.patchValue({ logradouro: endereco.logradouro });
      this.moduloForm.patchValue({ bairro: endereco.bairro });
      this.moduloForm.patchValue({ cidade: endereco.localidade });
      this.moduloForm.patchValue({ estado: endereco.uf });
    });
  }

  obterRegrasdecalculo() {
    this.moduloService.obterRegrasdecalculo().subscribe(response => {
      this.regrasdecalculo = response;
      console.log('regra', this.moduloForm.value.regradecalculo_id);
    });
  }

  obterFormasdecobranca() {
    this.moduloService.obterFormasdecobranca().subscribe(response => {
      this.formasdecobranca = response;
      console.log('forma', this.moduloForm.value.formadecobranca_id);
    });
  }*/

}
