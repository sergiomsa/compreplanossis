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
import { ProgramaService } from '../../programa.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './ngx-table-popup.component.html',
  styleUrls: ['./ngx-table-popup.component.css'],
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
  public programaForm: FormGroup;
  situacao: any;
  modulos: any[];

  constructor(
    private programaService: ProgramaService,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NgxTablePopupComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService
  ) {}

  ngOnInit() {
    this.programaForm = new FormGroup({

      name: new FormControl('', [Validators.required]),
      icon: new FormControl(),
      type: new FormControl('', [Validators.required]),
      tooltip: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      badges: new FormControl(''),
      sequencia: new FormControl('', [Validators.required]),
	  menu: new FormControl('', [Validators.required]),
      modulo_id: new FormControl('', [Validators.required]),
      situacao: new FormControl('', [Validators.required])
    });

    if (this.data.payload.id)
    // tslint:disable-next-line:one-line
    {
      this.programaService.obterPrograma(this.data.payload.id).subscribe(programa => {

        this.programaForm.patchValue({ name: programa.name });
        this.programaForm.patchValue({ icon: programa.icon });
        this.programaForm.patchValue({ type: programa.type });
        this.programaForm.patchValue({ tooltip: programa.tooltip });
        this.programaForm.patchValue({ state: programa.state });
        this.programaForm.patchValue({ badges: programa.badges });
        this.programaForm.patchValue({ sequencia: programa.sequencia });
		this.programaForm.patchValue({ menu: programa.menu });
        this.programaForm.patchValue({ modulo_id: programa.modulo_id });
        this.programaForm.patchValue({ situacao: programa.situacao });
        this.situacao             = programa.situacao;
        this.obterModulos();
      });
    } else {
      this.programaForm.patchValue({ situacao: 'Ativo' });
      this.obterModulos();
    }
  }

  submit() {
    /*consistir api para incluir e alterar*/

    this.loader.open();

    if (this.data.payload.id)
    // tslint:disable-next-line:one-line
    {
      this.programaService.updateItem(this.data.payload.id, this.programaForm.value)
      // tslint:disable-next-line:no-shadowed-variable
      .subscribe(data => {
               // this.programas = data;
                this.loader.close();
                this.snack.open('Programa alterado!', 'OK', { duration: 4000 });
                this.dialogRef.close(this.programaForm.value);
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
           this.programaService.addItem(this.programaForm.value)
            // tslint:disable-next-line:no-shadowed-variable
              .subscribe(data => {
                // this.programas = data;
                this.loader.close();
                this.snack.open('Programa Adicionado!', 'OK', { duration: 4000 });
                this.dialogRef.close(this.programaForm.value);
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


  obterModulos() {
    this.programaService.obterModulos().subscribe(response => {
      this.modulos = response;
    });
  }

}
