import { Injectable } from '@angular/core';

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  async sendContactEmail(formData: ContactForm): Promise<any> {
    // Log to console (for now, until EmailJS is configured)
    console.log('📧 Email would be sent to: rivka7905@gmail.com');
    console.log('📧 Customer confirmation would be sent to:', formData.email);
    console.log('📋 Contact Form Data:', formData);
    
    // Simulate successful email sending
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }
}

/* 
TO ENABLE REAL EMAIL SENDING:
1. Install: npm install @emailjs/browser --legacy-peer-deps
2. Sign up at https://www.emailjs.com/
3. Create email service and templates
4. Replace this file with the EmailJS version from EMAILJS_SETUP_GUIDE.md
*/
