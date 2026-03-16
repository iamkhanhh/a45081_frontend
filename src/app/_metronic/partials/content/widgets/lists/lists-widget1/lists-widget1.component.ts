import { Component, Input } from '@angular/core';

export interface ListItem {
  icon: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-lists-widget1',
  templateUrl: './lists-widget1.component.html',
})
export class ListsWidget1Component {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() items: ListItem[] = [];
  constructor() {}
}
