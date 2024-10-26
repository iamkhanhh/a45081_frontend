import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceIndexComponent } from './workspace-index.component';

describe('WorkspaceIndexComponent', () => {
  let component: WorkspaceIndexComponent;
  let fixture: ComponentFixture<WorkspaceIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkspaceIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
