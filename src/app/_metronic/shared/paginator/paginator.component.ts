import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageSizes, PaginatorState } from '../models/paginator.model';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent implements OnInit {
  @Input() paginator: PaginatorState;
  @Input() isLoading: any;
  @Output() paginate: EventEmitter<PaginatorState> = new EventEmitter();
  pageSizes: number[] = PageSizes;
  constructor() {}

  ngOnInit(): void {
  }

  pageChange(num: number) {
    this.paginator.page = num;
    this.paginate.emit(this.paginator);
  }

  sizeChange() {
    this.paginator.pageSize = +this.paginator.pageSize;
    this.paginator.page = 1;
    this.paginate.emit(this.paginator);
  }
  
  // Navigate to the first page
  goToFirstPage(): void {
    if (this.paginator.page !== 1) {
      this.pageChange(1);
    }
  }

  // Navigate to the previous page
  goToPreviousPage(): void {
    if (this.paginator.page > 1) {
      this.pageChange(this.paginator.page - 1);
    }
  }

  // Navigate to the next page
  goToNextPage(): void {
    if (this.paginator.page < this.paginator.totalPages) {
      this.pageChange(this.paginator.page + 1);
    }
  }

  // Navigate to the last page
  goToLastPage(): void {
    if (this.paginator.page !== this.paginator.totalPages) {
      this.pageChange(this.paginator.totalPages);
    }
  }

  // Get array of pages to display when paginator.totalPages <= 5
  getPagesArray(): number[] {
    return Array.from({ length: this.paginator.totalPages }, (_, i) => i + 1);
  }

  // Get array of middle pages to display when paginator.totalPages > 5
  getMiddlePagesArray(): number[] {
    const start = Math.max(2, this.paginator.page - 1);
    const end = Math.min(this.paginator.totalPages - 1, this.paginator.page + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
