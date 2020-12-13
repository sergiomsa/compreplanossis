import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class ProcedimentoService {
  procedimentos: any 	= [];
  baseUrl 		= 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
    this.procedimentos 	= [];
  }

  obterProcedimentos(): Observable<any> {
    return of (this.procedimentos.slice());
  }

  adicionarProcedimento(procedimento): Observable<any> {

    if (procedimento.rolans)
    {
      procedimento.rolans	= "S";
    } else {
      procedimento.rolans	= "N";
    }

    return this.http.post(`${this.baseUrl}/procedimento`, procedimento)
                     .map((response: any) => {
                      this.procedimentos.unshift(response);
                      return of (response);
                   });
  }

  atualizarProcedimento(id, procedimento) {

    if (procedimento.rolans)
    {
      procedimento.rolans	= "S";
    } else {
      procedimento.rolans	= "N";
    }

    return this.http.post(`${this.baseUrl}/procedimento/${id}`, procedimento)
                     .map((response: any) => {
                      this.procedimentos = this.procedimentos.map(i => {
                        if (i.id === id) {
                          return Object.assign({}, i, procedimento);
                        }
                        return i;
                      });
                      return of (procedimento);
                   });
  }

  removerProcedimento(row) {
    return this.http.delete(`${this.baseUrl}/procedimento/${row.id}`)
                     .map((response: any) => {
                        const i = this.procedimentos.indexOf(row);
                        this.procedimentos.splice(i, 1);
                        return of (row);
                   });

  }

  public obterProcedimento(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/procedimento/${id}`)
                    .retry(2)
                    .map((response: any) => {
                         return response;
                       });
  }

  pesquisarProcedimentos(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/procedimento/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      this.procedimentos = response.data;
                      return response;
                    });
  }

  todosProcedimentos(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/procedimento?limite=10&page=${page}`)
                    .map((response: any) => {
                      this.procedimentos = response.data;
                      return response;
                    });
  }

  obterGrupo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/procedimento/grupo`)
                    .map((response: any) => {
                      return response;
                    });
  }

}
