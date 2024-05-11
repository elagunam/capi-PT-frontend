import { Routes } from '@angular/router';
import { ContactsComponent } from './pages/contacts/contacts.component';

export const routes: Routes = [
    {
        path: '',
        component: ContactsComponent
    }


    // {
    //     path: 'auth',
    //     canActivate: [publicGuard],
    //     loadChildren: () => import('./auth/auth.routes').then(routes => routes.routes)
    //   }
];
