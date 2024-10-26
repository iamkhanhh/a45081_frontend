import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkspaceComponent } from './workspace.component';
import { WorkspaceListComponent } from './workspace-list/workspace-list.component';
import { AuthGuard } from '../auth/services/auth.guard';
import { WorkspaceIndexComponent } from './workspace-index/workspace-index.component';

const routes: Routes = [
	{
		path: '',
		component: WorkspaceComponent,
		children: [
			{
				path: 'list',
				component: WorkspaceListComponent,
				canActivate: [AuthGuard]
			},
			{
				path: 'index/:id',
				component: WorkspaceIndexComponent,
				canActivate: [AuthGuard]
			},
			{ path: '', redirectTo: 'list', pathMatch: 'full' },
			{ path: '**', redirectTo: 'errors/404', pathMatch: 'full' },
		]
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }
