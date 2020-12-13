import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class MeusdadosService {

  baseUrl 		= 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) { }

  public obterMeusdados(): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/meusdados`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }

 atualizarProfile(profile): Observable<any> {
   
    return this.http.post(`${this.baseUrl}/meusdados`, profile)

                     .map((response: any) => {

                        return response;
                   });
  }

  public cep(cep: any): Observable<any>
  {
    return this.http.get(`http://viacep.com.br/ws/${cep}/json/`)
                    .retry(2)
                    .map((response: any) => {
                          return response;
                       });
  }


}
