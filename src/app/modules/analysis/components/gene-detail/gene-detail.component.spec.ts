import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneDetailComponent } from './gene-detail.component';

describe('GeneDetailComponent', () => {
  let component: GeneDetailComponent;
  let fixture: ComponentFixture<GeneDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
