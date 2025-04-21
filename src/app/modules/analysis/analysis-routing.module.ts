import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalysisComponent } from './analysis.component';
import { AnalysisListComponent } from './analysis-list/analysis-list.component';

const routes: Routes = [
  {
    path: '',
    component: AnalysisComponent,
    children: [
      {
        path: '',
        component: AnalysisListComponent
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
export class AnalysisRoutingModule { }
