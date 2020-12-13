import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class AbrangenciaService {

  baseUrl 		          = 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
  }

  adicionarAbrangencia(abrangencia): Observable<any> {
    return this.http.post(`${this.baseUrl}/abrangencia`, abrangencia)
                      .map((response: any) => {
                        return response;
                    });
  }

  atualizarAbrangencia(id, abrangencia) {
    return this.http.post(`${this.baseUrl}/abrangencia/${id}`, abrangencia)
                     .map((abrangencia: any) => {
                      return abrangencia;
                   });
  }

  removerAbrangencia(row) {
    return this.http.delete(`${this.baseUrl}/abrangencia/${row.id}`)
                     .map((response: any) => {
                      return response;
                   });

  }

  public obterAbrangencia(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/abrangencia/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarAbrangencias(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/abrangencia/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  todosAbrangencias(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/abrangencia?limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

}
