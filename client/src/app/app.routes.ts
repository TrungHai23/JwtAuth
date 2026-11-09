import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Register } from './pages/register/register';
import { Account } from './pages/account/account';
import { authGuard } from './guards/auth-guard';
import { Users } from './pages/users/users';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,

    },
    {
        path:'home',
        component: Home
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'account/:id',
        component: Account,
        canActivate: [authGuard]
    },
    {
        path: 'users',
        component: Users,
        canActivate: [roleGuard],
        data:{
            roles: ['Admin']
        },
        
    }
];
