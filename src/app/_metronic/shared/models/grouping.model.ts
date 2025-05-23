export interface IGroupingState {
  selectedRowIds: Set<any>;
  itemIds: any[];
  checkAreAllRowsSelected(): boolean;
  selectRow(id: any): IGroupingState;
  // tslint:disable-next-line:variable-name
  clearRows(_itemIds: any[]): IGroupingState;
  isRowSelected(id: any): boolean;
  selectAllRows(): IGroupingState;
  getSelectedRows(): any[];
  getSelectedRowsCount(): any;
}

export class GroupingState implements IGroupingState {
  selectedRowIds: Set<any> = new Set<any>();
  itemIds: any[] = [];

  checkAreAllRowsSelected(): boolean {
    if (this.itemIds.length === 0) {
      return false;
    }

    return this.selectedRowIds.size === this.itemIds.length;
  }

  selectRow(id: any): GroupingState {
    if (this.selectedRowIds.has(id)) {
      this.selectedRowIds.delete(id);
    } else {
      this.selectedRowIds.add(id);
    }
    return this;
  }

  // tslint:disable-next-line:variable-name
  clearRows(_itemIds: any[]): GroupingState {
    this.itemIds = _itemIds;
    this.selectedRowIds = new Set<any>();
    return this;
  }

  isRowSelected(id: any): boolean {
    return this.selectedRowIds.has(id);
  }

  selectAllRows(): GroupingState {
    const areAllSelected = this.itemIds.length === this.selectedRowIds.size;
    if (areAllSelected) {
      this.selectedRowIds = new Set<any>();
    } else {
      this.selectedRowIds = new Set<any>();
      this.itemIds.forEach(id => this.selectedRowIds.add(id));
    }
    return this;
  }

  getSelectedRows(): any[] {
    return Array.from(this.selectedRowIds);
  }

  getSelectedRowsCount(): any {
    return this.selectedRowIds.size;
  }
}

export interface IGroupingView  {
  grouping: GroupingState;
  ngOnInit(): void;
}
