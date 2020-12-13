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
import { RoleService } from '../../role.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './ngx-table-popup.component.html'
})
export class NgxTablePopupComponent implements OnInit {
  /*  */
  [x: string]: any;
  /*  */
  public roleForm: FormGroup;
  /*  */
  situacao: any;

  /* mascaras usadas nos campos que necessitam validar as informações passadas */
  // public masktelefone = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  // public maskcelular  = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  // public maskcnpj     = [ /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/ ];
  // public maskcep      = [ /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/ ];
  // public maskdata     = [ /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/ ];

  constructor(
    private roleService: RoleService,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NgxTablePopupComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService
  ) {}

  ngOnInit() {
    /* FormControl: Rastreia o valor e o status de validação de um controle de formulário individual */
    this.roleForm = new FormGroup({
      /* passa o campo cnpj  - vazio e requer validação */
      nome:             new FormControl('', [Validators.required]),
      descricao:        new FormControl(),
      situacao:         new FormControl('', [Validators.required])
    });

    /*  */
    if (this.data.payload.id)
    // tslint:disable-next-line:one-line
    {
      /*  */
      this.roleService.obterRole(this.data.payload.id).subscribe(role => {
        this.roleForm.patchValue({ nome: role.nome });
        this.roleForm.patchValue({ descricao: role.descricao });
        this.roleForm.patchValue({ situacao: role.situacao });
      });
    } else {
      this.roleForm.patchValue({ situacao: 'Ativo' });
    }
  }

  submit() {
    /*consistir api para incluir e alterar*/

    this.loader.open();

    if (this.data.payload.id)
    // tslint:disable-next-line:one-line
    {
      this.roleService.updateItem(this.data.payload.id, this.roleForm.value)
      // tslint:disable-next-line:no-shadowed-variable
      .subscribe(data => {
               // this.roles = data;
                this.loader.close();
                this.snack.open('Papéis alterado!', 'OK', { duration: 4000 });
                this.dialogRef.close(this.roleForm.value);
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
           this.roleService.addItem(this.roleForm.value)
            // tslint:disable-next-line:no-shadowed-variable
              .subscribe(data => {
                // this.items = data;
                this.loader.close();
                this.snack.open('Papéis Adicionado!', 'OK', { duration: 4000 });
                this.dialogRef.close(this.roleForm.value);
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
   // console.log(this.roleForm.value);
    // const title = isNew ? 'Adicionar Role' : 'Alterar Role';
    // this.dialogRef.close(this.roleForm.value);
    /* */
  }

  /*obterCep() {
    this.roleService.cep(this.roleForm.value.cep).subscribe(endereco => {
      this.roleForm.patchValue({ logradouro: endereco.logradouro });
      this.roleForm.patchValue({ bairro: endereco.bairro });
      this.roleForm.patchValue({ cidade: endereco.localidade });
      this.roleForm.patchValue({ estado: endereco.uf });
    });
  }

  obterRegrasdecalculo() {
    this.roleService.obterRegrasdecalculo().subscribe(response => {
      this.regrasdecalculo = response;
      console.log('regra', this.roleForm.value.regradecalculo_id);
    });
  }

  obterFormasdecobranca() {
    this.roleService.obterFormasdecobranca().subscribe(response => {
      this.formasdecobranca = response;
      console.log('forma', this.roleForm.value.formadecobranca_id);
    });
  }*/

}
