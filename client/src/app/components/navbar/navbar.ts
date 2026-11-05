import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {}
