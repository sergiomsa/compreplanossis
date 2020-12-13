import { HttpClient, HttpClientModule} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()

export class PedidoService {
  baseUrl 			= 'https://api.compreplanos.com.br/api/app';
  constructor(private http: HttpClient) {
  }

  pesquisarPedidos(pesquisa): Observable<any> {
     
    return this.http.get(`${this.baseUrl}/pedido?campo=${pesquisa.campo}&conteudo=${pesquisa.conteudo}&status=${pesquisa.status}&payment_method=${pesquisa.payment_method}&datainicio=${pesquisa.datainicio}&datafim=${pesquisa.datafim}&page=${pesquisa.pagina}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  enviarEmail(id): Observable<any> {
     
    return this.http.get(`${this.baseUrl}/pedido/enviaremail/${id}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  enviarCadastro(id): Observable<any> {
     
    return this.http.get(`${this.baseUrl}/pedido/enviarcadastro/${id}`)
                    .map((response: any) => {
                      return response;
                    });
  }
  
  exportarPedidos(pesquisa): Observable<any> {

    return this.http.post(`${this.baseUrl}/pedido`,pesquisa, {responseType:'arraybuffer'});
					
  }

}
