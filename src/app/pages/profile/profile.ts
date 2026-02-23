import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TopMenu } from '../../components/top-menu/top-menu';
import { UserService } from '../../services/user';
import { UserResponse } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    TopMenu
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  user: UserResponse | null = null;
  successMessage = '';
  errorMessage = '';
  showPersonalDetails = true;

  editData = {
    firstName: '',
    lastName: '',
    email: ''
  };

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/auth']);
      return;
    }
    this.editData = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email
    };
  }

  onSave() {
    this.successMessage = 'הפרטים עודכנו בהצלחה';
    this.errorMessage = '';
    setTimeout(() => this.successMessage = '', 3000);
  }

  goToOrderHistory() {
    this.router.navigate(['/order-history']);
  }

  onLogout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
