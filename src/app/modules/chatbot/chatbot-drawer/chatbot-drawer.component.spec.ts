import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotDrawerComponent } from './chatbot-drawer.component';

describe('ChatbotDrawerComponent', () => {
  let component: ChatbotDrawerComponent;
  let fixture: ComponentFixture<ChatbotDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotDrawerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatbotDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
