import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TopMenu } from '../../components/top-menu/top-menu';
import { OrderService } from '../../services/order';
import { UserService } from '../../services/user';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    TagModule,
    ButtonModule,
    RippleModule,
    TopMenu
  ],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistoryComponent implements OnInit {
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private router = inject(Router);

  orders: Order[] = [];
  loading = false;
  errorMessage = '';
  expandedOrderId: number | null = null;

  ngOnInit() {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/auth']);
      return;
    }
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.errorMessage = '';
    const user = this.userService.getCurrentUser();
    if (user) {
      this.orderService.getUserOrders(user.userId).subscribe({
        next: (orders) => {
          this.orders = orders;
          console.log('Orders from server:', this.orders);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading orders:', err);
          this.errorMessage = 'שגיאה בטעינת ההזמנות';
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch(status) {
      case 'completed': return 'success';
      case 'pending': return 'warn';
      case 'cancelled': return 'danger';
      default: return 'info';
    }
  }

  toggleOrder(orderId: number) {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  isExpanded(orderId: number): boolean {
    return this.expandedOrderId === orderId;
  }
}
