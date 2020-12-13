import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(public http: HttpClient) {}

  public checkEmail(email: string): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        email
      }
    });
    return this.http.get(`/api/users/check-email`, { params });
  }

  public checkUsername(username: string): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        username
      }
    });
    return this.http.get(`/api/users/check-username`, { params });
  }
}
