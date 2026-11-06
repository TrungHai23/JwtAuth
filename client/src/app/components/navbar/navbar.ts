import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  imports: [RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    CommonModule
  ],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  authService = inject(Auth);
  router = inject(Router);
  matSnackBar = inject(MatSnackBar);

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.matSnackBar.open('Đăng xuất thành công!', 'Đóng', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success']
    });
    this.router.navigate(['/login']);
  }
}
