import { HttpClient, HttpClientModule} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()

export class AdesaoService {
  baseUrl 			= 'https://api.compreplanos.com.br/api/app';
  constructor(private http: HttpClient) {
  }

  pesquisarAdesoes(pesquisa): Observable<any> {
     
    return this.http.get(`${this.baseUrl}/adesao?campo=${pesquisa.campo}&conteudo=${pesquisa.conteudo}&origem=${pesquisa.origem}&situacao=${pesquisa.status}&datainicio=${pesquisa.datainicio}&datafim=${pesquisa.datafim}&page=${pesquisa.pagina}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  exportarAdesoes(pesquisa): Observable<any> {

    return this.http.post(`${this.baseUrl}/adesao`,pesquisa, {responseType:'arraybuffer'});
					
  }

  downloadContrato(id) 
  {
    return this.http.post(`${this.baseUrl}/adesao/downloadcontrato/${id}`, {}, {responseType:'arraybuffer'});
  }

  emailContrato(id) 
  {
    return this.http.get(`${this.baseUrl}/adesao/reenviaremailcadastro/${id}`);
  }

  pdfContrato(id) 
  {
    return this.http.get(`${this.baseUrl}/convertidomanual/${id}`);
  }

  removerAdesao(row) {
    return this.http.delete(`${this.baseUrl}/adesao/${row.id}`)
                     .map((response: any) => {
                        return of (row);
                   });

  }

}
