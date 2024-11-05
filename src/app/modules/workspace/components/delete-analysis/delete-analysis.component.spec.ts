import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAnalysisComponent } from './delete-analysis.component';

describe('DeleteAnalysisComponent', () => {
  let component: DeleteAnalysisComponent;
  let fixture: ComponentFixture<DeleteAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAnalysisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
