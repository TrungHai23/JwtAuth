import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [AsyncPipe],
  selector: 'app-users',
  styleUrl: './users.css',
  templateUrl: './users.html',
})
export class Users {
  authService = inject(Auth)
  user$ = this.authService.getUserAll()
  
}
