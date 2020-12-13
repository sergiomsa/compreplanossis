import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class EspecialidadeService {

  especialidades: any 	= [];
  baseUrl 		= 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
    this.especialidades = [];
  }

  obterEspecialidades(): Observable<any> {
    return of (this.especialidades.slice());
  }

  adicionarEspecialidade(especialidade): Observable<any> {

    return this.http.post(`${this.baseUrl}/especialidade`, especialidade)
                     .map((response: any) => {
                      this.especialidades.unshift(response);
                      return of (response);
                   });
  }

  atualizarEspecialidade(id, especialidade) {

    return this.http.post(`${this.baseUrl}/especialidade/${id}`, especialidade)
                     .map((response: any) => {
                      this.especialidades = this.especialidades.map(i => {
                        if (i.id === id) {
                          return Object.assign({}, i, especialidade);
                        }
                        return i;
                      });
                      return of (especialidade);
                   });
  }

  removerEspecialidade(row) {
    return this.http.delete(`${this.baseUrl}/especialidade/${row.id}`)
                     .map((response: any) => {
                        const i = this.especialidades.indexOf(row);
                        this.especialidades.splice(i, 1);
                        return of (row);
                   });

  }

  public obterEspecialidade(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/especialidade/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarEspecialidades(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/especialidade/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      this.especialidades = response.data;
                      return response;
                    });
  }

  todasEspecialidades(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/especialidade?limite=10&page=${page}`)
                    .map((response: any) => {
                      this.especialidades = response.data;
                      return response;
                    });
  }

}
