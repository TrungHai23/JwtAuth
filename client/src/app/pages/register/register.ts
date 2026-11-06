import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { Role } from '../../services/role';
import { RoleInterface  } from '../../interfaces/role';
import { Observable } from 'rxjs/internal/Observable';
import { AsyncPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError } from '../../interfaces/validation-error';

// Custom validator kiểm tra password và confirmPassword trùng nhau
export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
    return null;
  }

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    confirmPassword.setErrors(null);
    return null;
  }
};

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe
  ],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder).nonNullable;
  matSnackBar = inject(MatSnackBar);
  private authService = inject(Auth);
  private router = inject(Router);
  roleService = inject(Role);
  role$!: Observable<RoleInterface[]>; // Observable chứa danh sách vai trò
  error! : ValidationError[]; // Biến để lưu lỗi từ API

  // Toggle ẩn/hiện password
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  registerForm = this.fb.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      roles: [<string[]>[], [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator }
  );

  roles$ = this.roleService.getRoles();

  onSubmit() {
    if (this.registerForm.valid) {
      const payload = this.registerForm.getRawValue();
      console.log('Register payload:', payload);
      this.authService.register(payload).subscribe({
        next: (response) => {
            this.matSnackBar.open('Đăng ký thành công! Vui lòng đăng nhập.', 'Đóng', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-success']
            }); 
            console.log('Registration successful:', response);
            this.router.navigate(['/login']);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400) {
            this.error = err!.error as ValidationError[];
            this.matSnackBar.open('Đăng ký thất bại! Email đã tồn tại.', 'Đóng', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-error']
            });
          } else {
            this.matSnackBar.open('Đăng ký thất bại! Vui lòng thử lại.', 'Đóng', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-error']
            });
          }
          console.error('Registration error:', err);
        },
        complete: () => {
          console.log('Registration request completed.');
          // this.router.navigate(['/login']);
        }
      });

      // Gọi authService.register(payload).subscribe(...)
      // Sau khi thành công:
      // this.router.navigate(['/login']);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
