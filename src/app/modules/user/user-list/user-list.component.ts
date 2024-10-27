import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

  constructor(
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    
  }

  newUser() {
    this.toastr.success('Created an user successfully!', 'Success!', {
      timeOut: 3000,
    });
  }
}
