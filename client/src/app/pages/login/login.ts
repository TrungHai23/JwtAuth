import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { LoginRequest } from '../../interfaces/login-request';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  authService = inject(Auth);
  matSnackbar = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Signal để toggle ẩn/hiện mật khẩu
  hidePassword = signal(true);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  togglePasswordVisibility() {
    this.hidePassword.update((val) => !val);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value as LoginRequest).subscribe({
        next: (response) => {
          this.matSnackbar.open(response.message, 'Close', { duration: 3000, verticalPosition: 'top' });
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.matSnackbar.open(error.error.message || 'Login failed. Please try again.', 'Close', { duration: 3000, verticalPosition: 'top' });
        }
      });
      console.log('Login payload:', this.loginForm.value);
      // Gọi service đăng nhập tại đây, sau đó redirect:
      // this.router.navigate(['/']);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
 }
