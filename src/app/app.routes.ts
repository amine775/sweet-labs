import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CatalogComponent } from './catalog/catalog.component';
import { EventsComponent } from './events/events.component';
import { ContactComponent } from './contact/contact.component';
import { FavoritesComponent } from './favorites/favorites.component';

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
    }, 
    {
        path: 'catalogue',
        component: CatalogComponent
    },
    {
        path: 'events',
        component: EventsComponent
    },
    {
        path: 'contact',
        component: ContactComponent
    },
    {
        path: 'favorites', 
        component: FavoritesComponent
    },
    {
        path: '**',
        component: HomeComponent
    }
];
