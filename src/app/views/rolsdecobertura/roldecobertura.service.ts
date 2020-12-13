import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class RoldecoberturaService {

  rolsdecobertura: any 	= [];
  baseUrl 		= 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
    this.rolsdecobertura = [];
  }

  obterRolsdecobertura(): Observable<any> {
    return of (this.rolsdecobertura.slice());
  }

  adicionarRoldecobertura(roldecobertura): Observable<any> {

    return this.http.post(`${this.baseUrl}/roldecobertura`, roldecobertura)
                     .map((response: any) => {
                      this.rolsdecobertura.unshift(response);
                      return of (response);
                   });
  }

  atualizarRoldecobertura(id, roldecobertura) {

    return this.http.post(`${this.baseUrl}/roldecobertura/${id}`, roldecobertura)
                     .map((response: any) => {
                      this.rolsdecobertura = this.rolsdecobertura.map(i => {
                        if (i.id === id) {
                          return Object.assign({}, i, roldecobertura);
                        }
                        return i;
                      });
                      return of (roldecobertura);
                   });
  }

  removerRoldecobertura(row) {
    return this.http.delete(`${this.baseUrl}/roldecobertura/${row.id}`)
                     .map((response: any) => {
                        const i = this.rolsdecobertura.indexOf(row);
                        this.rolsdecobertura.splice(i, 1);
                        return of (row);
                   });

  }

  public obterRoldecobertura(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/roldecobertura/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarRolsdecobertura(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/roldecobertura/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      this.rolsdecobertura = response.data;
                      return response;
                    });
  }

  todasRolsdecobertura(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/roldecobertura?limite=10&page=${page}`)
                    .map((response: any) => {
                      this.rolsdecobertura = response.data;
                      return response;
                    });
  }

}
