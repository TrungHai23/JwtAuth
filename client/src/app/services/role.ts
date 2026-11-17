import { Injectable, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { RoleInterface } from '../interfaces/role';
import { RoleCreateRequest } from '../interfaces/role-create-request';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
    apiUrl: string = environment.apiUrl;
    
    constructor(private http: HttpClient) { }

    getRoles(): Observable<RoleInterface[]> {
        return this.http.get<RoleInterface[]>(`${this.apiUrl}roles`);
    }

    createRole(role: RoleCreateRequest): Observable<{message: string}> {
        return this.http.post<{message: string}>(`${this.apiUrl}roles`, role);
    }

    deleteRole(id: string): Observable<{message: string}> {
        return this.http.delete<{message: string}>(`${this.apiUrl}roles/${id}`);
    }
}
