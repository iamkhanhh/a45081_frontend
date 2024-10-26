import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceListComponent } from './workspace-list.component';

describe('WorkspaceListComponent', () => {
  let component: WorkspaceListComponent;
  let fixture: ComponentFixture<WorkspaceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkspaceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
