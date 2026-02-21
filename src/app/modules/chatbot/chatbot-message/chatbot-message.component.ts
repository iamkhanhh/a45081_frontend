import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chatbot-message',
  templateUrl: './chatbot-message.component.html',
})
export class ChatbotMessageComponent {
  @Output() onBack = new EventEmitter<void>();
}
