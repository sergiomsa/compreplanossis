import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class AreadeatuacaocidadeService {

  baseUrl 		          = 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
  }

  adicionarAreadeatuacaocidade(areadeatuacaocidade): Observable<any> {
    return this.http.post(`${this.baseUrl}/areadeatuacaocidade`, areadeatuacaocidade)
                      .map((response: any) => {
                        return response;
                    });
  }

  atualizarAreadeatuacaocidade(id, areadeatuacaocidade) {
    return this.http.post(`${this.baseUrl}/areadeatuacaocidade/${id}`, areadeatuacaocidade)
                     .map((areadeatuacaocidade: any) => {
                      return areadeatuacaocidade;
                   });
  }

  removerAreadeatuacaocidade(row) {
    return this.http.delete(`${this.baseUrl}/areadeatuacaocidade/${row.id}`)
                     .map((response: any) => {
                        return response;
                   });

  }

  public obterAreadeatuacaocidade(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/areadeatuacaocidade/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarAreadeatuacaocidades(areadeatuacaoestado_id,page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/areadeatuacaocidade/pesquisa?areadeatuacaoestado_id=${areadeatuacaoestado_id}&campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  todosAreadeatuacaocidades(areadeatuacaoestado_id,page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/areadeatuacaocidade?areadeatuacaoestado_id=${areadeatuacaoestado_id}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterCidades(estado): Observable<any> {
    return this.http.get(`${this.baseUrl}/areadeatuacaocidade/cidade?estado=${estado}`)
                    .map((response: any) => {
                      return response;
                    });
  }

}
