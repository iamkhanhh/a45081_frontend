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
import { CreateAnalysisComponent } from './components/create-analysis/create-analysis.component';
import { DeleteAnalysisComponent } from './components/delete-analysis/delete-analysis.component';
import { NgbDatepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    WorkspaceComponent,
    WorkspaceIndexComponent,
    WorkspaceListComponent,
    CreateWorkspaceComponent,
    DeleteWorkspaceComponent,
    CreateAnalysisComponent,
    DeleteAnalysisComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    WorkspaceRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgbDropdownModule,
    NgbDatepickerModule,
  ],
  providers: [WorkspaceService]
})
export class WorkspaceModule { }
