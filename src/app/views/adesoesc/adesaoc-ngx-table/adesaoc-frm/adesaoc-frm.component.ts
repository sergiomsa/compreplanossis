import { Component, OnInit, ViewChild , Input,  Output, EventEmitter} from '@angular/core';
import { AdesaocService } from '../../adesaoc.service';
import { MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { egretAnimations } from '../../../../shared/animations/egret-animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AuthService as AuthGuard }          from "../../../../shared/services/auth/auth.service";
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-adesaoc-frm',
  templateUrl: './adesaoc-frm.component.html',
  styleUrls: ['./adesaoc-frm.component.css'],
  animations: egretAnimations,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class AdesaocFrmComponent implements OnInit {

  @Input() selectedIndex: number;
  @Input() adesao_id: number;
  @Output() saida = new EventEmitter();

  public id: any;
  public valueChangeAdesao: any;
  public adesoes: any = [];
  public planoxfaixasetarias: any = []; 
  public planoxecarencias: any = []; 
  public planoxcoparticipacoes: any = []; 
  public adesao: any = [];
  public alteradoAdesao: boolean = false;
  public alteradoBeneficiario: boolean = false;
  public RejeitarAdesao: boolean;
  public SalvarAdesao: boolean;
  public planoForm: FormGroup;
  public cancelamentoForm: FormGroup;
  public rejeitarForm: FormGroup;
  public PreAprovarAdesao: boolean;
  public CancelarAdesao: boolean;
  public AprovarAdesao: boolean;

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private AdesaocService: AdesaocService,
    private loader: AppLoaderService,
    private confirmService: AppConfirmService,
    public AuthGuard: AuthGuard,
  ) { }

  ngOnInit() {

    this.planoForm = new FormGroup({
      plano:                new FormControl(''),
      tipo:                 new FormControl(''),
      registro:             new FormControl(''),
      segmentacao:          new FormControl(''),
      vendedor:             new FormControl(''),
      telefonev:            new FormControl(''),
      corretora:            new FormControl(''),
      telefonec:            new FormControl(''),
      equipe:               new FormControl(''),
      registrada:           new FormControl(''),
      confirmada:           new FormControl(''),
      situacao:             new FormControl(''),
      qtdevidas:            new FormControl(''),
      valor:                new FormControl(''),
      diavencimento:        new FormControl(''),
      iniciovigencia:       new FormControl('', [Validators.required,CustomValidators.date]),
    });

    this.cancelamentoForm = new FormGroup({
      motivo: 		  	  new FormControl('',[Validators.required]),
    });

    this.rejeitarForm = new FormGroup({
      motivo: 		  	  new FormControl('',[Validators.required]),
    });

    this.planoForm.disable();
    this.PreAprovarAdesao		      = this.AuthGuard.getPermissao("PreAprovarAdesao");
    this.CancelarAdesao		        = this.AuthGuard.getPermissao("CancelarAdesao");
    this.AprovarAdesao		        = this.AuthGuard.getPermissao("AprovarAdesao");
    this.RejeitarAdesao		        = this.AuthGuard.getPermissao("RejeitarAdesao");
    this.SalvarAdesao		          = this.AuthGuard.getPermissao("SalvarAdesao");

    if (this.SalvarAdesao)
    {
      this.planoForm.valueChanges.subscribe(
        (value: string) => {     
          this.alteradoAdesao    = true;
      });
    }

    this.formularioPlano(this.adesao_id);
  }
  
  ngOnChanges()
  {
  }
  
  podePreaprovar()
  {
    if (this.adesao.csituacao == 'C' || this.adesao.csituacao == 'D')
    {
      return true;
    }

    return false;

  }

  podeAprovar()
  {
    if (this.adesao.csituacao == 'P' || this.adesao.csituacao == 'E' || this.adesao.csituacao == 'M' || this.adesao.csituacao == 'X')
    {
      return true;
    }

    return false;
    
  }

  formatarData(data) {

    let datav = data;
    let dataa = [];

    if ((typeof datav === 'string') && (datav.indexOf('-'))) {
      dataa = datav.split('-');
      datav = dataa[2] + '/' + dataa[1] + '/' + dataa[0];
    } else {
      if ((typeof datav === 'string') && (datav.indexOf('/'))) {
      } else {
        try {
          datav = datav.format('DD/MM/YYYY');
        } catch (e) {
          let day = datav && datav.getDate() || -1;
          let dayWithZero = day.toString().length > 1 ? day : '0' + day;
          let month = datav && datav.getMonth() + 1 || -1;
          let monthWithZero = month.toString().length > 1 ? month : '0' + month;
          let year = datav && datav.getFullYear() || -1;
          datav = dayWithZero + '/' + monthWithZero + '/' + year;
        }
      }
    }

    return datav;

  }

  onRetornarAdesao()
  {
    this.planoForm.patchValue({ iniciovigencia: this.adesao.iniciovigencia });
    this.alteradoAdesao       = false;
    this.alteradoBeneficiario = false;
  }

  formularioPlano(id)
  {
	  this.id 				= id;
    
    this.AdesaocService.obterAdesaoConfirmada(this.id)
      .subscribe(item => {
        this.adesao               = item;
        this.planoForm.patchValue({ plano: item.plano });
        this.planoForm.patchValue({ tipo: item.tipo });
        this.planoForm.patchValue({ registro: item.registro });
        this.planoForm.patchValue({ segmentacao: item.segmentacao });
        this.planoForm.patchValue({ vendedor: item.vendedor });
        this.planoForm.patchValue({ telefonev: item.telefonev });
        this.planoForm.patchValue({ corretora: item.corretora });
        this.planoForm.patchValue({ telefonec: item.telefonec });
        this.planoForm.patchValue({ equipe: item.equipe });
        this.planoForm.patchValue({ registrada: item.registrada });
        this.planoForm.patchValue({ confirmada: item.confirmada });
        this.planoForm.patchValue({ situacao: item.situacao });
        this.planoForm.patchValue({ qtdevidas: item.qtdevidas });
        this.planoForm.patchValue({ valor: item.valor });
        this.planoForm.patchValue({ situacao: item.situacao });
        this.planoForm.patchValue({ diavencimento: item.diavencimento });
        this.planoForm.patchValue({ iniciovigencia: item.iniciovigencia });

        if (this.adesao.csituacao == 'E')
        {
          this.cancelamentoForm.patchValue({ motivo: item.motivocancelamento });
        } else {
          this.cancelamentoForm.patchValue({ motivo: "" });
        }

        if (this.adesao.csituacao == 'X')
        {
          this.rejeitarForm.patchValue({ motivo: item.motivorejeicao });
        } else {
          this.rejeitarForm.patchValue({ motivo: "" });
        }

        this.planoxfaixasetarias  = item.faixasetarias;
        this.planoxecarencias     = item.carencias;
        this.planoxcoparticipacoes= item.coparticipacoes;

        if (this.SalvarAdesao)
        {
          this.planoForm.controls.iniciovigencia.enable();
        }

        this.alteradoAdesao             = false;

    });
    
  
  }

  onSalvarAdesao() {

    this.loader.open();

    let form  =  {
      iniciovigencia: this.formatarData(this.planoForm.value.iniciovigencia)
    }

    this.AdesaocService.salvarAdesao(this.id, form)
      .subscribe(data => {
                this.loader.close();
                this.alteradoAdesao             = false;
                this.adesao.iniciovigencia      = this.planoForm.value.iniciovigencia;
                this.snack.open('Adesão revisada com sucesso!', 'OK', { duration: 4000 });
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
    
  }

  onPreaprovarAdesao()
  {
      this.loader.open();

      this.AdesaocService.preAprovarAdesao(this.id)
      .subscribe(data => {
                this.loader.close();
                this.alteradoAdesao             = false;
                this.emitirAcao('voltar');
                this.snack.open('Adesão pré-aprovada com sucesso!', 'OK', { duration: 4000 });
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
  }

  onAprovarAdesao()
  {
    this.loader.open();

    this.AdesaocService.aprovarAdesao(this.id)
      .subscribe(data => {
                this.loader.close();
                this.alteradoAdesao             = false;
                this.emitirAcao('voltar');
                this.snack.open('Adesão aprovada com sucesso!', 'OK', { duration: 4000 });
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

  }

  onCancelarAdesao() {

    this.loader.open();

    this.AdesaocService.cancelarAdesao(this.id, this.cancelamentoForm.value)
      .subscribe(data => {
                this.loader.close();
                this.emitirAcao('voltar');
                this.snack.open('Adesão cancelada com sucesso!', 'OK', { duration: 4000 });
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
    
  }

  onExcluirCancelarAdesao() {

    this.loader.open();

    this.AdesaocService.excluircancelarAdesao(this.id)
      .subscribe(data => {
                this.loader.close();
                this.emitirAcao('voltar');
                this.snack.open('Cancelamento da Adesão excluído com sucesso!', 'OK', { duration: 4000 });
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
    
  }

  onRejeitarAdesao() {

    this.loader.open();

    this.AdesaocService.rejeitarAdesao(this.id, this.rejeitarForm.value)
      .subscribe(data => {
                this.loader.close();
                this.emitirAcao('voltar');
                this.snack.open('Adesão rejeitada com sucesso!', 'OK', { duration: 4000 });
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
  }

  emitirAcao(acao) {

    const saida = {
      acao: acao,
    }
    this.saida.emit(saida);
  }

}