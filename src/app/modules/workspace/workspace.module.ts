import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceComponent } from './workspace.component';
import { WorkspaceListComponent } from './workspace-list/workspace-list.component';
import { WorkspaceIndexComponent } from './workspace-index/workspace-index.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { WorkspaceService } from './services/workspace.service';


@NgModule({
  declarations: [
    WorkspaceComponent,
    WorkspaceIndexComponent,
    WorkspaceListComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    WorkspaceRoutingModule
  ],
  providers: [WorkspaceService]
})
export class WorkspaceModule { }
