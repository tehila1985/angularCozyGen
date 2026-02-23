import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TopMenu } from '../../components/top-menu/top-menu';
import { UserService } from '../../services/user';
import { UserLogin, UserRegister } from '../../models/user.model';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    TopMenu
  ],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  isLoginMode = true;
  errorMessage = '';
  
  loginData: UserLogin = {
    email: '',
    passwordHash: ''
  };

  registerData: UserRegister = {
    firstName: '',
    lastName: '',
    email: '',
    passwordHash: ''
  };

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onLogin() {
    this.errorMessage = '';
    this.userService.login(this.loginData).subscribe({
      next: () => {
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 100);
      },
      error: (err) => {
        this.errorMessage = 'אימייל או סיסמה שגויים';
      }
    });
  }

  onRegister() {
    this.errorMessage = '';
    
    // בדיקת חוזק סיסמה
    const password = this.registerData.passwordHash;
    if (password.length < 8) {
      this.errorMessage = 'הסיסמה חייבת להכיל לפחות 8 תווים';
      return;
    }
    if (!/[A-Z]/.test(password)) {
      this.errorMessage = 'הסיסמה חייבת להכיל לפחות אות גדולה אחת באנגלית';
      return;
    }
    if (!/[a-z]/.test(password)) {
      this.errorMessage = 'הסיסמה חייבת להכיל לפחות אות קטנה אחת באנגלית';
      return;
    }
    if (!/[0-9]/.test(password)) {
      this.errorMessage = 'הסיסמה חייבת להכיל לפחות ספרה אחת';
      return;
    }
    
    this.userService.register(this.registerData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = 'שגיאה בהרשמה, נסה שוב';
      }
    });
  }
}
