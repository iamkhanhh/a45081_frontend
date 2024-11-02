import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WorkspaceService } from '../services/workspace.service';

export interface workspace {
  id: number;
  name: string;
  number: number;
  pipeline_name: string;
  createdAt: string;
}

@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html',
  styleUrl: './workspace-list.component.scss'
})
export class WorkspaceListComponent implements OnInit {

  workspaces: workspace[] = [];

  constructor(
    private toastr: ToastrService,
    private workspaceService: WorkspaceService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.workspaceService.loadWorkspaces().subscribe((response: any) => {
      if (response.status == 'success') {
        this.workspaces = response.data;
        this.cd.detectChanges();
        console.log(this.workspaces);
      } else {
        this.toastr.error(response.message);
      }
    })
  }

  newWorkspace() {
    this.toastr.success('Created a workspace successfully!', 'Success!', {
      timeOut: 3000,
    });
  }
}
