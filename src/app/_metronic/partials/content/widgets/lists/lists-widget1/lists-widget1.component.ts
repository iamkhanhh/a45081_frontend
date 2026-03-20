import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lists-widget1',
  templateUrl: './lists-widget1.component.html',
})
export class ListsWidget1Component {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() items: any[] = [];
  
  constructor(private router: Router) {}

  viewAnalysis(id: number) {
    this.router.navigate(['/analyses/index', id]);
  }
}
