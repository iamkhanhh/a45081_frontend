import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisComponent } from './analysis.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AnalysisRoutingModule } from './analysis-routing.module';
import { DeleteAnalysisComponent } from './components/delete-analysis/delete-analysis.component';
import { AnalysisListComponent } from './analysis-list/analysis-list.component';

@NgModule({
  declarations: [
    AnalysisComponent,
    DeleteAnalysisComponent,
    AnalysisListComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    SharedModule,
    AnalysisRoutingModule,
    NgbDatepickerModule, 
    NgbAlertModule,
    ReactiveFormsModule,
  ]
})
export class AnalysisModule { }
