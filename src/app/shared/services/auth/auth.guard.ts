import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {HttpClient , HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

@Injectable()
export class AuthGuard implements CanActivate {
  private token: any;
  private usuario: any;
  private modulos: any;
  private programas: any;
  private funcoes: any;
  private isAuthenticated = false; // Set this value dynamically
  private baseUrl         = 'https://api.compreplanos.com.br/api/app';
  constructor(private router: Router, private http: HttpClient) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isAuthenticated) {
      return true
    }
	
	if (localStorage.getItem('usuario') != null)
	{
		this.usuario        = JSON.stringify(localStorage.getItem('usuario'));
		return true
	}
		
    this.router.navigate(['/sessions/signin']);
    return false;
  }
  
  public authenticated(): boolean 
  {
	  return this.isAuthenticated;
  }
  
  public authentic(opcao: boolean) 
  {
   this.isAuthenticated = opcao;
  }
  
  public getToken() 
  {
	  
  if(localStorage.getItem('token') != null)
	{
		this.token        = JSON.parse(localStorage.getItem('token'));
	}
	
	if (this.token.access_token)
	{
		return this.token.access_token;
	}
	
  }
  
  login(usuario: any): Observable<any>
  {
    let data = {
         email: usuario.email,
         senha: usuario.password,
    };
	  
    return this.http.post(`${this.baseUrl}/loginspa`, data)
                    .map((response: any) => {
						          this.usuario               = response.usuario;
						          localStorage.setItem('usuario', JSON.stringify(this.usuario));  
						          this.token               	= response.token;
						          localStorage.setItem('token', JSON.stringify(this.token));  
                      localStorage.setItem('foto', response.foto);  
                      this.isAuthenticated 		= true;
                  });    
    
  }
  
}