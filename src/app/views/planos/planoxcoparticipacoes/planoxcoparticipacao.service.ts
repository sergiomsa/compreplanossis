import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class PlanoxcoparticipacaoService {

  baseUrl 					    = 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {

  }

  adicionarPlanoxcoparticipacao(planoxcoparticipacao): Observable<any> {

    return this.http.post(`${this.baseUrl}/planoxcoparticipacao`, planoxcoparticipacao)
                     .map((response: any) => {
                      return response;
                   });
  }

  atualizarPlanoxcoparticipacao(id, planoxcoparticipacao) {

    return this.http.post(`${this.baseUrl}/planoxcoparticipacao/${id}`, planoxcoparticipacao)
                     .map((response: any) => {
                      return response;
                   });
  }

  removerPlanoxcoparticipacao(row) {
    return this.http.delete(`${this.baseUrl}/planoxcoparticipacao/${row.id}`)
                     .map((response: any) => {
                        return response;
                   });

  }

  public obterPlanoxcoparticipacao(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/planoxcoparticipacao/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarPlanoxcoparticipacoes(plano_id, page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoxcoparticipacao/pesquisa?plano_id=${plano_id}&campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  todosPlanoxcoparticipacoes(plano_id,page=1): Observable<any> {

    return this.http.get(`${this.baseUrl}/planoxcoparticipacao?plano_id=${plano_id}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterCoparticipacao(): Observable<any> {
    return this.http.get(`${this.baseUrl}/planoxcoparticipacao/coparticipacao`)
                    .map((response: any) => {
                      return response;
                    });
  }

}
