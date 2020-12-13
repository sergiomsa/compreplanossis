import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class FaixaetariaService {
  cfaixasetarias: any 	= [];
  baseUrl 		= 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
    this.cfaixasetarias 	= [];
  }

  obterFaixasetarias(): Observable<any> {
    return of (this.cfaixasetarias.slice());
  }

  adicionarFaixaetaria(Faixaetaria): Observable<any> {

    return this.http.post(`${this.baseUrl}/faixaetaria`, Faixaetaria)
                     .map((response: any) => {
                      this.cfaixasetarias.unshift(response);
                      return of (response);
                   });
  }

  atualizarFaixaetaria(id, Faixaetaria) {

    return this.http.post(`${this.baseUrl}/faixaetaria/${id}`, Faixaetaria)
                     .map((response: any) => {
                      this.cfaixasetarias = this.cfaixasetarias.map(i => {
                        if (i.id === id) {
                          return Object.assign({}, i, Faixaetaria);
                        }
                        return i;
                      });
                      return of (Faixaetaria);
                   });
  }

  removerFaixaetaria(row) {
    return this.http.delete(`${this.baseUrl}/faixaetaria/${row.id}`)
                     .map((response: any) => {
                        const i = this.cfaixasetarias.indexOf(row);
                        this.cfaixasetarias.splice(i, 1);
                        return of (row);
                   });

  }

  public obterFaixaetaria(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/faixaetaria/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarFaixasetarias(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/faixaetaria/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      this.cfaixasetarias = response.data;
                      return response;
                    });
  }

  todosFaixasetarias(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/faixaetaria?limite=10&page=${page}`)
                    .map((response: any) => {
                      this.cfaixasetarias = response.data;
                      return response;
                    });
  }

  obterGrupo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/faixaetaria/grupo`)
                    .map((response: any) => {
                      this.cfaixasetarias = response.data;
                      return response;
                    });
  }

  obterRoldecobertura(): Observable<any> {
    return this.http.get(`${this.baseUrl}/faixaetaria/roldecobertura`)
                    .map((response: any) => {
                      this.cfaixasetarias = response.data;
                      return response;
                    });
  }

}
