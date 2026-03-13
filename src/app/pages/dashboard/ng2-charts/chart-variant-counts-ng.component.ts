import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
@Component({
  selector: 'app-chart-variant-counts-ng',
  templateUrl: './chart-variant-counts-ng.component.html'
})
export class ChartVariantCountsNgComponent implements OnChanges {
  @Input() labels: string[] = ['SNPs','Insertions','Deletions'];
  @Input() values: number[] = [200000,200000,150000];

  public chartType: ChartConfiguration['type'] = 'pie';
  public chartData: ChartConfiguration['data'] = { labels: this.labels, datasets: [{ data: this.values, backgroundColor: ['#4caf50','#ff9800','#f44336'] }] };

  ngOnChanges(changes: SimpleChanges): void {
    this.chartData = { labels: this.labels, datasets: [{ data: this.values, backgroundColor: ['#4caf50','#ff9800','#f44336'] }] };
  }
}
