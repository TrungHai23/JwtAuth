import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const matSnackbar = inject(MatSnackBar);

  if(inject(Auth).isLoggedIn()){
    return true;
  }

   matSnackbar.open('U must be logged in to view this page', 'OK', {
      duration: 3000,
    })
  return false;
};
