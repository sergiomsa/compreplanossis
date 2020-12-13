import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class PlanoxfaixaetariaService {

  baseUrl 					    = 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {

  }

  adicionarPlanoxfaixaetaria(planoxfaixaetaria): Observable<any> {

    return this.http.post(`${this.baseUrl}/planoxfaixaetaria`, planoxfaixaetaria)
                     .map((response: any) => {
                      return response;
                   });
  }

  atualizarPlanoxfaixaetaria(id, planoxfaixaetaria) {

    return this.http.post(`${this.baseUrl}/planoxfaixaetaria/${id}`, planoxfaixaetaria)
                     .map((response: any) => {
                      return response;
                   });
  }

  removerPlanoxfaixaetaria(row) {
    return this.http.delete(`${this.baseUrl}/planoxfaixaetaria/${row.id}`)
                     .map((response: any) => {
                        return response;
                   });

  }

  public obterPlanoxfaixaetaria(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/planoxfaixaetaria/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarPlanoxfaixasetarias(plano_id, page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoxfaixaetaria/pesquisa?plano_id=${plano_id}&campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  todosPlanoxfaixasetarias(plano_id,page=1): Observable<any> {

    return this.http.get(`${this.baseUrl}/planoxfaixaetaria?plano_id=${plano_id}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterFaixaetariasabrangencias(): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoxfaixaetaria/faixaetariasabrangencias`)
                    .map((response: any) => {
                      return response;
                    });
  }

}
