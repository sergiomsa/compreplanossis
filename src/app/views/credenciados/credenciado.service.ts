import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class CredenciadoService {

  baseUrl 					    = 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
    
  }

  adicionarCredenciado(credenciado): Observable<any> {
    return this.http.post(`${this.baseUrl}/credenciado`, credenciado)
                      .map((response: any) => {
                        return response;
                    });
  }

  atualizarCredenciado(id,credenciado) {
    return this.http.post(`${this.baseUrl}/credenciado/${id}`, credenciado)
                     .map((credenciado: any) => {
                      return  credenciado;
                   });
  }

  removerCredenciado(row) {
    return this.http.delete(`${this.baseUrl}/credenciado/${row.id}`)
                     .map((response: any) => {
                      return response;
                   });

  }

  public obterCredenciado(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/credenciado/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarCredenciados(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/credenciado/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  todosCredenciados(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/credenciado?limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterEspecialidade(): Observable<any> {
    return this.http.get(`${this.baseUrl}/credenciado/especialidade`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterTipodeestabelecimento(): Observable<any> {
    return this.http.get(`${this.baseUrl}/credenciado/tipodeestabelecimento`)
                    .map((response: any) => {
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
