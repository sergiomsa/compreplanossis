import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class CoparticipacaoService {

  coparticipacoes: any 	= [];
  baseUrl 		= 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
    this.coparticipacoes = [];
  }

  obterCoparticipacoes(): Observable<any> {
    return of (this.coparticipacoes.slice());
  }

  adicionarCoparticipacao(coparticipacao): Observable<any> {

    return this.http.post(`${this.baseUrl}/coparticipacao`, coparticipacao)
                     .map((response: any) => {
                      this.coparticipacoes.unshift(response);
                      return of (response);
                   });
  }

  atualizarCoparticipacao(id, coparticipacao) {

    return this.http.post(`${this.baseUrl}/coparticipacao/${id}`, coparticipacao)
                     .map((response: any) => {
                      this.coparticipacoes = this.coparticipacoes.map(i => {
                        if (i.id === id) {
                          return Object.assign({}, i, coparticipacao);
                        }
                        return i;
                      });
                      return of (coparticipacao);
                   });
  }

  removerCoparticipacao(row) {
    return this.http.delete(`${this.baseUrl}/coparticipacao/${row.id}`)
                     .map((response: any) => {
                        const i = this.coparticipacoes.indexOf(row);
                        this.coparticipacoes.splice(i, 1);
                        return of (row);
                   });

  }

  public obterCoparticipacao(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/coparticipacao/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarCoparticipacoes(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/coparticipacao/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      this.coparticipacoes = response.data;
                      return response;
                    });
  }

  todasCoparticipacoes(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/coparticipacao?limite=10&page=${page}`)
                    .map((response: any) => {
                      this.coparticipacoes = response.data;
                      return response;
                    });
  }

}
