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
  currentPassword = '';

  editData = {
    firstName: '',
    lastName: '',
    email: '',
    passwordHash: '',
    phone: '',
    address: ''
  };

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    console.log('Current user from localStorage:', this.user);
    if (!this.user) {
      this.router.navigate(['/auth']);
      return;
    }

    this.userService.getUserDetails(this.user.userId).subscribe({
      next: (fullUser) => {
        console.log('Full user from server:', fullUser);
        this.currentPassword = fullUser.passwordHash || '';
        this.editData = {
          firstName: fullUser.firstName || this.user!.firstName,
          lastName: fullUser.lastName || this.user!.lastName,
          email: fullUser.email || this.user!.email,
          passwordHash: '',
          phone: fullUser.phone || '',
          address: fullUser.address || ''
        };
        console.log('Edit data loaded:', this.editData);
      },
      error: (err) => {
        console.error('Error loading user details:', err);
        this.editData = {
          firstName: this.user!.firstName,
          lastName: this.user!.lastName,
          email: this.user!.email,
          passwordHash: '',
          phone: '',
          address: ''
        };
      }
    });
  }

  onSave() {
    console.log('onSave called');
    if (!this.user) return;

    const updateData: any = {
      userId: parseInt(this.user.userId),
      email: this.editData.email,
      firstName: this.editData.firstName,
      lastName: this.editData.lastName,
      phone: this.editData.phone || '',
      address: this.editData.address || ''
    };
    

    if (this.editData.passwordHash) {
      updateData.passwordHash = this.editData.passwordHash;
    } else {
      updateData.passwordHash = this.currentPassword;
    }
    
    console.log('Sending update:', updateData);

    this.userService.updateUser(this.user.userId, updateData).subscribe({
      next: (updatedUser) => {
        console.log('Update successful:', updatedUser);
        // שמירת הסיסמה ששלחנו
        if (this.editData.passwordHash) {
          this.currentPassword = this.editData.passwordHash;
        }
        this.user = {
          ...updatedUser,
          phone: this.editData.phone,
          address: this.editData.address
        };
        this.successMessage = 'הפרטים עודכנו בהצלחה';
        this.errorMessage = '';
        this.editData.passwordHash = '';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Update error:', err);
        console.error('Error details:', err.error);
        
        const errorMessage = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
        
        if (errorMessage.includes('UNIQUE KEY') || errorMessage.includes('duplicate')) {
          this.errorMessage = 'האימייל כבר קיים במערכת';
        } else if (err.error?.errors) {
          const errors = Object.values(err.error.errors).flat();
          this.errorMessage = errors.join(', ');
        } else {
          this.errorMessage = 'שגיאה בעדכון הפרטים';
        }
        this.successMessage = '';
      }
    });
  }

  goToOrderHistory() {
    this.router.navigate(['/order-history']);
  }

  onLogout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
