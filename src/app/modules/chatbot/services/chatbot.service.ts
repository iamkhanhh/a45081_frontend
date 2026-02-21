import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Conversation, ChatMessage } from '../models/chatbot.model';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = `${environment.apiUrl}/chatbot`;

  // State
  conversations$ = new BehaviorSubject<Conversation[]>([]);
  activeConversation$ = new BehaviorSubject<Conversation | null>(null);
  messages$ = new BehaviorSubject<ChatMessage[]>([]);
  isStreaming$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  loadConversations(): void {
    this.http.get<any>(`${this.apiUrl}/conversations`, { withCredentials: true })
      .subscribe(res => {
        this.conversations$.next(res.data || []);
      });
  }

  createConversation(): void {
    this.http.post<any>(`${this.apiUrl}/conversations`, {}, { withCredentials: true })
      .subscribe(res => {
        const conversation = res.data as Conversation;
        const conversations = [conversation, ...this.conversations$.value];
        this.conversations$.next(conversations);
        this.selectConversation(conversation);
      });
  }

  deleteConversation(id: number): void {
    this.http.delete<any>(`${this.apiUrl}/conversations/${id}`, { withCredentials: true })
      .subscribe(() => {
        const conversations = this.conversations$.value.filter(c => c.id !== id);
        this.conversations$.next(conversations);

        if (this.activeConversation$.value?.id === id) {
          this.activeConversation$.next(null);
          this.messages$.next([]);
        }
      });
  }

  selectConversation(conversation: Conversation): void {
    this.activeConversation$.next(conversation);
    this.loadMessages(conversation.id);
  }

  loadMessages(conversationId: number): void {
    this.http.get<any>(`${this.apiUrl}/conversations/${conversationId}/messages`, { withCredentials: true })
      .subscribe(res => {
        this.messages$.next(res.data || []);
      });
  }

  async sendMessage(content: string): Promise<void> {
    const conversation = this.activeConversation$.value;
    if (!conversation || this.isStreaming$.value) return;

    const userMessage: ChatMessage = {
      conversationId: conversation.id,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    this.messages$.next([...this.messages$.value, userMessage]);

    const aiMessage: ChatMessage = {
      conversationId: conversation.id,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
    };
    this.messages$.next([...this.messages$.value, aiMessage]);

    this.isStreaming$.next(true);

    try {
      const res = await this.http.post<any>(
        `${this.apiUrl}/conversations/${conversation.id}/messages`,
        { content },
        { withCredentials: true }
      ).toPromise();

      const messageId = res.data.messageId;

      await this.streamResponse(conversation.id, messageId);

      if (conversation.title === 'New conversation') {
        this.loadConversations();
      }
    } catch (error) {
      const messages = [...this.messages$.value];
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant') {
        lastMsg.content = 'Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại.';
      }
      this.messages$.next(messages);
    } finally {
      this.isStreaming$.next(false);
    }
  }

  private streamResponse(conversationId: number, messageId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = `${this.apiUrl}/conversations/${conversationId}/messages/${messageId}/stream`;
      const eventSource = new EventSource(url, { withCredentials: true });

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.done) {
          eventSource.close();
          resolve();
          return;
        }

        if (data.error) {
          eventSource.close();
          reject(new Error(data.error));
          return;
        }

        if (data.content) {
          const messages = [...this.messages$.value];
          const lastMsg = messages[messages.length - 1];
          if (lastMsg.role === 'assistant') {
            lastMsg.content += data.content;
          }
          this.messages$.next(messages);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        reject(new Error('SSE connection failed'));
      };
    });
  }
}
