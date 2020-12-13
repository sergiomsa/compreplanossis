import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class PlanoxprocedimentoService {

  baseUrl 					    = 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {

  }

  adicionarPlanoxprocedimento(planoxprocedimento): Observable<any> {

    return this.http.post(`${this.baseUrl}/planoxprocedimento`, planoxprocedimento)
                     .map((response: any) => {
                      return response;
                   });
  }

  atualizarPlanoxprocedimento(id, planoxprocedimento) {

    return this.http.post(`${this.baseUrl}/planoxprocedimento/${id}`, planoxprocedimento)
                     .map((response: any) => {
                      return response;
                   });
  }

  removerPlanoxprocedimento(row) {
    return this.http.delete(`${this.baseUrl}/planoxprocedimento/${row.id}`)
                     .map((response: any) => {
                        return response;
                   });

  }

  public obterPlanoxprocedimento(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/planoxprocedimento/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarPlanoxprocedimentos(plano_id, page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoxprocedimento/pesquisa?plano_id=${plano_id}&campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  todosPlanoxprocedimentos(plano_id,page=1): Observable<any> {

    return this.http.get(`${this.baseUrl}/planoxprocedimento?plano_id=${plano_id}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterProcedimento(): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoxprocedimento/procedimento`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterRoldecobertura(): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoxprocedimento/roldecobertura`)
                    .map((response: any) => {
                      return response;
                    });
  }
}
