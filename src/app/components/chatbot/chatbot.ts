import { Component, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class ChatbotComponent implements AfterViewChecked {
  isOpen = signal(false);
  messages = signal<Message[]>([
    { text: 'Hi! 👋 I\'m here to help you. How can I assist you?', isUser: false, timestamp: new Date() }
  ]);
  userInput = signal('');
  isLoading = signal(false);
  @ViewChild('messagesContainer') private messagesContainer?: ElementRef;
  private shouldScroll = false;

  constructor(private http: HttpClient) {}

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }
  }

  toggleChat() {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  async sendMessage() {
    const message = this.userInput().trim();
    if (!message || this.isLoading()) return;

    this.messages.update(msgs => [...msgs, { 
      text: message, 
      isUser: true, 
      timestamp: new Date() 
    }]);
    this.userInput.set('');
    this.isLoading.set(true);
    this.shouldScroll = true;

    try {
      const response = await this.http.post<{ response: string, category: string }>(
        'https://localhost:44308/api/Ai/chat',
        { message },
        { 
          headers: { 'Content-Type': 'application/json' }
        }
      ).toPromise();

      this.messages.update(msgs => [...msgs, { 
        text: response?.response || 'Sorry, I couldn\'t get a response', 
        isUser: false, 
        timestamp: new Date() 
      }]);
      this.shouldScroll = true;
    } catch (error: any) {
      console.error('Chatbot error:', error);
      let errorMsg = 'Oops! Something went wrong. ';
      
      if (error.status === 0) {
        errorMsg += 'Could not connect to server. Make sure the AI server is running and CORS is configured correctly.';
      } else if (error.status === 404) {
        errorMsg += 'Address not found. Check that the API is available at /api/Ai/chat';
      } else {
        errorMsg += 'Please try again in a moment 🙏';
      }
      
      this.messages.update(msgs => [...msgs, { 
        text: errorMsg, 
        isUser: false, 
        timestamp: new Date() 
      }]);
      this.shouldScroll = true;
    } finally {
      this.isLoading.set(false);
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}