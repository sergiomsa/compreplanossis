import { Component, OnInit, Inject } from "@angular/core";
import { FileUploader } from "ng2-file-upload";
import {
  FormControl,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { CustomValidators } from "ng2-validation";
import {
  MatSnackBar,
  MAT_DIALOG_DATA
} from "../../../../node_modules/@angular/material";
import { MeusdadosService } from "./meusdados.service";
import { AppLoaderService } from "../../shared/services/app-loader/app-loader.service";

@Component({
  selector: "app-meusdados",
  templateUrl: "./meusdados.component.html",
  styleUrls: ["./meusdados.component.scss"]
})
export class MeusdadosComponent implements OnInit {
  
  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  public meusdadosForm: FormGroup;

  meusdados: any;
  foto: any;

  public masktelefone 	= ["(",/[1-9]/,/\d/,")",/\d/,/\d/,/\d/,/\d/,"-",/\d/,/\d/,/\d/,/\d/];
  public maskcelular 	  = ["(",/[1-9]/,/\d/,")",/\d/,/\d/,/\d/,/\d/,/\d/,"-",/\d/,/\d/,/\d/,/\d/];
  public maskcep 		    = [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/];
  public maskdata 		  = [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/];

  constructor(
    private snack: MatSnackBar,
    private meusdadosService: MeusdadosService,
    private loader: AppLoaderService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    
    this.uploader = new FileUploader({
      removeAfterUpload: true,
      url: "https://api.compreplanos.com.br/api/app/meusdados/foto",
      authToken: `Bearer ${localStorage.getItem("token")}`,
      disableMultipart: false
    });

    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      this.foto = response;
    };

    const senha 	= new FormControl('');
    const confsenha = new FormControl('', CustomValidators.equalTo(senha));

    this.meusdadosForm = new FormGroup({
      nome: new FormControl(""),
      cargo: new FormControl(""),
      emailalternativo: new FormControl(""),
      telefone: new FormControl(""),
      celular: new FormControl(""),
      cep: new FormControl(""),
      logradouro: new FormControl(""),
      complemento: new FormControl(""),
      numero: new FormControl(""),
      bairro: new FormControl(""),
      cidade: new FormControl(""),
      estado: new FormControl(""),
      tema: new FormControl("", [Validators.required]),
      senha: senha,
      confsenha: confsenha
    });

    this.meusdadosService.obterMeusdados().subscribe(meusdados => {
      this.meusdados = meusdados;
      this.foto = this.meusdados.profile.foto;
      this.meusdadosForm.patchValue({ nome: meusdados.name });
      if (meusdados.profile != null) {
        this.meusdadosForm.patchValue({ cargo: meusdados.profile.cargo });
        this.meusdadosForm.patchValue({
          emailalternativo: meusdados.profile.emailalternativo
        });
        this.meusdadosForm.patchValue({ telefone: meusdados.profile.telefone });
        this.meusdadosForm.patchValue({ celular: meusdados.profile.celular });
        this.meusdadosForm.patchValue({ cep: meusdados.profile.cep });
        this.meusdadosForm.patchValue({
          logradouro: meusdados.profile.logradouro
        });
        this.meusdadosForm.patchValue({
          complemento: meusdados.profile.complemento
        });
        this.meusdadosForm.patchValue({ numero: meusdados.profile.numero });
        this.meusdadosForm.patchValue({ bairro: meusdados.profile.bairro });
        this.meusdadosForm.patchValue({ cidade: meusdados.profile.cidade });
        this.meusdadosForm.patchValue({ estado: meusdados.profile.estado });
        this.meusdadosForm.patchValue({ tema: meusdados.profile.tema });
      } else {
        this.meusdadosForm.patchValue({ cargo: "" });
        this.meusdadosForm.patchValue({ emailalternativo: "" });
        this.meusdadosForm.patchValue({ telefone: "" });
        this.meusdadosForm.patchValue({ celular: "" });
        this.meusdadosForm.patchValue({ cep: "" });
        this.meusdadosForm.patchValue({ logradouro: "" });
        this.meusdadosForm.patchValue({ complemento: "" });
        this.meusdadosForm.patchValue({ numero: "" });
        this.meusdadosForm.patchValue({ bairro: "" });
        this.meusdadosForm.patchValue({ cidade: "" });
        this.meusdadosForm.patchValue({ estado: "" });
        this.meusdadosForm.patchValue({ tema: "Indigo" });
      }
    });
	
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  submit() {

    this.meusdadosService
      .atualizarProfile(this.meusdadosForm.value)
      .subscribe(
        data => {
          this.loader.close();
          this.snack.open("Perfil atualizado", "OK", { duration: 4000 });
        },
        error => {
          this.loader.close();
          let message = "";
          if (error.error) {
            for (const k in error.error) message += error.error[k] + " | ";
          }
          this.snack.open(message, "OK", { duration: 6000 });
        }
      );
  }

  obterCep() {
    this.meusdadosService
      .cep(this.meusdadosForm.value.cep)
      .subscribe(endereco => {
        this.meusdadosForm.patchValue({ logradouro: endereco.logradouro });
        this.meusdadosForm.patchValue({ bairro: endereco.bairro });
        this.meusdadosForm.patchValue({ cidade: endereco.localidade });
        this.meusdadosForm.patchValue({ estado: endereco.uf });
      });
  }
}