import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class PlanoxcarenciaService {

  baseUrl 					    = 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {

  }

  adicionarPlanoxcarencia(planoxcarencia): Observable<any> {

    return this.http.post(`${this.baseUrl}/planoxcarencia`, planoxcarencia)
                     .map((response: any) => {
                      return response;
                   });
  }

  atualizarPlanoxcarencia(id, planoxcarencia) {

    return this.http.post(`${this.baseUrl}/planoxcarencia/${id}`, planoxcarencia)
                     .map((response: any) => {
                      return response;
                   });
  }

  removerPlanoxcarencia(row) {
    return this.http.delete(`${this.baseUrl}/planoxcarencia/${row.id}`)
                     .map((response: any) => {
                        return response;
                   });

  }

  public obterPlanoxcarencia(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/planoxcarencia/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarPlanoxcarencias(plano_id, page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoxcarencia/pesquisa?plano_id=${plano_id}&campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  todosPlanoxcarencias(plano_id,page=1): Observable<any> {

    return this.http.get(`${this.baseUrl}/planoxcarencia?plano_id=${plano_id}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterProcedimento(): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoxcarencia/procedimento`)
                    .map((response: any) => {
                      return response;
                    });
  }

}
