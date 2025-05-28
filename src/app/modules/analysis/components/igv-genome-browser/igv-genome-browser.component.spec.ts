import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IgvGenomeBrowserComponent } from './igv-genome-browser.component';

describe('IgvGenomeBrowserComponent', () => {
  let component: IgvGenomeBrowserComponent;
  let fixture: ComponentFixture<IgvGenomeBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IgvGenomeBrowserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IgvGenomeBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
