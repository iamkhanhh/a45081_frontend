import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisReportDetailComponent } from './analysis-report-detail.component';

describe('AnalysisReportDetailComponent', () => {
  let component: AnalysisReportDetailComponent;
  let fixture: ComponentFixture<AnalysisReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisReportDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnalysisReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
