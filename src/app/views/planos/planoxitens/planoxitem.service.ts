import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class PlanoxitemService {

  baseUrl 					    = 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {

  }

  adicionarPlanoxitem(planoxitem): Observable<any> {

    return this.http.post(`${this.baseUrl}/planoxitem`, planoxitem)
                     .map((response: any) => {
                      return response;
                   });
  }

  atualizarPlanoxitem(id, planoxitem) {

    return this.http.post(`${this.baseUrl}/planoxitem/${id}`, planoxitem)
                     .map((response: any) => {
                      return response;
                   });
  }

  removerPlanoxitem(row) {
    return this.http.delete(`${this.baseUrl}/planoxitem/${row.id}`)
                     .map((response: any) => {
                        return response;
                   });

  }

  public obterPlanoxitem(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/planoxitem/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarPlanoxitens(plano_id, page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoxitem/pesquisa?plano_id=${plano_id}&campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  todosPlanoxitens(plano_id,page=1): Observable<any> {

    return this.http.get(`${this.baseUrl}/planoxitem?plano_id=${plano_id}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterItem(): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoxitem/itens`)
                    .map((response: any) => {
                      return response;
                    });
  }

}
