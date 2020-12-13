import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class ContratacaoService {

  perguntas: any 	= [];
  baseUrl 		= 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
    this.perguntas = [];
  }

  obterPerguntas(): Observable<any> {
    return of (this.perguntas.slice());
  }

  adicionarContratacao(pergunta): Observable<any> {

    return this.http.post(`${this.baseUrl}/pergunta`, pergunta)
                     .map((response: any) => {
                      this.perguntas.unshift(response);
                      return of (response);
                   });
  }

  atualizarContratacao(id, pergunta) {

    return this.http.post(`${this.baseUrl}/pergunta/${id}`, pergunta)
                     .map((response: any) => {
                      this.perguntas = this.perguntas.map(i => {
                        if (i.id === id) {
                          return Object.assign({}, i, pergunta);
                        }
                        return i;
                      });
                      return of (pergunta);
                   });
  }

  removerContratacao(row) {
    return this.http.delete(`${this.baseUrl}/pergunta/${row.id}`)
                     .map((response: any) => {
                        const i = this.perguntas.indexOf(row);
                        this.perguntas.splice(i, 1);
                        return of (row);
                   });

  }

  public obterContratacao(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/pergunta/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarPerguntas(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/pergunta/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      this.perguntas = response.data;
                      return response;
                    });
  }

  todasPerguntas(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/pergunta?limite=10&page=${page}`)
                    .map((response: any) => {
                      this.perguntas = response.data;
                      return response;
                    });
  }

  obterOperadora(): Observable<any> {
    return this.http.get(`${this.baseUrl}/plano/operadora`)
                    .map((response: any) => {
                      return response;
                    });
  }

}
