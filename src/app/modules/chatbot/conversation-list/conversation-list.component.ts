import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatbotService } from '../services/chatbot.service';
import { Conversation } from '../models/chatbot.model';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
})
export class ConversationListComponent implements OnInit {
  @Output() onSelectConversation = new EventEmitter<Conversation>();
  @Output() onNewConversation = new EventEmitter<void>();

  conversations$: Observable<Conversation[]>;
  activeConversation: Conversation | null = null;

  constructor(private chatbotService: ChatbotService) {
    this.conversations$ = this.chatbotService.conversations$;
  }

  ngOnInit(): void {
    this.chatbotService.activeConversation$.subscribe(conv => {
      this.activeConversation = conv;
    });
  }

  deleteConversation(event: Event, id: number): void {
    event.stopPropagation();
    this.chatbotService.deleteConversation(id);
  }
}
