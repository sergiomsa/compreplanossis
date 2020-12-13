import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class PlanoxabrangenciaService {

  baseUrl 					    = 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {

  }

  adicionarPlanoxabrangencia(planoxabrangencia): Observable<any> {

    return this.http.post(`${this.baseUrl}/planoxabrangencia`, planoxabrangencia)
                     .map((response: any) => {
                      return response;
                   });
  }

  atualizarPlanoxabrangencia(id, planoxabrangencia) {

    return this.http.post(`${this.baseUrl}/planoxabrangencia/${id}`, planoxabrangencia)
                     .map((response: any) => {
                      return response;
                   });
  }

  removerPlanoxabrangencia(row) {
    return this.http.delete(`${this.baseUrl}/planoxabrangencia/${row.id}`)
                     .map((response: any) => {
                        return response;
                   });

  }

  public obterPlanoxabrangencia(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/planoxabrangencia/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarPlanoxabrangencias(plano_id, page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoxabrangencia/pesquisa?plano_id=${plano_id}&campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  todosPlanoxabrangencias(plano_id,page=1): Observable<any> {

    return this.http.get(`${this.baseUrl}/planoxabrangencia?plano_id=${plano_id}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterAbrangencia(): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoxabrangencia/abrangencia`)
                    .map((response: any) => {
                      return response;
                    });
  }

}
