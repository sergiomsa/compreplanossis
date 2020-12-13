import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class AreadeatuacaoestadoService {

  baseUrl 		          = 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
  }

  adicionarAreadeatuacaoestado(areadeatuacaoestado): Observable<any> {
    return this.http.post(`${this.baseUrl}/areadeatuacaoestado`, areadeatuacaoestado)
                      .map((response: any) => {
                        return response;
                    });
  }

  atualizarAreadeatuacaoestado(id, areadeatuacaoestado) {
    return this.http.post(`${this.baseUrl}/areadeatuacaoestado/${id}`, areadeatuacaoestado)
                     .map((areadeatuacaoestado: any) => {
                      return areadeatuacaoestado;
                   });
  }

  removerAreadeatuacaoestado(row) {
    return this.http.delete(`${this.baseUrl}/areadeatuacaoestado/${row.id}`)
                     .map((response: any) => {
                        return response;
                   });

  }

  public obterAreadeatuacaoestado(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/areadeatuacaoestado/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarAreadeatuacaoestados(abrangencia_id,page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/areadeatuacaoestado/pesquisa?abrangencia_id=${abrangencia_id}&campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  todosAreadeatuacaoestados(abrangencia_id,page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/areadeatuacaoestado?abrangencia_id=${abrangencia_id}&limite=10&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterEstados(): Observable<any> {
    return this.http.get(`${this.baseUrl}/areadeatuacaoestado/estado`)
                    .map((response: any) => {
                      return response;
                    });
  }

}
