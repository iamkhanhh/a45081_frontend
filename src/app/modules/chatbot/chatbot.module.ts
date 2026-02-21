import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ChatbotDrawerComponent } from './chatbot-drawer/chatbot-drawer.component';
import { ChatbotMessageComponent } from './chatbot-message/chatbot-message.component';
import { ConversationListComponent } from './conversation-list/conversation-list.component';
import { ChatbotInnerComponent } from './chatbot-inner/chatbot-inner.component';

@NgModule({
  declarations: [
    ChatbotDrawerComponent,
    ChatbotMessageComponent,
    ConversationListComponent,
    ChatbotInnerComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    InlineSVGModule,
  ],
  exports: [
    ChatbotDrawerComponent,
  ],
})
export class ChatbotModule { }
