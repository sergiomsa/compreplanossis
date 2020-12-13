import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

/* O decorador(decorator) identifica serviços e outras classes que devem ser injetadas */
@Injectable()
/* exporta a classe ModuloService podendo ser acessada em outros locais */
export class ModuloService {
  /* define modulos como um array vazio([]), podendo conter qualquer tipo de dados(any) */
  modulos: any 	= [];
  /* usa uma baseUrl definada (http://........) para acesso dos dados */
  baseUrl 		= 'https://api.compreplanos.com.br/api/app';
  /*  */
  private usuario: any;
  /* constroi a autorização e segurança para acesso aos dados de modulos (que é o exemplo) */
  constructor(private http: HttpClient) {
    this.modulos = [];
  }

  // ******* Implemtente suas APIs ********
  /* passa um observable(observavel) para todos os dados contidos em getModulos */
  getModulos(): Observable<any> {
    /* retonar para o modulos // slice: retorna os elementos selecionados em uma matriz, como um novo objeto de matriz. */
    return of (this.modulos.slice());
   // return  of(this.modulos.slice());
  }
          /*  */
  addItem(modulo): Observable<any> {
    /* retorna o http gravando na baseUrl(API) modulo, os dados passados pro modulo */
    return this.http.post(`${this.baseUrl}/modulo`, modulo)
                      /* map: é um operador observável que chama uma função para cada modulo
                      em seu fluxo de entrada e envia o resultado da função para seu fluxo de saída. */
                     .map((response: any) => {
                       /* unshift: adiciona novos itens ao início de um array e retorna o novo tamanho. */
                      this.modulos.unshift(response);
                      /* retonar o array atualizado */
                      return of (response);
                   });
  }

  updateItem(id, modulo) {

    return this.http.post(`${this.baseUrl}/modulo/${id}`, modulo)
                      /* busca os modulos na tabela e joga no response filtrando a saida */
                     .map((response: any) => {
                      /* joga os dados do map para modulos e define 'i' como paramentro de condição
                      o 'i' recebe os dados de modulos*/
                      this.modulos = this.modulos.map(i => {
                        /* verifica se o id do 'i' é o mesmo que foi passado no map */
                        if (i.id === id) {
                          /* Object.assign: é usado para copiar os valores de todas as propriedades próprias enumeráveis de
                          um ou mais objetos de origem para um objeto destino. Este método irá retornar o objeto destino. */
                          /* retorna os dados para o parametro e para o modulo passando ....... */
                          return Object.assign({}, i, modulo);
                        }
                        /* retorna o paramentro filtrado conforme solicitado*/
                        return i;
                      });
                      /* retorna o modulo sem passar pela condição */
                      return of (modulo);
                   });
  }

  /* Define uma linha(row) para remover */
  removeItem(row) {
    return this.http.delete(`${this.baseUrl}/modulo/${row.id}`)
                      /* filtra os dados de acordo com a resposta desejada */
                     .map((response: any) => {
                       /* indexof: retorna a posição da primeira ocorrência de um valor especificado em uma string.
                       declara a variavel i passando a linha(row)  */
                        const i = this.modulos.indexOf(row);
                        /* retorna a tabela atualizada passando a variavel 'i' como a primeira linha */
                        this.modulos.splice(i, 1);
                        /* retorna a linha já deletada */
                        return of (row);
                   });

  }

  /*  */
  public cep(cep: any): Observable<any>
  {
    /* retorna da baseUrl(API) os dados no formato json  */
    return this.http.get(`http://viacep.com.br/ws/${cep}/json/`)
                    /* faz duas tentativas para obter o CEP */
                    .retry(2)
                    /*  filtra o resultado e o trasnforma de acordo com o solicitado*/
                    .map((response: any) => {
                          /* retorna o resultado */
                          return response;
                       });
  }

  /*  */
  public obterModulo(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/modulo/${id}`)
                    /*  */
                    .retry(2)
                    /*  */
                    .map((response: any) => {
                          /*  */
                          return response;
                       });
  }

  /*  */
  public obterRegrasdecalculo(): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/regradecalculo`)
                    /*  */
                    .retry(2)
                    /*  */
                    .map((response: any) => {
                          /*  */
                          return response;
                       });
  }

  /*  */
  public obterFormasdecobranca(): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/formadecobranca`)
                    /*  */
                    .retry(2)
                    /*  */
                    .map((response: any) => {
                          /*  */
                          return response;
                       });
  }

  /*  */
  pesquisarModulos(campo, conteudo): Observable<any> {

    return this.http.get(`${this.baseUrl}/modulo/pesquisa?campo=${campo}&conteudo=${conteudo}`)
                    /*  */
                    .map((response: any) => {
                      /*  */
                      this.modulos = response;
                      /*  */
                      return response;
                    });
  }

}
