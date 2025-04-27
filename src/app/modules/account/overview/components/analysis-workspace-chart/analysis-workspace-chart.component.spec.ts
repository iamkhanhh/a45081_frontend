import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisWorkspaceChartComponent } from './analysis-workspace-chart.component';

describe('AnalysisWorkspaceChartComponent', () => {
  let component: AnalysisWorkspaceChartComponent;
  let fixture: ComponentFixture<AnalysisWorkspaceChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisWorkspaceChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnalysisWorkspaceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
