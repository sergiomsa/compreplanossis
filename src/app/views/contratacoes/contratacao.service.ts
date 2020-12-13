import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class ContratacaoService {

  contratacoes: any 	= [];
  baseUrl 		= 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
    this.contratacoes = [];
  }

  obterContratacoes(): Observable<any> {
    return of (this.contratacoes.slice());
  }

  adicionarContratacao(contratacao): Observable<any> {

    return this.http.post(`${this.baseUrl}/contratacao`, contratacao)
                     .map((response: any) => {
                      this.contratacoes.unshift(response);
                      return of (response);
                   });
  }

  atualizarContratacao(id, contratacao) {

    return this.http.post(`${this.baseUrl}/contratacao/${id}`, contratacao)
                     .map((response: any) => {
                      this.contratacoes = this.contratacoes.map(i => {
                        if (i.id === id) {
                          return Object.assign({}, i, contratacao);
                        }
                        return i;
                      });
                      return of (contratacao);
                   });
  }

  removerContratacao(row) {
    return this.http.delete(`${this.baseUrl}/contratacao/${row.id}`)
                     .map((response: any) => {
                        const i = this.contratacoes.indexOf(row);
                        this.contratacoes.splice(i, 1);
                        return of (row);
                   });

  }

  public obterContratacao(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/contratacao/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarContratacoes(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/contratacao/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      this.contratacoes = response.data;
                      return response;
                    });
  }

  todasContratacoes(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/contratacao?limite=10&page=${page}`)
                    .map((response: any) => {
                      this.contratacoes = response.data;
                      return response;
                    });
  }

}
