import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SampleComponent } from './sample.component';
import { SampleListComponent } from './sample-list/sample-list.component';

const routes: Routes = [
  {
		path: '',
		component: SampleComponent,
		children: [
			{
				path: 'list',
				component: SampleListComponent,
        // canDeactivate: [CanActivatePageGuard]
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
export class SampleRoutingModule { }
