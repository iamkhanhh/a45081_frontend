import { Component, OnInit } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service';
import { Conversation } from '../models/chatbot.model';

@Component({
  selector: 'app-chatbot-drawer',
  templateUrl: './chatbot-drawer.component.html',
})
export class ChatbotDrawerComponent implements OnInit {
  showConversationList = true;

  constructor(private chatbotService: ChatbotService) { }

  ngOnInit(): void {
    this.chatbotService.loadConversations();
  }

  onSelectConversation(conversation: Conversation): void {
    this.chatbotService.selectConversation(conversation);
    this.showConversationList = false;
  }

  onNewConversation(): void {
    this.chatbotService.createConversation();
    this.showConversationList = false;
  }

  onBackToList(): void {
    this.showConversationList = true;
  }
}
