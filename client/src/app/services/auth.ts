import { Injectable, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { AuthResponse } from '../interfaces/auth-response';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Auth {
    apiUrl: string = environment.apiUrl;
    private tokenKey: string = 'token';

    constructor(private http: HttpClient) {}

    login(data: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}account/login`, data).pipe(
            map((response: AuthResponse) => {
                if (response.isSuccess) {
                    localStorage.setItem(this.tokenKey, response.token);
                }
                return response;
            })
        );
    }
}
