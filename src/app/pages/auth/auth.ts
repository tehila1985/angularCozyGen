import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
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
    MessageModule
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
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = 'אימייל או סיסמה שגויים';
      }
    });
  }

  onRegister() {
    this.errorMessage = '';
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
