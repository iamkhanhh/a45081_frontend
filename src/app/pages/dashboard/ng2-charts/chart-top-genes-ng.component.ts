import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
@Component({
  selector: 'app-chart-top-genes-ng',
  templateUrl: './chart-top-genes-ng.component.html'
})
export class ChartTopGenesNgComponent implements OnChanges {
  @Input() labels: string[] = ['BRCA1','TP53','EGFR','APC','KRAS'];
  @Input() values: number[] = [56,42,33,20,18];

  public chartType: ChartConfiguration['type'] = 'bar';
  public chartData: ChartConfiguration['data'] = { labels: this.labels, datasets: [{ data: this.values, backgroundColor: '#3f51b5' }] };

  ngOnChanges(changes: SimpleChanges): void {
    this.chartData = { labels: this.labels, datasets: [{ data: this.values, backgroundColor: '#3f51b5' }] };
  }
}
