import { Injectable, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { RoleInterface } from '../interfaces/role';

@Injectable({
  providedIn: 'root'
})
export class Role {
    apiUrl: string = environment.apiUrl;
    
    constructor(private http: HttpClient) { }

    getRoles(): Observable<RoleInterface[]> {
        return this.http.get<RoleInterface[]>(`${this.apiUrl}roles`);
    }
}
