import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AuthService as AuthGuard } from '../../shared/services/auth/auth.service';
import { MatSnackBar, MatSidenav } from '@angular/material';
import { AppLoaderService } from '../../shared/services/app-loader/app-loader.service';
import { CredenciadoService } from './credenciado.service';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';

@Component({
  selector: 'app-credenciados',
  templateUrl: './credenciados.component.html',
  styleUrls: ['./credenciados.component.scss']
})
export class CredenciadosComponent implements OnInit {

  public id: number;
  public filterForm: FormGroup;
  public credenciadoForm: FormGroup;
  public isSideNavOpen: boolean;
  
  @ViewChild(MatSidenav) private sideNav: MatSidenav;
  public formulario: boolean;
  public InserirCredenciado: boolean;
  public AlterarCredenciado: boolean;
  public ExcluirCredenciado: boolean;
  public pesquisa: any;

  public page_totalElements: number;
  public page_pageNumber: number;
  public page_size: number;
  public pagina: number;

  credenciados: any = [];
  situacao: any;
  tiposdeestabelecimento: any;
  especialidades: any;
  tipodepessoa = true;
  especialidade_id: any;
  tipodeestabelecimento_id: any;

  public masktelefone   = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskcelular    = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskcpf        = [ /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public maskcep        = [ /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/ ];
  public maskcnpj       = [ /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  constructor(

    public AuthGuard: AuthGuard,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private credenciadoService: CredenciadoService,
    private confirmService: AppConfirmService


  ) { }

  ngOnInit() {

    this.page_totalElements = 0;
    this.page_pageNumber = 0;
    this.page_size = 10;

    this.obterEspecialidades();
    this.obterTiposdeestabelecimento();

    this.filterForm = new FormGroup({
      search:         new FormControl('', [Validators.required]),
      pesquisarpor:   new FormControl('', [Validators.required])
    });

    this.filterForm.patchValue({ pesquisarpor: 'nomefantasia' });

    this.credenciadoForm  = new FormGroup({
      tipodepessoa:                 new FormControl('', [Validators.required]),
      cpf:                          new FormControl('', [Validators.required]),
      cnpj:                         new FormControl('', [Validators.required]),
      cpf_cnpj:                     new FormControl(''),
      nomefantasia:                 new FormControl('', [Validators.required]),
      razaosocial:                  new FormControl(),
      especialidade_id:             new FormControl('', [Validators.required]),
      tipodeestabelecimento_id:     new FormControl('', [Validators.required]),
      contato:                      new FormControl('', [Validators.required]),
      telefone:                     new FormControl(),
      website:                      new FormControl(),
      cep:                          new FormControl('', [Validators.required]),
      endereco:                     new FormControl('', [Validators.required]),
      numero:                       new FormControl('', [Validators.required]),
      complemento:                  new FormControl(),
      bairro:                       new FormControl('', [Validators.required]),
      cidade:                       new FormControl('', [Validators.required]),
      estado:                       new FormControl('', [Validators.required]),
      cro_uf:                       new FormControl(),
      situacao:                     new FormControl('', [Validators.required]),
    });
    this.formulario = false;

    this.InserirCredenciado =  this.AuthGuard.getPermissao('InserirCredenciado');
    this.AlterarCredenciado =  this.AuthGuard.getPermissao('AlterarCredenciado');
    this.ExcluirCredenciado =  this.AuthGuard.getPermissao('ExcluirCredenciado');

  }

  ngOnDestroy() {
  
  }

  toggleSideNav() {
    this.isSideNavOpen  = !this.isSideNavOpen;
  }

  abrirFormulario(id) {

    this.id         = id;
    this.formulario = true;

    if (this.id > 0)
    {
      this.credenciadoService.obterCredenciado(this.id).subscribe(credenciado => {
        this.credenciadoForm.patchValue({ tipodepessoa: credenciado.tipodepessoa });
        if  (credenciado.tipodepessoa == 'F')
        {
          this.credenciadoForm.patchValue({ cpf: credenciado.cpf_cnpj });
          this.credenciadoForm.patchValue({ cnpj: credenciado.tipodepessoa});
        }else {
          this.credenciadoForm.patchValue({ cpf: credenciado.tipodepessoa });
          this.credenciadoForm.patchValue({ cnpj: credenciado.cpf_cnpj });
        }

        this.credenciadoForm.patchValue({ nomefantasia: credenciado.nomefantasia });
        this.credenciadoForm.patchValue({ razaosocial: credenciado.razaosocial });
        this.credenciadoForm.patchValue({ especialidade_id: credenciado.especialidade_id });
        this.credenciadoForm.patchValue({ tipodeestabelecimento_id: credenciado.tipodeestabelecimento_id });
        this.credenciadoForm.patchValue({ contato: credenciado.contato });
        this.credenciadoForm.patchValue({ telefone: credenciado.telefone });
        this.credenciadoForm.patchValue({ website: credenciado.website });
        this.credenciadoForm.patchValue({ cep: credenciado.cep });
        this.credenciadoForm.patchValue({ endereco: credenciado.endereco });
        this.credenciadoForm.patchValue({ numero: credenciado.numero });
        this.credenciadoForm.patchValue({ complemento: credenciado.complemento });
        this.credenciadoForm.patchValue({ bairro: credenciado.bairro });
        this.credenciadoForm.patchValue({ cidade: credenciado.cidade });
        this.credenciadoForm.patchValue({ estado: credenciado.estado });
        this.credenciadoForm.patchValue({ cro_uf: credenciado.cro_uf });
        this.credenciadoForm.patchValue({ situacao: credenciado.situacao });
      });
    } else {
        this.credenciadoForm.patchValue({ tipodepessoa: 'J' });
        this.credenciadoForm.patchValue({ cpf: 'J' });
        this.credenciadoForm.patchValue({ cnpj: '' });
        this.credenciadoForm.patchValue({ nomefantasia: '' });
        this.credenciadoForm.patchValue({ razaosocial: '' });
        this.credenciadoForm.patchValue({ especialidade_id: '' });
        this.credenciadoForm.patchValue({ tipodeestabelecimento_id: '' });
        this.credenciadoForm.patchValue({ contato: '' });
        this.credenciadoForm.patchValue({ telefone: '' });
        this.credenciadoForm.patchValue({ website: '' });
        this.credenciadoForm.patchValue({ cep: '' });
        this.credenciadoForm.patchValue({ logradouro: '' });
        this.credenciadoForm.patchValue({ numero: '' });
        this.credenciadoForm.patchValue({ complemento: '' });
        this.credenciadoForm.patchValue({ bairro: '' });
        this.credenciadoForm.patchValue({ cidade: '' });
        this.credenciadoForm.patchValue({ estado: '' });
        this.credenciadoForm.patchValue({ cro_uf: '' });
        this.credenciadoForm.patchValue({ situacao: 'Ativo' });
    }

  }

  cancelarFormulario() {
    this.formulario = false;
  }

  changeTipodepessoa() {
    if (this.credenciadoForm.value.tipodepessoa === 'J')
    {
      this.credenciadoForm.patchValue({ cnpj: '' });
      this.credenciadoForm.patchValue({ cpf: 'J' });
    }else {
      this.credenciadoForm.patchValue({ cpf: '' });
      this.credenciadoForm.patchValue({ cnpj: 'F' });
    }
  }

  pesquisarCredenciados(offset=0) {
    this.pesquisa= 'parcial';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.credenciadoService.pesquisarCredenciados(offset, this.filterForm.value.pesquisarpor, this.filterForm.value.search)
        .subscribe(credenciados => {
          this.credenciados = credenciados.data;
          this.page_totalElements = credenciados.total;
          this.loader.close();
          if (this.credenciados.length === 0)
          {
            this.snack.open('Não existe credenciado com a pesquisa escolhida!', 'OK', { duration: 4000 });
          }
        });

  }

  pesquisarEspecialidade(especialidade_id)
  {
    this.loader.open();
    this.credenciadoService.pesquisarCredenciados(this.pagina, 'especialidade_id', especialidade_id)
       .subscribe(credenciados => {
        this.credenciados = credenciados.data;
        this.page_totalElements = credenciados.total;
         this.loader.close();
         if (this.credenciados.length === 0)
         {
           this.snack.open('Não existe Modulo o escolhido!', 'OK', { duration: 4000 });
         }
       });
   }

   pesquisarTipodeestabelecimento(tipodeestabelecimento_id)
  {

    this.loader.open();
    this.credenciadoService.pesquisarCredenciados(this.pagina, 'tipodeestabelecimento_id', tipodeestabelecimento_id)
       .subscribe(credenciados => {
        this.credenciados = credenciados.data;
        this.page_totalElements = credenciados.total;
         this.loader.close();
         if (this.credenciados.length === 0)
         {
           this.snack.open('Não existe Modulo o escolhido!', 'OK', { duration: 4000 });
         }
       });
   }

  todosCredenciados(offset=0) {
    this.pesquisa='total';
    offset = offset+1;
    this.formulario = false;
      this.loader.open();
     this.credenciadoService.todosCredenciados(offset)
        .subscribe(credenciados => {
          this.credenciados = credenciados.data;
          this.page_totalElements = credenciados.total;
          this.loader.close();
          if (this.credenciados.length === 0)
          {
            this.snack.open('Não existe nenhum registro!', 'OK', { duration: 4000 });
          }
        });

  }

  paginacao(pageInfo){
    this.pagina = pageInfo.offset;
    if (this.pesquisa == 'total')
    {
      this.todosCredenciados(pageInfo.offset);
    } else {
      this.pesquisarCredenciados(pageInfo.offset);
    }
  }

  submit() {

    this.loader.open();

    if (this.credenciadoForm.value.tipodepessoa === 'J')
    {
      this.credenciadoForm.patchValue({ cpf_cnpj: this.credenciadoForm.value.cnpj });
      this.credenciadoForm.patchValue({ cpf: '' });
    }else {
      this.credenciadoForm.patchValue({ cpf_cnpj: this.credenciadoForm.value.cpf });
      this.credenciadoForm.patchValue({ cnpj: '' });
    }

    if (this.id > 0)
    {
      this.credenciadoService.atualizarCredenciado(this.id, this.credenciadoForm.value)
      .subscribe(data => {
                this.loader.close();
                this.snack.open('Credenciado alterado!', 'OK', { duration: 4000 });
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
    } else {
           this.credenciadoService.adicionarCredenciado(this.credenciadoForm.value)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Credenciado adicionado!', 'OK', { duration: 4000 });
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

  removerCredenciado(row) {
    this.confirmService.confirm({message: `Excluir ${row.category}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.credenciadoService.removerCredenciado(row)
            .subscribe(data => {
              this.loader.close();
              this.snack.open('Credenciado excluido!', 'OK', { duration: 4000 });
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

  pesquisarSituacao(situacao: any) {

    this.loader.open();
    this.credenciadoService.pesquisarCredenciados(this.pagina, 'situacao', situacao)
       .subscribe(credenciados => {
        this.credenciados = credenciados.data;
        this.page_totalElements = credenciados.total;
         this.loader.close();
         if (this.credenciados.length === 0)
         {
           this.snack.open('Não existe programa com a situacao escolhida!', 'OK', { duration: 4000 });
         }
       });
   }

  obterEspecialidades() {
    this.credenciadoService.obterEspecialidade().subscribe(response => {
      this.especialidades = response;
    });
  }

  obterTiposdeestabelecimento() {
    this.credenciadoService.obterTipodeestabelecimento().subscribe(response => {
      this.tiposdeestabelecimento = response;
    });
  }

  obterCep() {
    this.credenciadoService.cep(this.credenciadoForm.value.cep).subscribe(endereco => {
      this.credenciadoForm.patchValue({ logradouro: endereco.logradouro });
      this.credenciadoForm.patchValue({ bairro: endereco.bairro });
      this.credenciadoForm.patchValue({ cidade: endereco.localidade });
      this.credenciadoForm.patchValue({ estado: endereco.uf });
    });
  }
}
