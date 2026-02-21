import { Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatbotService } from '../services/chatbot.service';
import { ChatMessage } from '../models/chatbot.model';

@Component({
  selector: 'app-chatbot-inner',
  templateUrl: './chatbot-inner.component.html',
})
export class ChatbotInnerComponent implements OnInit {
  @Input() isDrawer: boolean = false;
  @HostBinding('class') class = 'card-body';
  @HostBinding('id') get hostId() {
    return this.isDrawer ? 'kt_drawer_chat_messenger_body' : 'kt_chat_messenger_body';
  }
  @ViewChild('messageInput', { static: true })
  messageInput: ElementRef<HTMLTextAreaElement>;
  @ViewChild('messagesContainer')
  messagesContainer: ElementRef<HTMLDivElement>;

  messages$: Observable<ChatMessage[]>;
  isStreaming$: Observable<boolean>;

  constructor(private chatbotService: ChatbotService) {
    this.messages$ = this.chatbotService.messages$;
    this.isStreaming$ = this.chatbotService.isStreaming$;
  }

  ngOnInit(): void {
    // Auto scroll khi messages thay đổi
    this.messages$.subscribe(() => {
      setTimeout(() => this.scrollToBottom(), 50);
    });
  }

  async submitMessage(): Promise<void> {
    const text = this.messageInput.nativeElement.value.trim();
    if (!text) return;

    this.messageInput.nativeElement.value = '';
    await this.chatbotService.sendMessage(text);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submitMessage();
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
