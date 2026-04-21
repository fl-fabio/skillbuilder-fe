export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatbotRequest {
  question: string;
  history: ChatMessage[];
  gap_analysis: any | null;
  user_skills: any[];
}

export interface ChatbotResponse {
  answer: string; // Nota: Modifica 'answer' col nome esatto restituito dal tuo backend se differisce (es. 'text', 'response')
}