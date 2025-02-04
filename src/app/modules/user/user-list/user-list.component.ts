import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { GroupingState, PaginatorState } from 'src/app/_metronic/shared/models';
import { UserService } from '../services/user-service.service';
import { CreateUserComponent } from '../components/create-user/create-user.component';
import { DeleteUserComponent } from '../components/delete-user/delete-user.component';
import { DeleteMultipleUserComponent } from '../components/delete-multiple-user/delete-multiple-user.component';

export interface user {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users: user[] = [];
  paginator: PaginatorState = new PaginatorState();
  grouping: GroupingState = new GroupingState();
  isLoading: boolean = false;
  filterGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private toastr: ToastrService,
    private readonly userService: UserService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.filterForm();
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    const formValue = this.filterGroup.value;
    this.userService.loadUsers(this.paginator.page, this.paginator.pageSize, formValue).subscribe((response: any) => {
      this.isLoading = false;
      if (response.status === 'success') {
        this.users = response.data;
        const itemIds = this.users.map((w: user) => {
          return w.id;
        });
        this.paginator = this.paginator.recalculatePaginator(response.pageBegin, response.pageEnd, response.totalItems, response.totalPages);
        this.grouping.clearRows(itemIds);
        this.cd.detectChanges();
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  paginate(paginator: PaginatorState) {
    this.paginator = paginator;
    this.loadUsers();
  }

  newUser() {
    this.edit(undefined);
  }

  edit(id: number | undefined) {
    const modalRef = this.modalService.open(CreateUserComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.loadUsers(),
      () => { }
    );
  }

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteUserComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.loadUsers(),
      () => { }
    );
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteMultipleUserComponent, { size: 'md' });
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(() =>
      this.loadUsers(),
      () => { }
    );
  }

  filterForm() {
    this.filterGroup = this.fb.group({
      searchTerm: [''],
      role: [''],
      status: ['']
    });
    this.subscriptions.push(
      this.filterGroup.valueChanges.subscribe((values) => {
        this.loadUsers()
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
