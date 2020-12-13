import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class VendedorService {

  Vendedores: any 	= [];
  baseUrl 		= 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {
    this.Vendedores 	= [];
  }

  obterVendedores(): Observable<any> {
    return of (this.Vendedores.slice());
  }

  obterCorretoras(): Observable<any> {
    return this.http.get(`${this.baseUrl}/vendedor/corretoras`)
      .map((response: any) => {
        return response;
      });
  }

  obterBancos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/vendedor/bancos`)
      .map((response: any) => {
        return response;
      });
  }

  adicionarVendedor(vendedor): Observable<any> {

    return this.http.post(`${this.baseUrl}/vendedor`, vendedor)
                     .map((response: any) => {
                      return of (response);
                   });
  }

  atualizarVendedor(id, vendedor) {

    return this.http.post(`${this.baseUrl}/vendedor/${id}`, vendedor)
                     .map((vendedor: any) => {
                      return of (vendedor);
                   });
  }

  removerVendedor(row) {
    return this.http.delete(`${this.baseUrl}/vendedor/${row.id}`)
                     .map((response: any) => {
                        return of (row);
                   });

  }

  public obterVendedor(id: any): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/vendedor/${id}`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

  pesquisarVendedores(page=1, campo, conteudo): Observable<any> {
    return this.http.get(`${this.baseUrl}/vendedor/pesquisa?campo=${campo}&conteudo=${conteudo}&limite=10&page=${page}`)
                    .map((response: any) => {
                      this.Vendedores = response.data;
                      return response;
                    });
  }

  todasVendedores(page=1): Observable<any> {
    return this.http.get(`${this.baseUrl}/vendedor?limite=10&page=${page}`)
                    .map((response: any) => {
                      this.Vendedores = response.data;
                      return response;
                    });
  }

  public cep(cep: any): Observable<any>
  {
 
     return this.http.get(`${this.baseUrl}/cep?cep=${cep}`)
                     .retry(2)
                     .map((response: any) => {
                           return response;
                        });
  }

  exportarVendedores(pesquisa): Observable<any> {

    return this.http.post(`${this.baseUrl}/vendedor/excell`,pesquisa, {responseType:'arraybuffer'});
					
  }

}
