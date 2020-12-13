import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class TipodeplanoService {

  tiposdeplano: any 	= [];
  baseUrl 		= 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
    this.tiposdeplano = [];
  }

  obterTiposdeplano(): Observable<any> {
    return of (this.tiposdeplano.slice());
  }

  adicionarTipodeplano(tipodeplano): Observable<any> {

    return this.http.post(`${this.baseUrl}/tipodeplano`, tipodeplano)
                     .map((response: any) => {
                      this.tiposdeplano.unshift(response);
                      return of (response);
                   });
  }

  atualizarTipodeplano(id, tipodeplano) {

    return this.http.post(`${this.baseUrl}/tipodeplano/${id}`, tipodeplano)
                     .map((response: any) => {
                      this.tiposdeplano = this.tiposdeplano.map(i => {
                        if (i.id === id) {
                          return Object.assign({}, i, tipodeplano);
                        }
                        return i;
                      });
                      return of (tipodeplano);
                   });
  }

  removerTipodeplano(row) {
    return this.http.delete(`${this.baseUrl}/tipodeplano/${row.id}`)
                     .map((response: any) => {
                        const i = this.tiposdeplano.indexOf(row);
                        this.tiposdeplano.splice(i, 1);
                        return of (row);
                   });

  }

  public obterTipodeplano(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/tipodeplano/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarTiposdeplano(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/tipodeplano/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      this.tiposdeplano = response.data;
                      return response;
                    });
  }

  todasTiposdeplano(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/tipodeplano?limite=10&page=${page}`)
                    .map((response: any) => {
                      this.tiposdeplano = response.data;
                      return response;
                    });
  }

}
