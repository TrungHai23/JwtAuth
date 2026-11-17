import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { required } from '@angular/forms/signals';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RoleCreateRequest } from '../../interfaces/role-create-request';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule, MatIcon],
  selector: 'app-role-form',
  styleUrl: './role-form.css',
  templateUrl: './role-form.html',
})
export class RoleForm {
  @Input({required: true}) role!: RoleCreateRequest;
  @Input() errorMessage!: string;
  @Output() addRole:EventEmitter<RoleCreateRequest> = new EventEmitter<RoleCreateRequest>();

  add(){
    this.addRole.emit(this.role)
  }
}
