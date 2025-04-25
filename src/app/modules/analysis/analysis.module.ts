import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisComponent } from './analysis.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AnalysisRoutingModule } from './analysis-routing.module';
import { AnalysisListComponent } from './analysis-list/analysis-list.component';
import { WorkspaceModule } from '../workspace/workspace.module';
import { AnalysisIndexComponent } from './analysis-index/analysis-index.component';
import { VariantListComponent } from './components/variant-list/variant-list.component';
import { AnalysisReportVariantComponent } from './components/analysis-report-variant/analysis-report-variant.component';

@NgModule({
  declarations: [
    AnalysisComponent,
    AnalysisIndexComponent,
    AnalysisListComponent,
    VariantListComponent,
    AnalysisReportVariantComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    SharedModule,
    AnalysisRoutingModule,
    NgbDatepickerModule, 
    NgbAlertModule,
    ReactiveFormsModule,
    WorkspaceModule
  ]
})
export class AnalysisModule { }
