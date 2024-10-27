import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html',
  styleUrl: './workspace-list.component.scss'
})
export class WorkspaceListComponent implements OnInit {

  constructor(
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    
  }

  newWorkspace() {
    this.toastr.success('Created a workspace successfully!', 'Success!', {
      timeOut: 3000,
    });
  }
}
