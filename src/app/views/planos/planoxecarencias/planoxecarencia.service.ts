import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class PlanoxecarenciaService {

  baseUrl 					    = 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {

  }

  adicionarPlanoxecarencia(planoxecarencia): Observable<any> {

    return this.http.post(`${this.baseUrl}/planoxecarencia`, planoxecarencia)
                     .map((response: any) => {
                      return response;
                   });
  }

  atualizarPlanoxecarencia(id, planoxecarencia) {

    return this.http.post(`${this.baseUrl}/planoxecarencia/${id}`, planoxecarencia)
                     .map((response: any) => {
                      return response;
                   });
  }

  removerPlanoxecarencia(row) {
    return this.http.delete(`${this.baseUrl}/planoxecarencia/${row.id}`)
                     .map((response: any) => {
                        return response;
                   });

  }

  public obterPlanoxecarencia(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/planoxecarencia/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarPlanoxecarencias(plano_id, page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoxecarencia/pesquisa?plano_id=${plano_id}&campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  todosPlanoxecarencias(plano_id,page=1): Observable<any> {

    return this.http.get(`${this.baseUrl}/planoxecarencia?plano_id=${plano_id}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterGrupo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoxecarencia/grupo`)
                    .map((response: any) => {
                      return response;
                    });
  }

}
