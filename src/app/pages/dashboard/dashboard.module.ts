
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { WidgetsModule } from '../../_metronic/partials/content/widgets/widgets.module';

import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    WidgetsModule,
    TranslateModule
  ],
})
export class DashboardModule {}
