import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-chart-chromosome-ng',
  templateUrl: './chart-chromosome-ng.component.html'
})
export class ChartChromosomeNgComponent implements OnChanges {
  @Input() labels: string[] = [];
  @Input() values: number[] = [];

  public chartType: ChartConfiguration['type'] = 'bar';
  public chartData: ChartConfiguration['data'] = { labels: this.labels, datasets: [] };

  ngOnChanges(changes: SimpleChanges): void {
    this.chartData = {
      labels: this.labels,
      datasets: [
        { data: this.values, label: 'Variants', backgroundColor: '#4caf50' }
      ]
    };
  }
}
