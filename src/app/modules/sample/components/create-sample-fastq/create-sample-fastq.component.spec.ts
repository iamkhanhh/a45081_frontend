import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSampleFastqComponent } from './create-sample-fastq.component';

describe('CreateSampleFastqComponent', () => {
  let component: CreateSampleFastqComponent;
  let fixture: ComponentFixture<CreateSampleFastqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSampleFastqComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateSampleFastqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
