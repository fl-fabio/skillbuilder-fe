import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ChatbotRequest, ChatbotResponse } from '../models/chatbot.models';


@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  isOpen = signal(false);
  gapAnalysisContext = signal<any | null>(null);
  userSkillsContext = signal<any[]>([]);
  userTextContext = signal<string>('');

  constructor() { }


  toggleChat(): void {
    this.isOpen.update(v => !v);
  }

  openChatWithContext(analysis: any): void {
    console.log(analysis);
    this.gapAnalysisContext.set(analysis);
    this.userSkillsContext.set(analysis.skills);
    this.userTextContext.set('Dimmi di più sui risultati ottenuti');
    this.isOpen.set(true); 
  }

  sendMessage(payload: ChatbotRequest): Observable<ChatbotResponse> {
    const requestUrl = `${this.apiBaseUrl}/rag/chat`;
    return this.http.post<ChatbotResponse>(requestUrl, payload);
  }

  
}