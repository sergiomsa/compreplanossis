import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class RedeService {

  redes: any 	= [];
  baseUrl 		= 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
    this.redes = [];
  }

  obterRedes(): Observable<any> {
    return of (this.redes.slice());
  }

  adicionarRede(rede): Observable<any> {

    return this.http.post(`${this.baseUrl}/rede`, rede)
                     .map((response: any) => {
                      this.redes.unshift(response);
                      return of (response);
                   });
  }

  atualizarRede(id, rede) {

    return this.http.post(`${this.baseUrl}/rede/${id}`, rede)
                     .map((response: any) => {
                      this.redes = this.redes.map(i => {
                        if (i.id === id) {
                          return Object.assign({}, i, rede);
                        }
                        return i;
                      });
                      return of (rede);
                   });
  }

  removerRede(row) {
    return this.http.delete(`${this.baseUrl}/rede/${row.id}`)
                     .map((response: any) => {
                        const i = this.redes.indexOf(row);
                        this.redes.splice(i, 1);
                        return of (row);
                   });

  }

  public obterRede(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/rede/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarRedes(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/rede/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      this.redes = response.data;
                      return response;
                    });
  }

  todasRedes(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/rede?limite=10&page=${page}`)
                    .map((response: any) => {
                      this.redes = response.data;
                      return response;
                    });
  }

}
