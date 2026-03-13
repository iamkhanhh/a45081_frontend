import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { NgChartsModule } from 'ng2-charts';
import { ChartCoverageNgComponent } from './ng2-charts/chart-coverage-ng.component';
import { ChartVariantCountsNgComponent } from './ng2-charts/chart-variant-counts-ng.component';
import { ChartTopGenesNgComponent } from './ng2-charts/chart-top-genes-ng.component';
import { ChartChromosomeNgComponent } from './ng2-charts/chart-chromosome-ng.component';

@NgModule({
  declarations: [DashboardComponent, ChartCoverageNgComponent, ChartVariantCountsNgComponent, ChartTopGenesNgComponent, ChartChromosomeNgComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule
    ,NgChartsModule
  ],
})
export class DashboardModule {}
