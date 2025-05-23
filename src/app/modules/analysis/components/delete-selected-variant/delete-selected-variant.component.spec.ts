import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSelectedVariantComponent } from './delete-selected-variant.component';

describe('DeleteSelectedVariantComponent', () => {
  let component: DeleteSelectedVariantComponent;
  let fixture: ComponentFixture<DeleteSelectedVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSelectedVariantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteSelectedVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
