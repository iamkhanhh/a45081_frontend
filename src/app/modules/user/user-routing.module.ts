import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'users',
        component: UserListComponent,
      },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: '**', redirectTo: 'users', pathMatch: 'full' },
    ],
    // canActivate: [RoleGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
