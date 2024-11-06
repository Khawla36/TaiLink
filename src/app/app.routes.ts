import { Routes } from '@angular/router';
import { AddUserComponent } from './components/user-form/user-form.component';
import { ListOfPeopleComponent } from './components/list-of-people/list-of-people.component';

export const routes: Routes = [
    { path: '', redirectTo: 'add-people-list', pathMatch: 'full' },
    { path: 'userform', component: AddUserComponent },
    { path: '', component: ListOfPeopleComponent }
];
