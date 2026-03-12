import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart-coverage-ng',
  templateUrl: './chart-coverage-ng.component.html'
})
export class ChartCoverageNgComponent implements OnChanges {
  @Input() chartLabels: string[] = ['Sample A','Sample B','Sample C','Sample D','Sample E'];
  @Input() chartDataValues: number[] = [45, 60, 38, 50, 70];

  public chartType: ChartConfiguration['type'] = 'bar';
  public chartData: ChartConfiguration['data'] = { labels: this.chartLabels, datasets: [] };
  public chartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: {}, y: { beginAtZero: true } }
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.chartData = {
      labels: this.chartLabels,
      datasets: [
        { data: this.chartDataValues, label: 'Mean Coverage (x)', backgroundColor: '#4caf50' }
      ]
    };
  }
}
