import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

/* O decorador(decorator) identifica serviços e outras classes que devem ser injetadas */
@Injectable()
/* exporta a classe RoleService podendo ser acessada em outros locais */
export class RoleService {
  /* define roles como um array vazio([]), podendo conter qualquer tipo de dados(any) */
  roles: any = [];
  /* usa uma baseUrl definada (http://........) para acesso dos dados */
  baseUrl = 'https://api.compreplanos.com.br/api/app';
  /*  */
  private usuario: any;
  /* constroi a autorização e segurança para acesso aos dados de roles (que é o exemplo) */
  constructor( private http: HttpClient) {
    this.roles = [];
  }

  // ******* Implemtente suas APIs ********
  /* passa um observable(observavel) para todos os dados contidos em getRoles */
  getRoles(): Observable<any> {
    /* retonar para o roles // slice: retorna os elementos selecionados em uma matriz, como um novo objeto de matriz. */
    return of (this.roles.slice());
   // return  of(this.roles.slice());
  }
          /*  */
  addItem(role): Observable<any> {
    /* busca a autorização no AuthGuard passando o usuario */
    /* retorna o http gravando na baseUrl(API) role, os dados passados pro role */
    return this.http.post(`${this.baseUrl}/role`, role)
                      /* map: é um operador observável que chama uma função para cada role
                      em seu fluxo de entrada e envia o resultado da função para seu fluxo de saída. */
                     .map((response: any) => {
                       /* unshift: adiciona novos itens ao início de um array e retorna o novo tamanho. */
                      this.roles.unshift(response);
                      /* retonar o array atualizado */
                      return of (response);
                   });
  }

  updateItem(id, role) {

    /* retorna o http gravando na baseUrl(API),  */
    return this.http.post(`${this.baseUrl}/role/${id}`, role)
                      /* busca os roles na tabela e joga no response filtrando a saida */
                     .map((response: any) => {
                      /* joga os dados do map para roles e define 'i' como paramentro de condição
                      o 'i' recebe os dados de roles*/
                      this.roles = this.roles.map(i => {
                        /* verifica se o id do 'i' é o mesmo que foi passado no map */
                        if (i.id === id) {
                          /* Object.assign: é usado para copiar os valores de todas as propriedades próprias enumeráveis de
                          um ou mais objetos de origem para um objeto destino. Este método irá retornar o objeto destino. */
                          /* retorna os dados para o parametro e para o role passando ....... */
                          return Object.assign({}, i, role);
                        }
                        /* retorna o paramentro filtrado conforme solicitado*/
                        return i;
                      });
                      /* retorna o role sem passar pela condição */
                      return of (role);
                   });
  }

  /* Define uma linha(row) para remover */
  removeItem(row) {
    /* deleta pelo http na baseUrl(API) a linha(row) com o id passado */
    return this.http.delete(`${this.baseUrl}/role/${row.id}`)
                      /* filtra os dados de acordo com a resposta desejada */
                     .map((response: any) => {
                       /* indexof: retorna a posição da primeira ocorrência de um valor especificado em uma string.
                       declara a variavel i passando a linha(row)  */
                        const i = this.roles.indexOf(row);
                        /* retorna a tabela atualizada passando a variavel 'i' como a primeira linha */
                        this.roles.splice(i, 1);
                        /* retorna a linha já deletada */
                        return of (row);
                   });

  }

  /*  */
 obterRole(id: any): Observable<any>
  // tslint:disable-next-line:one-line
  {
    /*  */
    return this.http.get(`${this.baseUrl}/role/${id}`)
                    /*  */
                    .retry(2)
                    /*  */
                    .map((response: any) => {
                          /*  */
                          return response;
                       });
  }

  /*  */
  pesquisarRoles(campo, conteudo): Observable<any> {

    /* retorna a pesquisa de acordo com o campo passado + o conteudo */
    return this.http.get(`${this.baseUrl}/role/pesquisa?campo=${campo}&conteudo=${conteudo}`)
                    /*  */
                    .map((response: any) => {
                      /*  */
                      this.roles = response;
                      /*  */
                      return response;
                    });
   // return  of(this.roles.slice());
  }

  obterModulos(): Observable<any>
  // tslint:disable-next-line:one-line
  {
    /*  */
    return this.http.get(`${this.baseUrl}/role/modulo`)
                    /*  */
                    .retry(2)
                    /*  */
                    .map((response: any) => {
                          /*  */
                          return response;
                       });
  }
  
  pesquisarProgramas(campo, conteudo): Observable<any> {

    /* retorna a pesquisa de acordo com o campo passado + o conteudo */
    return this.http.get(`${this.baseUrl}/role/programa/pesquisa?campo=${campo}&conteudo=${conteudo}`)
                    .map((response: any) => {
                      return response;
                    });
   // return  of(this.roles.slice());
  }

  
  obterPermissoes(role_id: any, modulo_id: any, programa_id:any ): Observable<any>
  // tslint:disable-next-line:one-line
  {
    return this.http.get(`${this.baseUrl}/role/permissao/pesquisa?role_id=${role_id}&modulo_id=${modulo_id}&programa_id=${programa_id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }
  
  gravarPermissoes(permissoes): Observable<any>
  // tslint:disable-next-line:one-line
  {
    return this.http.post(`${this.baseUrl}/role/permissao`,permissoes)
                    .retry(2)
                    .map((response: any) => {
                         this.roles = this.roles.map(i => {
							/* verifica se o id do 'i' é o mesmo que foi passado no map */
							if (i.id === permissoes.role_id) {
							  /* Object.assign: é usado para copiar os valores de todas as propriedades próprias enumeráveis de
							  um ou mais objetos de origem para um objeto destino. Este método irá retornar o objeto destino. */
							  /* retorna os dados para o parametro e para o role passando ....... */
							  return Object.assign({}, i, response);
							}
							/* retorna o paramentro filtrado conforme solicitado*/
							return i;
						  });
						  /* retorna o role sem passar pela condição */
						  return this.roles;
                       });
  }

}
