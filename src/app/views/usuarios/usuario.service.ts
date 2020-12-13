import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import * as _ from 'lodash';

/* O decorador(decorator) identifica serviços e outras classes que devem ser injetadas */
@Injectable()
/* exporta a classe UsuarioService podendo ser acessada em outros locais */
export class UsuarioService {
  /* define usuarios como um array vazio([]), podendo conter qualquer tipo de dados(any) */
  usuarios: any = [];
  /* usa uma baseUrl definada (http://........) para acesso dos dados */
  baseUrl = 'https://api.compreplanos.com.br/api/app';
  /*  */
  private usuario: any;
  /* constroi a autorização e segurança para acesso aos dados de usuarios (que é o exemplo) */
  constructor(private http: HttpClient) {
    this.usuarios = [];
  }

  // ******* Implemtente suas APIs ********
  /* passa um observable(observavel) para todos os dados contidos em getUsuarios */
  getUsuarios(): Observable<any> {
    /* retonar para o usuarios // slice: retorna os elementos selecionados em uma matriz, como um novo objeto de matriz. */
    return of (this.usuarios.slice());
   // return  of(this.usuarios.slice());
  }
          /*  */
  addItem(usuario): Observable<any> {
    /* busca a autorização no AuthGuard passando o usuario */
    usuario.role_id =  _.chain(usuario.role_id).toArray().sortBy().value();
    /* retorna o http gravando na baseUrl(API) usuario, os dados passados pro usuario */
    return this.http.post(`${this.baseUrl}/usuario`, usuario)
                      /* map: é um operador observável que chama uma função para cada usuario
                      em seu fluxo de entrada e envia o resultado da função para seu fluxo de saída. */
                     .map((response: any) => {
                       /* unshift: adiciona novos itens ao início de um array e retorna o novo tamanho. */
                      this.usuarios.unshift(response);
                      /* retonar o array atualizado */
                      return of (response);
                   });
  }

  updateItem(id, usuario) {

    usuario.role_id =  _.chain(usuario.role_id).toArray().sortBy().value();
    /* retorna o http gravando na baseUrl(API),  */
    return this.http.post(`${this.baseUrl}/usuario/${id}`, usuario)
                      /* busca os usuarios na tabela e joga no response filtrando a saida */
                     .map((response: any) => {
                      /* joga os dados do map para usuarios e define 'i' como paramentro de condição
                      o 'i' recebe os dados de usuarios*/
                      this.usuarios = this.usuarios.map(i => {
                        /* verifica se o id do 'i' é o mesmo que foi passado no map */
                        if (i.id === id) {
                          /* Object.assign: é usado para copiar os valores de todas as propriedades próprias enumeráveis de
                          um ou mais objetos de origem para um objeto destino. Este método irá retornar o objeto destino. */
                          /* retorna os dados para o parametro e para o usuario passando ....... */
                          return Object.assign({}, i, usuario);
                        }
                        /* retorna o paramentro filtrado conforme solicitado*/
                        return i;
                      });
                      /* retorna o usuario sem passar pela condição */
                      return of (usuario);
                   });
  }

  /* Define uma linha(row) para remover */
  removeItem(row) {

    /* deleta pelo http na baseUrl(API) a linha(row) com o id passado */
    return this.http.delete(`${this.baseUrl}/usuario/${row.id}`)
                      /* filtra os dados de acordo com a resposta desejada */
                     .map((response: any) => {
                       /* indexof: retorna a posição da primeira ocorrência de um valor especificado em uma string.
                       declara a variavel i passando a linha(row)  */
                        const i = this.usuarios.indexOf(row);
                        /* retorna a tabela atualizada passando a variavel 'i' como a primeira linha */
                        this.usuarios.splice(i, 1);
                        /* retorna a linha já deletada */
                        return of (row);
                   });

  }

  /*  */
  public obterUsuario(id: any): Observable<any>
  // tslint:disable-next-line:one-line
  {
    /*  */
    return this.http.get(`${this.baseUrl}/usuario/${id}`)
                    /*  */
                    .retry(2)
                    /*  */
                    .map((response: any) => {
                          /*  */
                          return response;
                       });
  }

  /*  */
 obterUsuarios(): Observable<any> {

    /* retorna a pesquisa de acordo com o campo passado + o conteudo */
    return this.http.get(`${this.baseUrl}/usuario/pesquisa`)
                    /*  */
                    .map((response: any) => {
                      /*  */
                      this.usuarios = response;
                      /*  */
                      return response;
                    });
   // return  of(this.usuarios.slice());
  }

  pesquisarUsuarios(campo, conteudo): Observable<any> {

    /* retorna a pesquisa de acordo com o campo passado + o conteudo */
    return this.http.get(`${this.baseUrl}/usuario/pesquisa?campo=${campo}&conteudo=${conteudo}`)
                    /*  */
                    .map((response: any) => {
                      /*  */
                      this.usuarios = response;
                      /*  */
                      return response;
                    });
   // return  of(this.usuarios.slice());
  }

  public obterRoles(): Observable<any>
  {
   
    return this.http.get(`${this.baseUrl}/usuario/role`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  public obterCorretoras(): Observable<any>
  {
    
    return this.http.get(`${this.baseUrl}/usuario/corretora`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  public obterOperadoras(): Observable<any>
  {
    
    return this.http.get(`${this.baseUrl}/usuario/operadora`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  public obterTiposdeplano(): Observable<any>
  {
    
    return this.http.get(`${this.baseUrl}/usuario/tipodeplano`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

}
