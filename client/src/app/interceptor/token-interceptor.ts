import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth)

  if(authService.getToken()){
    const cloned = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authService.getToken())
    })

    return next(cloned)
  }

  return next(req)
};
