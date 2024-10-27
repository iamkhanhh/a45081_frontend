import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sample-list',
  templateUrl: './sample-list.component.html',
  styleUrl: './sample-list.component.scss'
})
export class SampleListComponent implements OnInit  {

  constructor(
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    
  }

  newSample() {
    this.toastr.success('Uploaded a sample successfully!', 'Success!', {
      timeOut: 3000,
    });
  }
}
