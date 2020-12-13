import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class TipodeestabelecimentoService {

  tiposdeestabelecimento: any 	= [];
  baseUrl 		= 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
    this.tiposdeestabelecimento = [];
  }

  obterTiposdeestabelecimento(): Observable<any> {
    return of (this.tiposdeestabelecimento.slice());
  }

  adicionarTipodeestabelecimento(tipodeestabelecimento): Observable<any> {

    return this.http.post(`${this.baseUrl}/tipodeestabelecimento`, tipodeestabelecimento)
                     .map((response: any) => {
                      this.tiposdeestabelecimento.unshift(response);
                      return of (response);
                   });
  }

  atualizarTipodeestabelecimento(id, tipodeestabelecimento) {

    return this.http.post(`${this.baseUrl}/tipodeestabelecimento/${id}`, tipodeestabelecimento)
                     .map((response: any) => {
                      this.tiposdeestabelecimento = this.tiposdeestabelecimento.map(i => {
                        if (i.id === id) {
                          return Object.assign({}, i, tipodeestabelecimento);
                        }
                        return i;
                      });
                      return of (tipodeestabelecimento);
                   });
  }

  removerTipodeestabelecimento(row) {
    return this.http.delete(`${this.baseUrl}/tipodeestabelecimento/${row.id}`)
                     .map((response: any) => {
                        const i = this.tiposdeestabelecimento.indexOf(row);
                        this.tiposdeestabelecimento.splice(i, 1);
                        return of (row);
                   });

  }

  public obterTipodeestabelecimento(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/tipodeestabelecimento/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarTiposdeestabelecimento(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/tipodeestabelecimento/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      this.tiposdeestabelecimento = response.data;
                      return response;
                    });
  }

  todasTiposdeestabelecimento(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/tipodeestabelecimento?limite=10&page=${page}`)
                    .map((response: any) => {
                      this.tiposdeestabelecimento = response.data;
                      return response;
                    });
  }

}
