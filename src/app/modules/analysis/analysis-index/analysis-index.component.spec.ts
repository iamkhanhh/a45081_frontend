import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisIndexComponent } from './analysis-index.component';

describe('AnalysisIndexComponent', () => {
  let component: AnalysisIndexComponent;
  let fixture: ComponentFixture<AnalysisIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnalysisIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
