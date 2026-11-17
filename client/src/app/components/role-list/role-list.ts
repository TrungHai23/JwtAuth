import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RoleInterface } from '../../interfaces/role';

@Component({
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  selector: 'app-role-list',
  styleUrl: './role-list.css',
  templateUrl: './role-list.html',
})
export class RoleList {
  @Input({required: true}) roles!: RoleInterface[] | null;
  @Output() deleteRole:EventEmitter<string>  = new EventEmitter<string>();

  delete(id: string): void {
    this.deleteRole.emit(id);
  }
}
