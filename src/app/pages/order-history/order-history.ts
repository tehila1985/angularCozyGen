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
import { ProductService } from '../../services/product';
import { Order } from '../../models/order.model';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment.development';

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
  private productService = inject(ProductService);
  private router = inject(Router);

  orders: Order[] = [];
  loading = false;
  errorMessage = '';
  expandedOrderId: number | null = null;
  productImages: { [key: number]: string } = {};

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
          console.log('Orders loaded:', this.orders);
          this.loadProductImages();
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

  loadProductImages() {
    const productIds = [...new Set(
      this.orders.flatMap(o => 
        o.orderItems?.map(i => i.productId).filter(id => id != null) || []
      )
    )] as number[];
    
    console.log('Product IDs to load:', productIds);
    
    if (productIds.length === 0) {
      console.log('No product IDs found');
      return;
    }
    
    const requests = productIds.map(id => this.productService.getProductById(id));
    
    forkJoin(requests).subscribe({
      next: (products) => {
        console.log('Products loaded:', products);
        products.forEach(p => {
          if (p && p.productId && p.frontImageUrl) {
            const baseUrl = environment.apiUrl.replace('/api', '');
            this.productImages[p.productId] = `${baseUrl}/${p.frontImageUrl}`;
            console.log(`Image for product ${p.productId}: ${this.productImages[p.productId]}`);
          }
        });
        console.log('All product images:', this.productImages);
      },
      error: (err) => console.error('Error loading product images:', err)
    });
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
