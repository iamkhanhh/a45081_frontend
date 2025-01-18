import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSampleComponent } from './delete-sample.component';

describe('DeleteSampleComponent', () => {
  let component: DeleteSampleComponent;
  let fixture: ComponentFixture<DeleteSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSampleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
