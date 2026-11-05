import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [RouterLink, MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
