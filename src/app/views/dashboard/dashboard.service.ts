import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class DashboardService {

  baseUrl 		= 'https://api.compreplanos.com.br/api/app';

  constructor(private http: HttpClient) {

  }

  obterResumo(dados): Observable<any> {
    return this.http.get(`${this.baseUrl}/indicadores?agruparpor=${dados.agruparpor}&retroagir=${dados.retroagir}&tipodeplano=${dados.tipodeplano}&abrangencia=${dados.abrangencia}&mostrar=${dados.mostrar}`)
                    .map((response: any) => {
                      return response;
                    });
  }

}
