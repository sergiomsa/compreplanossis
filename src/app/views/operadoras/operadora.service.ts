import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class OperadoraService {

  operadoras: any 	  = [];
  vigencias: any 	    = [];
  baseUrl 		        = 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
    this.operadoras 	= [];
    this.vigencias 	  = [];
  }

  obterBancos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/vendedor/bancos`)
      .map((response: any) => {
        return response;
      });
  }
  
  obterOperadoras(): Observable<any> {
    return of (this.operadoras.slice());
  }

  obterVigencias(): Observable<any> {
    return of (this.vigencias.slice());
  }

  adicionarOperadora(operadora): Observable<any> {

    return this.http.post(`${this.baseUrl}/operadora`, operadora)
                     .map((response: any) => {
                      return of (response);
                   });
  }

  adicionarVigencia(vigencia): Observable<any> {

    return this.http.post(`${this.baseUrl}/vigencia`, vigencia)
                     .map((response: any) => {
                      return of (response);
                   });
  }

  atualizarOperadora(id, operadora) {

    return this.http.post(`${this.baseUrl}/operadora/${id}`, operadora)
                     .map((operadora: any) => {
                      return of (operadora);
                   });
  }

  atualizarVigencia(id, vigencia) {

    return this.http.post(`${this.baseUrl}/vigencia/${id}`, vigencia)
                     .map((vigencia: any) => {
                      return of (vigencia);
                   });
  }

  removerOperadora(row) {
    return this.http.delete(`${this.baseUrl}/operadora/${row.id}`)
                     .map((response: any) => {
                        return of (row);
                   });

  }

  removerVigencia(row) {
    return this.http.delete(`${this.baseUrl}/vigencia/${row.id}`)
                     .map((response: any) => {
                        return of (row);
                   });

  }

  public obterOperadora(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/operadora/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  public obterVigencia(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/vigencia/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarOperadoras(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/operadora/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      this.operadoras = response.data;
                      return response;
                    });
  }

  pesquisarVigencias(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/vigencia/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      this.vigencias = response.data;
                      return response;
                    });
  }

  todasOperadoras(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/operadora?limite=10&page=${page}`)
                    .map((response: any) => {
                      this.operadoras = response.data;
                      return response;
                    });
  }

  todasVigencias(operadora_id,page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/vigencia?operadora_id=${operadora_id}&limite=10&page=${page}`)
                    .map((response: any) => {
                      this.vigencias = response.data;
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
