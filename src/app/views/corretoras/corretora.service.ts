import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class CorretoraService {

  Corretoras: any 	= [];
  baseUrl 		= 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
    this.Corretoras 	= [];
  }

  obterCorretoras(): Observable<any> {
    return of (this.Corretoras.slice());
  }

  obterOperadoras(): Observable<any> {
    return this.http.get(`${this.baseUrl}/corretora/operadoras`)
      .map((response: any) => {
        return response;
      });
  }

  adicionarCorretora(corretora): Observable<any> {

    return this.http.post(`${this.baseUrl}/corretora`, corretora)
                     .map((response: any) => {
                      return of (response);
                   });
  }

  atualizarCorretora(id, corretora) {

    return this.http.post(`${this.baseUrl}/corretora/${id}`, corretora)
                     .map((corretora: any) => {
                      return of (corretora);
                   });
  }

  removerCorretora(row) {
    return this.http.delete(`${this.baseUrl}/corretora/${row.id}`)
                     .map((response: any) => {
                        return of (row);
                   });

  }

  public obterCorretora(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/corretora/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarCorretoras(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/corretora/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      this.Corretoras = response.data;
                      return response;
                    });
  }

  todasCorretoras(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/corretora?limite=10&page=${page}`)
                    .map((response: any) => {
                      this.Corretoras = response.data;
                      return response;
                    });
  }

  public cep(cep: any): Observable<any>
  {
 
     return this.http.get(`${this.baseUrl}/cep?cep=${cep}`)
                     .retry(2)
                     .map((response: any) => {
                           return response;
                        });
  }

}
