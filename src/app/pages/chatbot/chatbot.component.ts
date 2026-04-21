import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ChatbotService } from '../../services/chatbot.service';
import { ChatbotRequest, ChatMessage } from '../../models/chatbot.models';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent {
  private readonly chatbotService = inject(ChatbotService);
  
  readonly isOpen = this.chatbotService.isOpen;
  readonly isLoading = signal(false);
  readonly currentQuestion = this.chatbotService.userTextContext;
  readonly history = signal<ChatMessage[]>([]);
  gapAnalysis = signal<any | null>(null);
  userSkills = signal<any[]>([]);


  toggleChat(): void {
    this.chatbotService.toggleChat();
  
  }

  async sendMessage(): Promise<void> {
    const question = this.currentQuestion().trim();
    const gapAnalysis = this.gapAnalysis();
    const userSkills = this.userSkills();


    if (!question || this.isLoading()) {
      return;
    }

    this.history.update(h => [...h, { role: 'user', content: question }]);
    this.currentQuestion.set('');
    this.isLoading.set(true);

    try {
      const payload: ChatbotRequest = {
        question: question,
        history: this.history().slice(0, -1), // Invia la cronologia esclusa la domanda attuale
        gap_analysis: this.chatbotService.gapAnalysisContext(),
        user_skills: this.chatbotService.userSkillsContext()
      };

      const response = await firstValueFrom(this.chatbotService.sendMessage(payload));
      this.history.update(h => [...h, { role: 'assistant', content: response.answer }]);
      
    } catch (error) {
      console.error('Chatbot API Error:', error);
      this.history.update(h => [...h, { role: 'assistant', content: 'Scusa, si è verificato un errore.' }]);
    } finally {
      this.isLoading.set(false);
    }
  }
}