import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotInnerComponent } from './chatbot-inner.component';

describe('ChatbotInnerComponent', () => {
  let component: ChatbotInnerComponent;
  let fixture: ComponentFixture<ChatbotInnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotInnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatbotInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
