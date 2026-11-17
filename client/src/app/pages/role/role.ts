import { Component, inject } from '@angular/core';
import { RoleForm } from '../../components/role-form/role-form';
import { RoleService } from '../../services/role';
import { RoleCreateRequest } from '../../interfaces/role-create-request';
import { MatDivider } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { RoleList } from '../../components/role-list/role-list';
import { AsyncPipe } from '@angular/common';


@Component({
  imports: [RoleForm, MatDivider, MatSnackBarModule, RoleList, AsyncPipe],
  selector: 'app-role',
  styleUrl: './role.css',
  templateUrl: './role.html',
})
export class Role {
  roleService = inject(RoleService);
  errorMessage = '';
  role: RoleCreateRequest  = {} as RoleCreateRequest
  role$ = this.roleService.getRoles()
  snackBar = inject(MatSnackBar)
  

  createRole(role: RoleCreateRequest){
    this.roleService.createRole(role).subscribe({
      next:(response: {message: string}) => {
        this.role$ = this.roleService.getRoles();
        this.snackBar.open("Create role successfully", "OK", {
          duration: 3000
        })
      },

      error: (error: HttpErrorResponse) => {
        if(error.status === 400){
          this.errorMessage = error.error
        }
      }
    })
  }

  deleteRole(id: string){
    this.roleService.deleteRole(id).subscribe({
      next:(response: {message: string}) => {
        this.role$ = this.roleService.getRoles()
        this.snackBar.open("Role delete successfully", "Close", {
          duration: 3000
        })
      },

      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.message, "Close", {
          duration: 3000
        })
      }
    })
  }
}
