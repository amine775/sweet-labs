import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(modules => modules.AdminModule)
    },
    {
        path: 'login',
        component: LoginComponent
    }, {
        path: '**',
        component: HomeComponent
    }
];
