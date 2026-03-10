import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopMenu } from '../../components/top-menu/top-menu';
import { EmailService, ContactForm } from '../../services/email';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TopMenu],
  template: `
    <app-top-menu></app-top-menu>
    <section class="contact-section">
      <div class="contact-container">
        <div class="contact-header">
          <span class="category-label">GET IN TOUCH</span>
          <h2 class="contact-title">Contact Us</h2>
          <p class="contact-subtitle">We'd love to hear from you</p>
        </div>
        
        <div class="contact-content">
          <div class="contact-form">
            <div *ngIf="successMessage" class="success-message">
              <i class="pi pi-check-circle"></i>
              <p>{{ successMessage }}</p>
            </div>
            <div *ngIf="errorMessage" class="error-message">
              <i class="pi pi-times-circle"></i>
              <p>{{ errorMessage }}</p>
            </div>
            
            <form (ngSubmit)="onSubmit()" *ngIf="!successMessage">
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" [(ngModel)]="formData.name" name="name" required>
              </div>
              
              <div class="form-group">
                <label>Email</label>
                <input type="email" [(ngModel)]="formData.email" name="email" required>
              </div>
              
              <div class="form-group">
                <label>Phone</label>
                <input type="tel" [(ngModel)]="formData.phone" name="phone">
              </div>
              
              <div class="form-group">
                <label>Message</label>
                <textarea [(ngModel)]="formData.message" name="message" rows="6" required></textarea>
              </div>
              
              <button type="submit" class="submit-btn">Send Message</button>
            </form>
          </div>
          
          <div class="contact-info">
            <div class="info-item">
              <i class="pi pi-map-marker"></i>
              <div>
                <h4>Address</h4>
                <p>123 Example Street, Tel Aviv</p>
              </div>
            </div>
            
            <div class="info-item">
              <i class="pi pi-phone"></i>
              <div>
                <h4>Phone</h4>
                <p>03-1234567</p>
              </div>
            </div>
            
            <div class="info-item">
              <i class="pi pi-envelope"></i>
              <div>
                <h4>Email</h4>
                <p>info@cozygen.com</p>
              </div>
            </div>
            
            <div class="info-item">
              <i class="pi pi-clock"></i>
              <div>
                <h4>Business Hours</h4>
                <p>Sunday - Thursday: 9:00 - 18:00</p>
                <p>Friday: 9:00 - 14:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-section { padding: 80px 40px; background: #f5f5f5; direction: ltr; font-family: 'Noto Sans Hebrew', sans-serif; min-height: calc(100vh - 200px); }
    .contact-container { max-width: 1200px; margin: 0 auto; }
    .contact-header { text-align: center; margin-bottom: 60px; }
    .category-label { font-size: 12px; letter-spacing: 2px; color: #929292; font-weight: 700; display: block; margin-bottom: 16px; text-transform: uppercase; }
    .contact-title { font-size: 48px; font-weight: 700; color: #111; margin: 0; }
    .contact-subtitle { font-size: 18px; color: #484848; margin-top: 16px; }
    .contact-content { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; background: #fff; padding: 60px; }
    .form-group { margin-bottom: 24px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 700; color: #111; font-size: 14px; }
    .form-group input, .form-group textarea { width: 100%; padding: 12px; border: 2px solid #dfdfdf; border-radius: 4px; font-size: 16px; font-family: 'Noto Sans Hebrew', sans-serif; outline: none; transition: border-color 0.2s; }
    .form-group input:focus, .form-group textarea:focus { border-color: #008B8B; }
    .submit-btn { width: 100%; background: #008B8B; color: #fff; border: none; padding: 16px; font-size: 16px; font-weight: 700; border-radius: 50px; cursor: pointer; transition: background 0.2s; }
    .submit-btn:hover { background: #006666; }
    .success-message { background: #d4edda; border: 2px solid #28a745; padding: 20px; border-radius: 8px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; color: #155724; }
    .success-message i { font-size: 24px; }
    .success-message p { margin: 0; font-weight: 600; }
    .error-message { background: #f8d7da; border: 2px solid #dc3545; padding: 20px; border-radius: 8px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; color: #721c24; }
    .error-message i { font-size: 24px; }
    .error-message p { margin: 0; font-weight: 600; }
    .contact-info { display: flex; flex-direction: column; gap: 32px; }
    .info-item { display: flex; gap: 20px; align-items: flex-start; }
    .info-item i { font-size: 24px; color: #008B8B; margin-top: 4px; }
    .info-item h4 { font-size: 18px; font-weight: 700; color: #111; margin: 0 0 8px 0; }
    .info-item p { font-size: 14px; color: #484848; margin: 0; line-height: 1.6; }
    @media (max-width: 768px) {
      .contact-content { grid-template-columns: 1fr; padding: 40px 20px; }
      .contact-title { font-size: 32px; }
    }
  `]
})
export class ContactComponent {
  private emailService = inject(EmailService);
  
  formData: ContactForm = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  onSubmit() {
    if (!this.formData.name || !this.formData.email || !this.formData.message) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.emailService.sendContactEmail(this.formData).then(
      () => {
        this.successMessage = 'Thank you! Your message has been received successfully. We will contact you soon.';
        this.formData = { name: '', email: '', phone: '', message: '' };
        this.isSubmitting = false;
      }
    ).catch(() => {
      this.errorMessage = 'Oops, there was an error. Please try again later.';
      this.isSubmitting = false;
    });
  }
}
