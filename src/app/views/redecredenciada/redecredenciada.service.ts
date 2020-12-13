import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class RedecredenciadaService {
  
private baseUrl = 'http://api.compreplanos.com.br/api';

  constructor(private http: HttpClient) { }

  public estados(): Observable<any> {
    return this.http.get(`${this.baseUrl}/estados`)
      .map((response: any) => {
        return response;
      });

  }

  public cidades(estado: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/cidades?estado=${estado}`)
      .map((response: any) => {
        return response;
      });

  }

  public conveniados(param: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/redecredenciada/?latitude=${param.latitude}&longitude=${param.longitude}&distancia=${param.distancia}&tipo_id=${param.tipo_id}&estado=${param.estado}&cidade=${param.cidade}&especialidade=${param.especialidade}`)
      .map((response: any) => {
        return response;
      });

  }

  public getEndereco(lat: any, lng: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/geoendereco/?latitude=${lat}&longitude=${lng}`)
      .map((result: any) => {
        return result;
      });
  }
}