import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMultipleUserComponent } from './delete-multiple-user.component';

describe('DeleteMultipleUserComponent', () => {
  let component: DeleteMultipleUserComponent;
  let fixture: ComponentFixture<DeleteMultipleUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMultipleUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteMultipleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
