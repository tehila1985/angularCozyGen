import { Component, inject, OnInit } from '@angular/core';
import { ItemDetail } from "../../components/item-detail/item-detail";
import { Product } from '../../models/product.model';
import { ActivatedRoute } from '@angular/router';
import { TopMenu } from "../../components/top-menu/top-menu";
import { ProductService } from '../../services/product';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [ItemDetail, TopMenu, CommonModule],
  templateUrl: './item.html',
  styleUrl: './item.css',
})
export class Item implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  selectedProduct: Product | undefined;

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const productData = params.get('product');
      
      if (productData) {
        try {
          const product = JSON.parse(productData);
          const productId = product.productId || product.id;
          
          if (productId) {
            this.loadProductWithStock(productId);
          } else {
            this.selectedProduct = product;
          }
        } catch (e) {
          console.error("שגיאה בפענוח נתוני המוצר", e);
        }
      }
    });
  }

  loadProductWithStock(productId: number) {
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        const baseUrl = environment.apiUrl.replace('/api', '');
        this.selectedProduct = {
          productId: product.productId,
          name: product.name,
          categoryId: product.categoryId,
          categoryName: product.categoryName,
          price: product.price,
          description: product.description,
          stock: product.stock || 0,
          frontImageUrl: product.frontImageUrl?.startsWith('http') ? product.frontImageUrl : `${baseUrl}/${product.frontImageUrl}`,
          backImageUrl: product.backImageUrl?.startsWith('http') ? product.backImageUrl : `${baseUrl}/${product.backImageUrl}`
        };
      },
      error: (err) => {
        console.error('Error loading product:', err);
      }
    });
  }
}
