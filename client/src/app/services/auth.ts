import { Injectable, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { AuthResponse } from '../interfaces/auth-response';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';

@Injectable({
    providedIn: 'root'
})
export class Auth {
    apiUrl: string = environment.apiUrl;
    private tokenKey: string = 'token';

    constructor(private http: HttpClient) { }

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

     register(data: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}account/register`, data);
    }

    getUserDetails = () => {
        const token = this.getToken();
        if (!token) return null;
        const decodedToken: any = jwtDecode(token);
        const userDetails = {
            id: decodedToken.nameid,
            fullName: decodedToken.name,
            email: decodedToken.email,
            role: decodedToken.role || []
        };
        return userDetails;
    }

    isLoggedIn = (): boolean => {
        const token = this.getToken();
        if (!token) {
            return false;
        }
        return !this.isTokenExpired();
    };

    private isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) {
            return true;
        }
        const decodedToken = jwtDecode(token);
        const isTokenExpired = Date.now() >=decodedToken.exp! * 1000;
        if (isTokenExpired) {
            this.logout();
        }
        return isTokenExpired;
    }

    logout = (): void => {
        localStorage.removeItem(this.tokenKey);
    }

    private getToken = (): string | null => localStorage.getItem(this.tokenKey) || "";
}
