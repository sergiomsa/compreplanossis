import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class PlanoxdocumentosService {

  baseUrl 		= 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) { }

  adicionarPlanoxdocumento(planoxdocumento): Observable<any> {

    return this.http.post(`${this.baseUrl}/planoxdocumento`, planoxdocumento)
                     .map((response: any) => {
                      return response;
                   });
  }

  atualizarPlanoxdocumento(id, planoxdocumento) {

    return this.http.post(`${this.baseUrl}/planoxdocumento/${id}`, planoxdocumento)
                     .map((response: any) => {
                      return response;
                   });
  }

  removerPlanoxdocumento(row) {
    return this.http.delete(`${this.baseUrl}/planoxdocumento/${row.id}`)
                     .map((response: any) => {
                        return response;
                   });

  }

  public obterPlanoxdocumento(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/planoxdocumento/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  todosPlanoxdocumentos(plano_id,page=1): Observable<any> {

    return this.http.get(`${this.baseUrl}/planoxdocumento?plano_id=${plano_id}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }


}
