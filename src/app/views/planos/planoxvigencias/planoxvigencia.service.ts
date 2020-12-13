import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class PlanoxvigenciaService {

  baseUrl 					    = 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {

  }

  adicionarPlanoxvigencia(planoxvigencia): Observable<any> {

    return this.http.post(`${this.baseUrl}/planoxvigencia`, planoxvigencia)
                     .map((response: any) => {
                      return response;
                   });
  }

  atualizarPlanoxvigencia(id, planoxvigencia) {

    return this.http.post(`${this.baseUrl}/planoxvigencia/${id}`, planoxvigencia)
                     .map((response: any) => {
                      return response;
                   });
  }

  removerPlanoxvigencia(row) {
    return this.http.delete(`${this.baseUrl}/planoxvigencia/${row.id}`)
                     .map((response: any) => {
                        return response;
                   });

  }

  public obterPlanoxvigencia(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/planoxvigencia/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarPlanoxvigencias(plano_id, page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoxvigencia/pesquisa?plano_id=${plano_id}&campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  todosPlanoxvigencias(plano_id,page=1): Observable<any> {

    return this.http.get(`${this.baseUrl}/planoxvigencia?plano_id=${plano_id}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterVigencia(): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoxvigencia/vigencia`)
                    .map((response: any) => {
                      return response;
                    });
  }

}
