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
import { PermissionService } from '../../permission.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './ngx-table-popup.component.html',
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class NgxTablePopupComponent implements OnInit {
  [x: string]: any;
  public permissionForm: FormGroup;
  situacao: any;
  programas: any[];

  constructor(
    private permissionService: PermissionService,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NgxTablePopupComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService
  ) {}

  ngOnInit() {
    this.permissionForm = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      descricao: new FormControl(),
      programa_id: new FormControl('', [Validators.required]),
      situacao: new FormControl('', [Validators.required])
    });

    if (this.data.payload.id)
    // tslint:disable-next-line:one-line
    {
      this.permissionService.obterPermission(this.data.payload.id).subscribe(permission => {

        this.permissionForm.patchValue({ nome: permission.nome });
        this.permissionForm.patchValue({ descricao: permission.descricao });
        this.permissionForm.patchValue({ programa_id: permission.programa_id });
        this.permissionForm.patchValue({ situacao: permission.situacao });
        this.obterProgramas();
      });
    } else {
      this.permissionForm.patchValue({ situacao: 'Ativo' });
      this.obterProgramas();
    }
  }

  submit() {
    /*consistir api para incluir e alterar*/

    this.loader.open();

    if (this.data.payload.id)
    // tslint:disable-next-line:one-line
    {
      this.permissionService.updateItem(this.data.payload.id, this.permissionForm.value)
      // tslint:disable-next-line:no-shadowed-variable
      .subscribe(data => {
               // this.permissions = data;
                this.loader.close();
                this.snack.open('Permissão alterada!', 'OK', { duration: 4000 });
                this.dialogRef.close(this.permissionForm.value);
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
           this.permissionService.addItem(this.permissionForm.value)
            // tslint:disable-next-line:no-shadowed-variable
              .subscribe(data => {
                // this.permissions = data;
                this.loader.close();
                this.snack.open('Permissão Adicionado!', 'OK', { duration: 4000 });
                this.dialogRef.close(this.permissionForm.value);
              },
              (error => {
                 this.loader.close();
                 let message = '';
                 if (error.error)
                 // tslint:disable-next-line:one-line
                 {
                    for (const k in error.error) message += error.error[k] + '|';
                 }
                 this.snack.open(message, 'OK', { duration: 6000 });
            })
         );
    }
   // console.log(this.clienteForm.value);
    // const title = isNew ? 'Adicionar Cliente' : 'Alterar Cliente';
    // this.dialogRef.close(this.clienteForm.value);
    /* */
  }


  obterProgramas() {
    this.permissionService.obterProgramas().subscribe(response => {
      this.programas = response;
    });
  }

}
