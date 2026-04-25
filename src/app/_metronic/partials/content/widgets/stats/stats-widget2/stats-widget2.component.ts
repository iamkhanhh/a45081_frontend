import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-widget2',
  templateUrl: './stats-widget2.component.html',
  styles: [`
    .stat-icon-wrap {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
  `]
})
export class StatsWidget2Component {
  @Input() title = '';
  @Input() description = '';
  @Input() iconClass = 'fa-solid fa-chart-line';
  @Input() color = 'primary';
}
