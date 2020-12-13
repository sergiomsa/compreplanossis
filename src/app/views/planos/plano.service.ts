import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class PlanoService {

  baseUrl 					    = 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
  }

  adicionarPlano(plano): Observable<any> {

    if (plano.venderonline)
    {
      plano.venderonline 	= "S";
    } else {
      plano.venderonline = "N";
    }

    return this.http.post(`${this.baseUrl}/plano`, plano)
                      .map((response: any) => {
                        return response;
                    });
  }

  atualizarPlano(id, plano) {

    if (plano.venderonline)
    {
      plano.venderonline 	= "S";
    } else {
      plano.venderonline = "N";
    }
    
    return this.http.post(`${this.baseUrl}/plano/${id}`, plano)
                     .map((plano: any) => {
                      return plano;
                   });
  }

  removerPlano(row) {
    return this.http.delete(`${this.baseUrl}/plano/${row.id}`)
                     .map((response: any) => {
                        return response;
                   });

  }

  adicionarContrato(plano): Observable<any> {

    return this.http.post(`${this.baseUrl}/plano/contrato`, plano)
                      .map((response: any) => {
                        return response;
                    });
  }


  public obterPlano(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/plano/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarPlanos(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/plano/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  todosPlanos(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/plano?limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterSelecao(): Observable<any> {
    return this.http.get(`${this.baseUrl}/plano/selecao`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterTipodeplano(): Observable<any> {
    return this.http.get(`${this.baseUrl}/plano/tipodeplano`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterOperadora(): Observable<any> {
    return this.http.get(`${this.baseUrl}/plano/operadora`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterContratacao(): Observable<any> {
    return this.http.get(`${this.baseUrl}/plano/contratacao`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterAbrangencia(): Observable<any> {
    return this.http.get(`${this.baseUrl}/plano/abrangencia`)
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
