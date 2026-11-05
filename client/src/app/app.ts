import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Navbar } from './components/navbar/navbar';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, RouterOutlet, MatButtonModule, Navbar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('client');
}
