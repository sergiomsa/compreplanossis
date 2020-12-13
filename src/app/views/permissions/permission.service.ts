import { MAT_DATE_FORMATS } from '@angular/material/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';


@Injectable()
export class PermissionService {
  permissions: any = [];
  baseUrl = 'https://api.compreplanos.com.br/api/app';
  private usuario: any;
  constructor( private http: HttpClient) {
    this.permissions = [];
  }

  // ******* Implement your APIs ********
  getItems(): Observable<any> {
    return of (this.permissions.slice());
   // return  of(this.permissions.slice());
  }

  addItem(permission): Observable<any> {

    return this.http.post(`${this.baseUrl}/permissao`, permission)
                     .map((response: any) => {
                      this.permissions.unshift(response);
                      return of (response);
                   });
  }

  updateItem(id, permission) {

   return this.http.post(`${this.baseUrl}/permissao/${id}`, permission)
                     .map((response: any) => {

                      this.permissions = this.permissions.map(i => {
                        if (i.id === id) {
                          return Object.assign({}, i, response);
                        }
                        return i;
                      });
                      return of (response);
                   });
  }

  removeItem(row) {
    return this.http.delete(`${this.baseUrl}/permissao/${row.id}`)
                     .map((response: any) => {
                        const i = this.permissions.indexOf(row);
                        this.permissions.splice(i, 1);
                        return of (row);
                   });

  }

  public obterPermission(id: any): Observable<any>
  // tslint:disable-next-line:one-line
  {
    return this.http.get(`${this.baseUrl}/permissao/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }


  pesquisarPermissions(programa_id, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/permissao/pesquisa?campo=${campo}&conteudo=${conteudo}&programa_id=${programa_id}`)
                    .map((response: any) => {
                      this.permissions = response;
                      return response;
                    });
   // return  of(this.permissions.slice());
  }

  public obterProgramas(): Observable<any>
  // tslint:disable-next-line:one-line
  {
    return this.http.get(`${this.baseUrl}/programa`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

}
