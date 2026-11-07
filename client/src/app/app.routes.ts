import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Register } from './pages/register/register';
import { Account } from './pages/account/account';

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
        component: Account
    }
];
