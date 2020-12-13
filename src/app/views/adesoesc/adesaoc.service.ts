import { HttpClient, HttpClientModule} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()

export class AdesaocService {
  baseUrl 			= 'https://api.compreplanos.com.br/api/app';
  constructor(private http: HttpClient) {
  }

  pesquisarAdesoes(pesquisa): Observable<any> {
     
    return this.http.get(`${this.baseUrl}/adesaoconfirmada?orderby=${pesquisa.orderby}&direction=${pesquisa.direction}&tipodeplano_id=${pesquisa.tipodeplano_id}&campo=${pesquisa.campo}&conteudo=${pesquisa.conteudo}&csituacao=${pesquisa.csituacao}&datainicio=${pesquisa.datainicio}&datafim=${pesquisa.datafim}&page=${pesquisa.pagina}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterAdesaoConfirmada(id): Observable<any> {
     
    return this.http.get(`${this.baseUrl}/adesaoconfirmada/${id}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterPerfil(): Observable<any> {
     
    return this.http.get(`${this.baseUrl}/perfil`)
                    .map((response: any) => {
                      return response;
                    });
  }

  obterBeneficiario(id): Observable<any> {
     
    return this.http.get(`${this.baseUrl}/adesaobeneficiario/${id}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  exportarAdesoes(pesquisa): Observable<any> {

    return this.http.post(`${this.baseUrl}/adesaoconfirmada`,pesquisa, {responseType:'arraybuffer'});
					
  }

  downloadContrato(id) 
  {
    return this.http.post(`${this.baseUrl}/adesao/downloadcontratoaprovado/${id}`, {}, {responseType:'arraybuffer'});
  }

  downloadDocumento(id) 
  {
    return this.http.post(`${this.baseUrl}/adesao/downloaddocumento/${id}`, {}, {responseType:'arraybuffer'});
  }

  downloadPosvenda(id) 
  {
    return this.http.post(`${this.baseUrl}/adesao/downloadposvenda/${id}`, {}, {responseType:'arraybuffer'});
  }

  emailContrato(id) 
  {
    return this.http.get(`${this.baseUrl}/adesao/reenviaremailcadastro/${id}`);
  }

  pdfContrato(id) 
  {
    return this.http.get(`${this.baseUrl}/convertidomanual/${id}`);
  }

  salvarAdesao(id, adesao) {

    return this.http.post(`${this.baseUrl}/adesaoconfirmada/${id}`, adesao)
                     .map((adesao: any) => {
                      return of (adesao);
                   });
  }

  salvarBeneficiario(id, adesao) {

    return this.http.post(`${this.baseUrl}/adesaobeneficiario/${id}`, adesao)
                     .map((adesao: any) => {
                      return of (adesao);
                   });
  }

  cancelarAdesao(id, adesao) {

    return this.http.post(`${this.baseUrl}/adesaoconfirmada/cancelar/${id}`, adesao)
                     .map((adesao: any) => {
                      return of (adesao);
                   });
  }

  excluircancelarAdesao(id) {

    return this.http.post(`${this.baseUrl}/adesaoconfirmada/excluircancelar/${id}`, {})
                     .map((adesao: any) => {
                      return of (adesao);
                   });
  }

  rejeitarAdesao(id, adesao) {

    return this.http.post(`${this.baseUrl}/adesaoconfirmada/rejeitar/${id}`, adesao)
                     .map((adesao: any) => {
                      return of (adesao);
                   });
  }

  preAprovarAdesao(id) {

    return this.http.post(`${this.baseUrl}/adesaoconfirmada/preaprovar/${id}`,{})
                     .map((adesao: any) => {
                      return of (adesao);
                   });
  }

  aprovarAdesao(id) {

    return this.http.post(`${this.baseUrl}/adesaoconfirmada/aprovar/${id}`,{})
                     .map((adesao: any) => {
                      return of (adesao);
                   });
  }

  implantarAdesaoMassa(adesoes) {

    return this.http.post(`${this.baseUrl}/adesaoconfirmada/implantarmassa`,adesoes)
                     .map((adesao: any) => {
                      return of (adesao);
                   });
  }

  aprovarAdesaoMassa(adesoes) {

    return this.http.post(`${this.baseUrl}/adesaoconfirmada/aprovarmassa`,adesoes)
                     .map((adesao: any) => {
                      return of (adesao);
                   });
  }

  preaprovarAdesaoMassa(adesoes) {

    return this.http.post(`${this.baseUrl}/adesaoconfirmada/preaprovarmassa`,adesoes)
                     .map((adesao: any) => {
                      return of (adesao);
                   });
  }

  reprovarDocumento(id, motivo) {

    return this.http.post(`${this.baseUrl}/adesaoconfirmada/reprovardocumento/${id}`, motivo)
                     .map((adesao: any) => {
                      return of (adesao);
                   });
  }

  aprovarDocumento(id) {

    return this.http.post(`${this.baseUrl}/adesaoconfirmada/aprovardocumento/${id}`, {})
                     .map((adesao: any) => {
                      return of (adesao);
                   });
  }

  reprovarDmedicos(id) {

    return this.http.post(`${this.baseUrl}/adesaoconfirmada/reprovardmedicos/${id}`, {})
                     .map((adesao: any) => {
                      return of (adesao);
                   });
  }

  removerAdesao(row) {
    return this.http.delete(`${this.baseUrl}/adesao/${row.id}`)
                     .map((response: any) => {
                        return of (row);
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

  carencias(plano_id,page=1, limite=999): Observable<any> {

    return this.http.get(`${this.baseUrl}/planoxecarencia?plano_id=${plano_id}&limite=${limite}&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  coparticipacoes(plano_id,page=1,limite=999): Observable<any> {

    return this.http.get(`${this.baseUrl}/planoxcoparticipacao?plano_id=${plano_id}&limite=${limite}&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  faixasetarias(plano_id,page=1,limite=999): Observable<any> {

    return this.http.get(`${this.baseUrl}/planoxfaixaetaria?plano_id=${plano_id}&limite=${limite}&page=${page}`)
                    .map((response: any) => {
                      return response;
                    });
  }

  atualizarResposta(id, resposta) {
    
    resposta.data    = this.formatarData(resposta.data);

    return this.http.post(`${this.baseUrl}/adesao/pergunta/resposta/${id}`,resposta)
                     .map((resposta: any) => {
                      return of (resposta);
                   });
  }

  limparResposta(id) {
    
    return this.http.post(`${this.baseUrl}/adesao/pergunta/resposta/limpar/${id}`,{})
                     .map((resposta: any) => {
                      return of (resposta);
                   });
  }

  listarResposta(id) {
    
    return this.http.get(`${this.baseUrl}/adesao/pergunta/resposta/limpar/${id}`)
                      .map((response: any) => {
                        return response;
                      });
  }


  viewbeneficiarioposvenda(id) {

    return this.http.get(`${this.baseUrl}/adesaoconfirmada/beneficiarioposvenda/${id}`)
                            .map((response: any) => {
                              return response;
                            });
  }

  salvarbeneficiarioposvenda(posvenda) {

    return this.http.post(`${this.baseUrl}/adesaoconfirmada/beneficiarioposvenda`, posvenda)
                     .map((posvenda: any) => {
                      return of (posvenda);
                   });
  }

  formatarData(data) {

    let datav = data;
    let dataa = [];

    if ((typeof datav === 'string') && (datav.indexOf('-'))) {
      dataa = datav.split('-');
      datav = dataa[2] + '/' + dataa[1] + '/' + dataa[0];
    } else {
      if ((typeof datav === 'string') && (datav.indexOf('/'))) {
      } else {
        try {
          datav = datav.format('DD/MM/YYYY');
        } catch (e) {
          let day = datav && datav.getDate() || -1;
          let dayWithZero = day.toString().length > 1 ? day : '0' + day;
          let month = datav && datav.getMonth() + 1 || -1;
          let monthWithZero = month.toString().length > 1 ? month : '0' + month;
          let year = datav && datav.getFullYear() || -1;
          datav = dayWithZero + '/' + monthWithZero + '/' + year;
        }
      }
    }

    return datav;

  }

}
