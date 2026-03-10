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
    passwordHash: '',
    phone: '',
    address: ''
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
        this.errorMessage = 'Incorrect email or password';
      }
    });
  }

  onRegister() {
    this.errorMessage = '';
    
    // Basic password validation
    const password = this.registerData.passwordHash;
    if (password.length < 8) {
      this.errorMessage = 'Password must contain at least 8 characters';
      return;
    }
    if (!/[A-Z]/.test(password)) {
      this.errorMessage = 'Password must contain at least one uppercase English letter';
      return;
    }
    if (!/[a-z]/.test(password)) {
      this.errorMessage = 'Password must contain at least one lowercase English letter';
      return;
    }
    if (!/[0-9]/.test(password)) {
      this.errorMessage = 'Password must contain at least one digit';
      return;
    }
    
    this.userService.register(this.registerData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.error?.includes('UNIQUE KEY') || err.error?.includes('duplicate')) {
          this.errorMessage = 'Email already exists in the system';
        } else {
          this.errorMessage = 'Registration error, please try again';
        }
      }
    });
  }
}
