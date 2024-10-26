import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceComponent } from './workspace.component';
import { WorkspaceListComponent } from './workspace-list/workspace-list.component';
import { WorkspaceIndexComponent } from './workspace-index/workspace-index.component';


@NgModule({
  declarations: [
    WorkspaceComponent,
    WorkspaceIndexComponent,
    WorkspaceListComponent
  ],
  imports: [
    CommonModule,
    WorkspaceRoutingModule
  ]
})
export class WorkspaceModule { }
