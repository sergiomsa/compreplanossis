import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class PlanoitemService {

  planoitens: any 	= [];
  baseUrl 		= 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
    this.planoitens = [];
  }

  obterPlanoitens(): Observable<any> {
    return of (this.planoitens.slice());
  }

  adicionarPlanoitem(planoitem): Observable<any> {

    return this.http.post(`${this.baseUrl}/planoitem`, planoitem)
                     .map((response: any) => {
                      this.planoitens.unshift(response);
                      return of (response);
                   });
  }

  atualizarPlanoitem(id, planoitem) {

    return this.http.post(`${this.baseUrl}/planoitem/${id}`, planoitem)
                     .map((response: any) => {
                      this.planoitens = this.planoitens.map(i => {
                        if (i.id === id) {
                          return Object.assign({}, i, planoitem);
                        }
                        return i;
                      });
                      return of (planoitem);
                   });
  }

  removerPlanoitem(row) {
    return this.http.delete(`${this.baseUrl}/planoitem/${row.id}`)
                     .map((response: any) => {
                        const i = this.planoitens.indexOf(row);
                        this.planoitens.splice(i, 1);
                        return of (row);
                   });

  }

  public obterPlanoitem(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/planoitem/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarPlanoitens(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoitem/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      this.planoitens = response.data;
                      return response;
                    });
  }

  todasPlanoitens(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoitem?limite=10&page=${page}`)
                    .map((response: any) => {
                      this.planoitens = response.data;
                      return response;
                    });
  }

}
