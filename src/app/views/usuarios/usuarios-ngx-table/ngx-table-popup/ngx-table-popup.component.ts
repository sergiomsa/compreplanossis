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
  FormControl,

} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { UsuarioService } from '../../usuario.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';


@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './ngx-table-popup.component.html'
})
export class NgxTablePopupComponent implements OnInit {
  /*  */
  [x: string]: any;
  /*  */
  public usuarioForm: FormGroup;
  /*  */
  roles: any;

  constructor(
    private usuarioService: UsuarioService,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NgxTablePopupComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService
  ) {}

  ngOnInit() {
	
	const senha 			    = new FormControl('', Validators.required);
  const confirSenha 		= new FormControl('', CustomValidators.equalTo(senha));
	
    /* FormControl: Rastreia o valor e o status de validação de um contusuario de formulário individual */
    this.usuarioForm = new FormGroup({
      /* passa o campo cnpj  - vazio e requer validação */
      name:              new FormControl('', [Validators.required]),
      email:             new FormControl('', [Validators.required, Validators.email]),
      role_id:           new FormControl('', [Validators.required]),
      corretora_id:      new FormControl(),
      operadora_id:      new FormControl(),
      tipodeplano_id:    new FormControl(),
      senha:             !this.data.payload.id ? senha : new FormControl(''),
      confirSenha:       confirSenha
    });

    this.usuarioService.obterRoles().subscribe(roles => {
      this.roles = roles;
    });

    this.usuarioService.obterCorretoras().subscribe(corretoras => {
      this.corretoras = corretoras;
    });

    this.usuarioService.obterOperadoras().subscribe(operadoras => {
      this.operadoras = operadoras;
    });

    this.usuarioService.obterTiposdeplano().subscribe(tiposdeplano => {
      this.tiposdeplano = tiposdeplano;
    });

    /*  */
    if (this.data.payload.id)
    // tslint:disable-next-line:one-line
    {
      /*  */
      this.usuarioService.obterUsuario(this.data.payload.id).subscribe(usuario => {
        this.usuarioForm.patchValue({ name: usuario.name });
        this.usuarioForm.patchValue({ email: usuario.email });
        this.usuarioForm.patchValue({ role_id: usuario.role_id });
        this.usuarioForm.patchValue({ corretora_id: usuario.corretora_id });
        this.usuarioForm.patchValue({ operadora_id: usuario.operadora_id });
        this.usuarioForm.patchValue({ tipodeplano_id: usuario.tipodeplano_id });
      });
    }
	this.usuarioForm.patchValue({ senha: '' });
	this.usuarioForm.patchValue({ confirSenha: '' });
  }

  submit() {
    /*consistir api para incluir e alterar*/
    this.loader.open();
 
    if (this.data.payload.id)
    // tslint:disable-next-line:one-line
    {
      this.usuarioService.updateItem(this.data.payload.id, this.usuarioForm.value)
      // tslint:disable-next-line:no-shadowed-variable
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Usuário alterado!', 'OK', { duration: 4000 });
                this.dialogRef.close(this.usuarioForm.value);
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
           this.usuarioService.addItem(this.usuarioForm.value)
            // tslint:disable-next-line:no-shadowed-variable
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Usuário Adicionado!', 'OK', { duration: 4000 });
                this.dialogRef.close(this.usuarioForm.value);
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
  }


}
