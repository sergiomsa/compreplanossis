import { Component, OnInit, ViewChild , Input} from '@angular/core';
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
import { NgxTablePopupComponent } from '../ngx-table-popup/ngx-table-popup.component';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { AdesaocFrmComponent } from '../adesaoc-frm/adesaoc-frm.component';

@Component({
  selector: 'app-beneficiario-frm',
  templateUrl: './beneficiario-frm.component.html',
  styleUrls: ['./beneficiario-frm.component.css'],
  animations: egretAnimations,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class BeneficiarioFrmComponent implements OnInit {

  @Input() selectedIndex: number;
  @Input() beneficiario_id: number;
  @ViewChild("fileInput") fileInput;

  public beneficiario: any = [];
  public documento: any = [];
  public selectedAdesao: any = [];
  public selectedDadosMedicos: any = [];
  public beneficiarios: any = [];
  public beneficiarioxposvenda_id:  any = 0;
  public beneficiarioForm: FormGroup;
  public posvendaForm: FormGroup;
  public documentoForm: FormGroup;
  public formulario: boolean = false;
  public listar: boolean = true;
  public minDate = new Date(2000, 0, 1);
  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;
  public datainicio: any;
  public datafim: any;
  public orderby = 'confirmado_at';
  public direction = 'asc'
  public selectedVal: string;
  public id: any;
  public alteradoBeneficiario: boolean = false;
  public maskcep        = [ /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/ ];
  public maskcpf        = [ /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public masktelefone   = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskcelular    = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskhora       = [/\d/, /\d/, ':', /\d/, /\d/];
  public titulo    = "";
  public messages = { emptyMessage: 'Nenhum registro', loadingMessage: 'Carregando', totalMessage: 'registro(s)', selectedMessage: 'selecionado(s)' };

  public AprovarAdesao: boolean;
  public ReprovarDocumento: boolean;
  public SalvarBeneficiario: boolean;
  public AlterarPosvenda: boolean;
  public AlterarDmedicos: boolean;

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private AdesaocService: AdesaocService,
    private loader: AppLoaderService,
    private confirmService: AppConfirmService,
    public AuthGuard: AuthGuard,
  ) { }

  ngOnInit() {
   // this.inicializar();
  }

  ngOnChanges()
  {
    this.inicializar();
    this.formularioBeneficiario(this.beneficiario_id);
  }

  inicializar()
  {
    this.page_totalElements       = 0;
    this.page_pageNumber          = 0;
    this.page_size                = 10;

    this.beneficiarioForm = new FormGroup({
      cpf:                  new FormControl('', [Validators.required]),
      rg:                   new FormControl('', [Validators.required]),
      sexo:                 new FormControl('M', [Validators.required]),
      idade:                new FormControl(''),
      datanascimento:       new FormControl('', [Validators.required,CustomValidators.date]),
      estadocivil_id:       new FormControl('', [Validators.required]),
      nome:            	    new FormControl('', [Validators.required]),
      email:               	new FormControl('', [Validators.required, Validators.email]),
      celular:              new FormControl('', [Validators.required]),
      telefone:             new FormControl('',),
      cep:                  new FormControl('', [Validators.required]),
      logradouro:           new FormControl('', [Validators.required]),
      numero:               new FormControl('', [Validators.required]),
      bairro:               new FormControl('', [Validators.required]),
      complemento:          new FormControl(''),
      cidade:               new FormControl('', [Validators.required]),
      estado:               new FormControl('', [Validators.required]),
      nomedamae:            new FormControl('', [Validators.required]),
      peso:                 new FormControl('', [Validators.required]),
      cns:                  new FormControl('', [Validators.required]),
      docfile:              new FormControl("", [Validators.required]),
      altura:               new FormControl('', [Validators.required]),
      parentesco:           new FormControl('', [Validators.required]),
    });

    this.posvendaForm = new FormGroup({
      beneficiario_id:         new FormControl(''),
      contato_data:            new FormControl('', [Validators.required,CustomValidators.date]),
      contato_hora:            new FormControl('', [Validators.required]),
      contato_nome:            new FormControl('', [Validators.required]),
      contato_telefone:        new FormControl('', [Validators.required]),
      contato_email:           new FormControl(''),
      possuiplano:             new FormControl(false, [Validators.required]),
      qualplano:               new FormControl(''),
      realizoucirurgia:        new FormControl(false, [Validators.required]),
      usalentedecontato:       new FormControl(false, [Validators.required]),
      temalergia:              new FormControl(false, [Validators.required]),
      fezalgumtratamento:      new FormControl(false, [Validators.required]),
      usodealgummedicamento:   new FormControl(false, [Validators.required]),
      qualmedicamento:         new FormControl(''),
      possuidorcronica:        new FormControl(false, [Validators.required]),
      qualtratamento:          new FormControl(''),
      jatevealgumafratura:     new FormControl(false, [Validators.required]),
      contratofoiassinado:     new FormControl(false, [Validators.required]),
      confirmavigencia:        new FormControl(false, [Validators.required]),
      carencias:               new FormControl('N', [Validators.required]),
      contratocoparticipativo: new FormControl(false, [Validators.required]),
      confirmovencimento:      new FormControl(false, [Validators.required]),
      carteirinhafisica:       new FormControl(false, [Validators.required]),
      observacao:              new FormControl(''),
    });

    this.documentoForm = new FormGroup({
      observacao: 		  	  new FormControl('',[Validators.required]),
    });

    this.SalvarBeneficiario		      = this.AuthGuard.getPermissao("SalvarBeneficiario");
    this.ReprovarDocumento		      = this.AuthGuard.getPermissao("ReprovarDocumento");
    this.AlterarDmedicos		        = this.AuthGuard.getPermissao("AlterarDmedicos");
    this.AlterarPosvenda	          = this.AuthGuard.getPermissao("AlterarPosvenda");

    if (this.SalvarBeneficiario)
    {
      this.beneficiarioForm.valueChanges.subscribe(
        (value: string) => {
            this.alteradoBeneficiario = true;
      });
    } else {
      this.beneficiarioForm.disable();
    }

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

  onDownloadPosvenda()
  {
    this.loader.open();
    this.AdesaocService.downloadPosvenda(this.beneficiarioxposvenda_id)
    .subscribe(response => {
      let blob 	= new Blob([response], {type: 'application/octet-stream'});
      this.loader.close();
      FileSaver.saveAs(blob, this.beneficiarioxposvenda_id +'_posvenda.docx');
    });
  }

  downloadDocumento(id) {
    this.loader.open();
    this.AdesaocService.downloadDocumento(id)
    .subscribe(response => {
      let blob 	= new Blob([response], {type: 'application/octet-stream'});
      this.loader.close();
      FileSaver.saveAs(blob, id +'_documento.png');
    });
  }

  tabPlanoClick(tab) {

    if (this.beneficiario.dmedicos && this.AlterarPosvenda && tab.index == 2)
    {
      if ((this.posvendaForm.value.contato_nome !="") ||
          (this.posvendaForm.value.contato_telefone !=""))
      {
        this.onSalvarPosvenda(false);
      }
    }

    if (this.beneficiario.dmedicos && this.AlterarDmedicos && tab.index == 1)
    {
      this.AdesaocService.viewbeneficiarioposvenda(this.beneficiario.id)
      .subscribe(item => {
        this.beneficiarioxposvenda_id  = item.id;
        this.posvendaForm.patchValue({ contato_data: item.contato_data });
        this.posvendaForm.patchValue({ contato_hora: item.contato_hora });
        this.posvendaForm.patchValue({ contato_nome: item.contato_nome });
        this.posvendaForm.patchValue({ contato_telefone: item.contato_telefone });
        this.posvendaForm.patchValue({ contato_email: item.contato_email });
        this.posvendaForm.patchValue({ possuiplano: item.possuiplano });
        this.posvendaForm.patchValue({ qualplano: item.qualplano });
        this.posvendaForm.patchValue({ realizoucirurgia: item.realizoucirurgia });
        this.posvendaForm.patchValue({ usalentedecontato: item.usalentedecontato });
        this.posvendaForm.patchValue({ temalergia: item.temalergia });
        this.posvendaForm.patchValue({ fezalgumtratamento: item.fezalgumtratamento });
        this.posvendaForm.patchValue({ usodealgummedicamento: item.usodealgummedicamento });
        this.posvendaForm.patchValue({ qualmedicamento: item.qualmedicamento });
        this.posvendaForm.patchValue({ possuidorcronica: item.possuidorcronica });
        this.posvendaForm.patchValue({ qualtratamento: item.qualtratamento });
        this.posvendaForm.patchValue({ jatevealgumafratura: item.jatevealgumafratura });
        this.posvendaForm.patchValue({ contratofoiassinado: item.contratofoiassinado });
        this.posvendaForm.patchValue({ confirmavigencia:  item.confirmavigencia });
        this.posvendaForm.patchValue({ carencias: item.carencias });
        this.posvendaForm.patchValue({ contratocoparticipativo: item.contratocoparticipativo });
        this.posvendaForm.patchValue({ confirmovencimento: item.confirmovencimento });
        this.posvendaForm.patchValue({ carteirinhafisica: item.carteirinhafisica });
        this.posvendaForm.patchValue({ observacao: item.observacao });
      });
    }

  }

  onSelectDadosMedicos({ selected }) {

    if (this.AlterarDmedicos)
    {
      this.selectedDadosMedicos  = selected;
      const dialogRef: MatDialogRef<any> = this.dialog.open(NgxTablePopupComponent, {
        width: '800px',
        disableClose: true,
        data: { id: this.selectedDadosMedicos[0].id,
                beneficiario_id: this.selectedDadosMedicos[0].beneficiario_id,
                resposta_id:  this.selectedDadosMedicos[0].resposta_id,
                pergunta:  this.selectedDadosMedicos[0].pergunta,
                data: this.selectedDadosMedicos[0].dataf,
                quadrogeral: this.selectedDadosMedicos[0].quadrogeral,
                simnao: this.selectedDadosMedicos[0].simnao
              }
      });
      dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.AdesaocService.listarResposta(this.selectedDadosMedicos[0].id)
          .subscribe(dadosmedicos => {
            this.beneficiario.dadosmedicos = dadosmedicos
          });
      });
    }

  }

  public onValChange(val: string) {
    this.selectedVal          = val;
    this.alteradoBeneficiario = false;
  }


 onSalvarPosvenda(mensagem) {

    if (mensagem)
    {
      this.loader.open();
    }

    this.posvendaForm.patchValue({ beneficiario_id: this.beneficiario.id });
    this.AdesaocService.salvarbeneficiarioposvenda(this.posvendaForm.value)
      .subscribe(data => {
                this.beneficiarioxposvenda_id  = data;
                if (mensagem)
                {
                  this.loader.close();
                  this.snack.open('Pós-venda revisado com sucesso!', 'OK', { duration: 4000 });
                }
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

  changePossuiuPlano(event)
  {

    if (!event.checked)
    {
        this.posvendaForm.get('qualplano').clearValidators();
    } else {
        this.posvendaForm.get('qualplano').setValidators([Validators.required]);
    }

    this.posvendaForm.get('qualplano').updateValueAndValidity();

  }

  changeTemalergia(event)
  {

    if (!event.checked)
    {
        this.posvendaForm.get('qualmedicamento').clearValidators();
    } else {
        this.posvendaForm.get('qualmedicamento').setValidators([Validators.required]);
    }

    this.posvendaForm.get('qualmedicamento').updateValueAndValidity();

  }

  changeFezalgumtratamento(event)
  {
    if (!event.checked)
    {
        this.posvendaForm.get('qualtratamento').clearValidators();
    } else {
        this.posvendaForm.get('qualtratamento').setValidators([Validators.required]);
    }

    this.posvendaForm.get('qualtratamento').updateValueAndValidity();
  }

  onSalvarBeneficiario() {

    const documento			= this.fileInput.nativeElement;
    const formdata 			= new FormData();

    formdata.append("cpf",this.beneficiarioForm.value.cpf);
    formdata.append("rg",this.beneficiarioForm.value.rg);
    formdata.append("sexo",this.beneficiarioForm.value.sexo);
    formdata.append("datanascimento",this.formatarData(this.beneficiarioForm.value.datanascimento));
    formdata.append("estadocivil_id",this.beneficiarioForm.value.estadocivil_id);
    formdata.append("nome",this.beneficiarioForm.value.nome);
    formdata.append("email",this.beneficiarioForm.value.email);
    formdata.append("celular",this.beneficiarioForm.value.celular);
    formdata.append("telefone",this.beneficiarioForm.value.telefone);
    formdata.append("cep",this.beneficiarioForm.value.cep);
    formdata.append("logradouro",this.beneficiarioForm.value.logradouro);
    formdata.append("numero",this.beneficiarioForm.value.numero);
    formdata.append("bairro",this.beneficiarioForm.value.bairro);
    formdata.append("complemento",this.beneficiarioForm.value.complemento);
    formdata.append("cidade",this.beneficiarioForm.value.cidade);
    formdata.append("estado",this.beneficiarioForm.value.estado);
    formdata.append("nomedamae",this.beneficiarioForm.value.nomedamae);
    formdata.append("peso",this.beneficiarioForm.value.peso);
    formdata.append("cns",this.beneficiarioForm.value.cns);
    formdata.append("altura",this.beneficiarioForm.value.altura);
    formdata.append("parentesco",this.beneficiarioForm.value.parentesco);

    if (documento.files[0])
    {
      formdata.append("docfile", documento.files[0]);
    }

    this.loader.open();

    this.AdesaocService.salvarBeneficiario(this.beneficiario.id, formdata)
    .subscribe(data => {
              this.loader.close();
              this.alteradoBeneficiario           = false;
              this.snack.open('Registro revisado com sucesso!', 'OK', { duration: 4000 });
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

  onReprovarDocumento(id)
  {
    this.loader.open();

    this.AdesaocService.reprovarDocumento(id, this.documentoForm.value)
    .subscribe(data => {
              this.loader.close();
              this.snack.open('Documento reprovado com sucesso!', 'OK', { duration: 4000 });
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

  onAprovarDocumento(id)
  {
    this.loader.open();

    this.AdesaocService.aprovarDocumento(id)
    .subscribe(data => {
              this.loader.close();
              this.documentoForm.value
              this.documentoForm.patchValue({ observacao: "" });
              this.snack.open('Documento aprovado com sucesso!', 'OK', { duration: 4000 });
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

  onReprovarDmedicos()
  {
    this.loader.open();
  }

  obterCep() {
    this.AdesaocService.cep(this.beneficiarioForm.value.cep).subscribe(endereco => {
      this.beneficiarioForm.patchValue({ logradouro: endereco.logradouro });
      this.beneficiarioForm.patchValue({ bairro: endereco.bairro });
      this.beneficiarioForm.patchValue({ cidade: endereco.localidade });
      this.beneficiarioForm.patchValue({ estado: endereco.uf });
    });
  }

  formularioBeneficiario(id)
  {

    this.AdesaocService.obterBeneficiario(id)
      .subscribe(item => {
        this.beneficiario             = item;
        this.beneficiarioForm.patchValue({ cpf: item.cpf });
        this.beneficiarioForm.patchValue({ rg: item.rg });
        this.beneficiarioForm.patchValue({ nome: item.nome });
        this.beneficiarioForm.patchValue({ nomedamae: item.nomedamae });
        this.beneficiarioForm.patchValue({ sexo: item.sexo });
        this.beneficiarioForm.patchValue({ idade: item.idade + ' | ' + item.valor});
        this.beneficiarioForm.patchValue({ cep: item.cep });
        this.beneficiarioForm.patchValue({ cns: item.cns });
        this.beneficiarioForm.patchValue({ docfile: item.cns.url});
        this.beneficiarioForm.patchValue({ logradouro: item.logradouro });
        this.beneficiarioForm.patchValue({ numero: item.numero });
        this.beneficiarioForm.patchValue({ complemento: item.complemento });
        this.beneficiarioForm.patchValue({ bairro: item.bairro });
        this.beneficiarioForm.patchValue({ cidade: item.cidade });
        this.beneficiarioForm.patchValue({ estado: item.estado });
        this.beneficiarioForm.patchValue({ telefone: item.telefone });
        this.beneficiarioForm.patchValue({ celular: item.celular });
        this.beneficiarioForm.patchValue({ email: item.email });
        this.beneficiarioForm.patchValue({ datanascimento:  item.datanascimento });
        this.beneficiarioForm.patchValue({ estadocivil_id: item.estadocivil_id });
        this.beneficiarioForm.patchValue({ peso: item.peso });
        this.beneficiarioForm.patchValue({ altura: item.altura });
        this.beneficiarioForm.patchValue({ parentesco: item.parentesco });

        if (item.dmedicos && this.AlterarDmedicos)
        {
          this.beneficiarioxposvenda_id  = item.id;
          this.posvendaForm.patchValue({ contato_data: item.posvenda.contato_data });
          this.posvendaForm.patchValue({ contato_hora: item.posvenda.contato_hora });
          this.posvendaForm.patchValue({ contato_nome: item.posvenda.contato_nome });
          this.posvendaForm.patchValue({ contato_telefone: item.posvenda.contato_telefone });
          this.posvendaForm.patchValue({ contato_email: item.posvenda.contato_email });
          this.posvendaForm.patchValue({ possuiplano: item.posvenda.possuiplano });
          this.posvendaForm.patchValue({ realizoucirurgia: item.posvenda.realizoucirurgia });
          this.posvendaForm.patchValue({ usalentedecontato: item.posvenda.usalentedecontato });
          this.posvendaForm.patchValue({ temalergia: item.posvenda.temalergia });
          this.posvendaForm.patchValue({ fezalgumtratamento: item.posvenda.fezalgumtratamento });
          this.posvendaForm.patchValue({ usodealgummedicamento: item.posvenda.usodealgummedicamento });
          this.posvendaForm.patchValue({ qualmedicamento: item.posvenda.qualmedicamento });
          this.posvendaForm.patchValue({ possuidorcronica: item.posvenda.possuidorcronica });
          this.posvendaForm.patchValue({ qualtratamento: item.posvenda.qualtratamento });
          this.posvendaForm.patchValue({ jatevealgumafratura: item.posvenda.jatevealgumafratura });
          this.posvendaForm.patchValue({ contratofoiassinado: item.posvenda.contratofoiassinado });
          this.posvendaForm.patchValue({ confirmavigencia:  item.posvenda.confirmavigencia });
          this.posvendaForm.patchValue({ carencias: item.posvenda.carencias });
          this.posvendaForm.patchValue({ contratocoparticipativo: item.posvenda.contratocoparticipativo });
          this.posvendaForm.patchValue({ confirmovencimento: item.posvenda.confirmovencimento });
          this.posvendaForm.patchValue({ carteirinhafisica: item.posvenda.carteirinhafisica });
          this.posvendaForm.patchValue({ observacao: item.posvenda.observacao });
        } else {
          this.beneficiarioxposvenda_id       = 0;
        }

        if (this.SalvarBeneficiario)
        {
          this.beneficiarioForm.get('cep').clearValidators();
          this.beneficiarioForm.get('logradouro').clearValidators();
          this.beneficiarioForm.get('numero').clearValidators();
          this.beneficiarioForm.get('bairro').clearValidators();
          this.beneficiarioForm.get('cidade').clearValidators();
          this.beneficiarioForm.get('estado').clearValidators();
          this.beneficiarioForm.get('celular').clearValidators();
          this.beneficiarioForm.get('email').clearValidators();
          this.beneficiarioForm.get('peso').clearValidators();
          this.beneficiarioForm.get('altura').clearValidators();
          this.beneficiarioForm.get('cns').clearValidators();
          this.beneficiarioForm.get('docfile').clearValidators();
          this.beneficiarioForm.get('parentesco').clearValidators();
          this.beneficiarioForm.get('nomedamae').clearValidators();

          if (this.beneficiario.dmedicos)
          {
            this.beneficiarioForm.get('peso').setValidators([Validators.required]);
            this.beneficiarioForm.get('altura').setValidators([Validators.required]);
          }

          if (this.beneficiario.tipo !='R')
          {
            this.beneficiarioForm.get('nomedamae').setValidators([Validators.required]);
            if (this.beneficiario.registroans)
            {
              this.beneficiarioForm.get('cns').setValidators([Validators.required]);
              this.beneficiarioForm.get('docfile').setValidators([Validators.required]);
            }
          }

          if (this.beneficiario.tipo !='B')
          {
            this.beneficiarioForm.get('cep').setValidators([Validators.required]);
            this.beneficiarioForm.get('logradouro').setValidators([Validators.required]);
            this.beneficiarioForm.get('numero').setValidators([Validators.required]);
            this.beneficiarioForm.get('bairro').setValidators([Validators.required]);
            this.beneficiarioForm.get('cidade').setValidators([Validators.required]);
            this.beneficiarioForm.get('estado').setValidators([Validators.required]);
            this.beneficiarioForm.get('celular').setValidators([Validators.required]);
            this.beneficiarioForm.get('email').setValidators([Validators.required, Validators.email]);
          } else {
            this.beneficiarioForm.get('parentesco').setValidators([Validators.required]);
          }

          this.beneficiarioForm.get('cep').updateValueAndValidity();
          this.beneficiarioForm.get('logradouro').updateValueAndValidity();
          this.beneficiarioForm.get('numero').updateValueAndValidity();
          this.beneficiarioForm.get('bairro').updateValueAndValidity();
          this.beneficiarioForm.get('cidade').updateValueAndValidity();
          this.beneficiarioForm.get('estado').updateValueAndValidity();
          this.beneficiarioForm.get('celular').updateValueAndValidity();
          this.beneficiarioForm.get('email').updateValueAndValidity();
          this.beneficiarioForm.get('peso').updateValueAndValidity();
          this.beneficiarioForm.get('altura').updateValueAndValidity();
          this.beneficiarioForm.get('cns').updateValueAndValidity();
          this.beneficiarioForm.get('docfile').updateValueAndValidity();
          this.beneficiarioForm.get('parentesco').updateValueAndValidity();
          this.beneficiarioForm.get('nomedamae').updateValueAndValidity();
        }

        if ((this.beneficiario.podealterar =='S') && (this.SalvarBeneficiario))
        {
          this.beneficiarioForm.enable();
        } else {
          this.beneficiarioForm.disable();
        }

        this.alteradoBeneficiario   = false;

    });


  }

  visualizarImagem(row) {
    this.documento  = row;
    this.listar     = false;
    this.documentoForm.patchValue({ observacao: row.observacao });
  }

}