import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSampleVcfComponent } from './create-sample-vcf.component';

describe('CreateSampleVcfComponent', () => {
  let component: CreateSampleVcfComponent;
  let fixture: ComponentFixture<CreateSampleVcfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSampleVcfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateSampleVcfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
