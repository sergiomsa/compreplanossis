import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class ProgramaService {
  programas: any 	= [];
  baseUrl 			= 'https://api.compreplanos.com.br/api/app';
  private usuario: any;
  constructor(private http: HttpClient) {
    this.programas = [];
  }

  // ******* Implement your APIs ********
  getItems(): Observable<any> {
    return of (this.programas.slice());
  }

  addItem(programa): Observable<any> {

     return this.http.post(`${this.baseUrl}/programa`, programa)
                     .map((response: any) => {
                      this.programas.unshift(response);
                      return of (response);
                   });
  }

  updateItem(id, programa) {

   return this.http.post(`${this.baseUrl}/programa/${id}`, programa)
                     .map((response: any) => {

                      this.programas = this.programas.map(i => {
                        if (i.id === id) {
                          return Object.assign({}, i, programa);
                        }
                        return i;
                      });
                      return of (programa);
                   });
  }

  removeItem(row) {
    
    return this.http.delete(`${this.baseUrl}/programa/${row.id}`)
                     .map((response: any) => {
                        const i = this.programas.indexOf(row);
                        this.programas.splice(i, 1);
                        return of (row);
                   });

  }

  public obterPrograma(id: any): Observable<any>
  {
    
    return this.http.get(`${this.baseUrl}/programa/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }


  pesquisarProgramas(modulo_id, campo, conteudo): Observable<any> {
    
    return this.http.get(`${this.baseUrl}/programa/pesquisa?campo=${campo}&conteudo=${conteudo}&modulo_id=${modulo_id}`)
                    .map((response: any) => {
                      this.programas = response;
                      return response;
                    });
  }

  public obterModulos(): Observable<any>
  {

    return this.http.get(`${this.baseUrl}/modulo`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

}
