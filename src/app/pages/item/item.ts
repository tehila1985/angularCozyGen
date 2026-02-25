import { Component, inject, OnInit } from '@angular/core';
import { ItemDetail } from "../../components/item-detail/item-detail";
import { Product } from '../../models/product.model';
import { ActivatedRoute } from '@angular/router';
import { TopMenu } from "../../components/top-menu/top-menu";
import { ProductService } from '../../services/product';
import { CategoryService } from '../../services/category';
import { StyleService } from '../../services/style';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

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
  private categoryService = inject(CategoryService);
  private styleService = inject(StyleService);
  selectedProduct: Product | undefined;
  
  private categories: any[] = [];
  private styles: any[] = [];

  ngOnInit() {
    // טעינת קטגוריות וסגנונות
    forkJoin({
      categories: this.categoryService.getCategories(),
      styles: this.styleService.getStyles()
    }).subscribe({
      next: (data) => {
        this.categories = data.categories;
        this.styles = data.styles;
        console.log('Categories:', this.categories);
        console.log('Styles:', this.styles);
        this.loadProduct();
      },
      error: (err) => console.error('Error loading categories/styles:', err)
    });
  }
  
  loadProduct() {
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
        console.log('Product from server:', JSON.stringify(product, null, 2));
        console.log('productStyles:', product.productStyles);
        const baseUrl = environment.apiUrl.replace('/api', '');
        
        // חיפוש שם קטגוריה
        const category = this.categories.find(c => c.categoryId === product.categoryId);
        const categoryName = category?.name || 'ללא קטגוריה';
        
        // חיפוש סגנון - מתוך productStyles אם קיים
        let styleId = 0;
        let styleName = '';
        console.log('Checking productStyles:', product.productStyles);
        if (product.productStyles && product.productStyles.length > 0) {
          console.log('First productStyle:', product.productStyles[0]);
          const firstStyleData = product.productStyles[0];
          const firstStyleId = firstStyleData.styleId || firstStyleData;
          console.log('Looking for styleId:', firstStyleId);
          const style = this.styles.find(s => s.styleId === firstStyleId);
          console.log('Found style:', style);
          if (style) {
            styleId = style.styleId;
            styleName = style.name;
          }
        } else {
          console.log('No productStyles found');
        }
        
        this.selectedProduct = {
          productId: product.productId,
          name: product.name,
          categoryId: product.categoryId,
          categoryName: categoryName,
          styleId: styleId,
          styleName: styleName,
          price: product.price,
          description: product.description,
          stock: product.stock || 0,
          frontImageUrl: product.frontImageUrl?.startsWith('http') ? product.frontImageUrl : `${baseUrl}/${product.frontImageUrl}`,
          backImageUrl: product.backImageUrl?.startsWith('http') ? product.backImageUrl : `${baseUrl}/${product.backImageUrl}`
        };
        console.log('Selected product:', JSON.stringify(this.selectedProduct, null, 2));
      },
      error: (err) => {
        console.error('Error loading product:', err);
      }
    });
  }
}
