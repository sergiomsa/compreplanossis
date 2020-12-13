import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class GrupoService {

  grupos: any 	= [];
  baseUrl 		= 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
    this.grupos = [];
  }

  obterGrupos(): Observable<any> {
    return of (this.grupos.slice());
  }

  adicionarGrupo(grupo): Observable<any> {

    return this.http.post(`${this.baseUrl}/grupo`, grupo)
                     .map((response: any) => {
                      this.grupos.unshift(response);
                      return of (response);
                   });
  }

  atualizarGrupo(id, grupo) {

    return this.http.post(`${this.baseUrl}/grupo/${id}`, grupo)
                     .map((response: any) => {
                      this.grupos = this.grupos.map(i => {
                        if (i.id === id) {
                          return Object.assign({}, i, grupo);
                        }
                        return i;
                      });
                      return of (grupo);
                   });
  }

  removerGrupo(row) {
    return this.http.delete(`${this.baseUrl}/grupo/${row.id}`)
                     .map((response: any) => {
                        const i = this.grupos.indexOf(row);
                        this.grupos.splice(i, 1);
                        return of (row);
                   });

  }

  public obterGrupo(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/grupo/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarGrupos(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/grupo/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      this.grupos = response.data;
                      return response;
                    });
  }

  todasGrupos(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/grupo?limite=10&page=${page}`)
                    .map((response: any) => {
                      this.grupos = response.data;
                      return response;
                    });
  }

}
