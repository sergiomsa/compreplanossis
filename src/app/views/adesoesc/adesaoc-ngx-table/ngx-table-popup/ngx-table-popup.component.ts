import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,

} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { AdesaocService } from '../../adesaoc.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './ngx-table-popup.component.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class NgxTablePopupComponent implements OnInit {
   [x: string]: any;
  public respostaForm: FormGroup;
 
  constructor(
    private AdesaocService: AdesaocService,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NgxTablePopupComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService
  ) {}

  ngOnInit() {
   
    this.respostaForm = new FormGroup({
      simnao:          new FormControl(true, [Validators.required]),
      resposta_id:     new FormControl(this.data.resposta_id, [Validators.required]),
      quadrogeral:     new FormControl(this.data.quadrogeral, [Validators.required]),
      data:          	 new FormControl(this.data.data, [Validators.required, CustomValidators.date]),
    });

    console.log(this.data.data);

    if (this.data.data ==null)
    {
      var DateObj = new Date();
      var data    = DateObj.getFullYear() + '-' + ('0' + (DateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + DateObj.getDate()).slice(-2);
      this.respostaForm.patchValue({ data: data });
    }
  }

  changeSimNao(event)
  {
     if (!event.checked)
     {
        this.respostaForm.get('resposta_id').clearValidators();
        this.respostaForm.get('quadrogeral').clearValidators();
        this.respostaForm.get('data').clearValidators();
     } else {
        this.respostaForm.get('resposta_id').setValidators([Validators.required]);
        this.respostaForm.get('quadrogeral').setValidators([Validators.required]);
        this.respostaForm.get('data').setValidators([Validators.required, CustomValidators.date]);
     }
     this.respostaForm.get('resposta_id').updateValueAndValidity();
     this.respostaForm.get('quadrogeral').updateValueAndValidity();
     this.respostaForm.get('data').updateValueAndValidity();
  }

  submit() {
    
    if (this.respostaForm.value.simnao)
    {
      this.atualizar();
    } else {
      this.excluir();
    }

  }

  atualizar() {
    this.loader.open();
    this.AdesaocService.atualizarResposta(this.data.beneficiario_id, this.respostaForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Resposta alterada!', 'OK', { duration: 4000 });
                this.dialogRef.close(this.respostaForm.value);
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

  excluir() {
    this.loader.open();
    this.AdesaocService.limparResposta(this.data.id)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Resposta alterada!', 'OK', { duration: 4000 });
                this.dialogRef.close(this.respostaForm.value);
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