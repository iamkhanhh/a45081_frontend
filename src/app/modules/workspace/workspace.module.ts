import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceComponent } from './workspace.component';
import { WorkspaceListComponent } from './workspace-list/workspace-list.component';
import { WorkspaceIndexComponent } from './workspace-index/workspace-index.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { WorkspaceService } from './services/workspace.service';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { CreateWorkspaceComponent } from './components/create-workspace/create-workspace.component';
import { DeleteWorkspaceComponent } from './components/delete-workspace/delete-workspace.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    WorkspaceComponent,
    WorkspaceIndexComponent,
    WorkspaceListComponent,
    CreateWorkspaceComponent,
    DeleteWorkspaceComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    WorkspaceRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [WorkspaceService]
})
export class WorkspaceModule { }
