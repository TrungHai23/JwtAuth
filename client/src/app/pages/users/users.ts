import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';

@Component({
  imports: [],
  selector: 'app-users',
  styleUrl: './users.css',
  templateUrl: './users.html',
})
export class Users {
  authService = inject(Auth)
  
}
