import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-showproducts',
  standalone: true,
  imports: [CommonModule],
  template: `
  <section class="products-section">
    <div class="header-container">
      <span class="category-label">PREMIUM CURATION</span>
      <h3 class="style-heading">מבחר מוצרים</h3>
      <p class="style-subtext">גלו את השפה העיצובית שמתאימה לבית שלכם</p>
    </div>

    <div class="products-grid">
      <div *ngFor="let product of rooms; let i = index" 
           class="product-card" 
           [class.appear]="isLoaded" 
           [style.transition-delay]="(i*50)+'ms'">
        <div class="image-wrapper">
          <img class="front" [src]="product.frontImageUrl" [alt]="product.title" (error)="handleImageError($event)">
          <img class="back" [src]="product.backImageUrl" [alt]="product.title" (error)="handleImageError($event)">
        </div>
        <div class="info">
          <h4 class="product-title">{{ product.title }}</h4>
          <p class="product-desc">{{ product.description }}</p>
          <p class="product-price">{{ product.price | currency:'ILS':'symbol':'1.0-0' }}</p>
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .products-section { 
      padding: 0 0 40px 0; /* ביטול פדינג צידי כי הוא בתוך ה-main-content */
      direction: rtl; 
      font-family: 'Inter', sans-serif; 
    }
    .header-container { text-align: right; margin-bottom: 40px; }
    .category-label { font-size: 0.8rem; letter-spacing: 2px; color: #aaa; display: block; }
    .style-heading { font-size: 2.2rem; font-weight: 500; color: #111; margin: 5px 0; }
    .style-subtext { font-size: 1rem; color: #666; font-weight: 300; }

    .products-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
      gap: 25px; 
    }

    .product-card { 
      background: #fff; 
      opacity: 0; 
      transform: translateY(20px); 
      transition: all 0.5s ease; 
    }
    .product-card.appear { opacity: 1; transform: translateY(0); }

    .image-wrapper { 
      width: 100%; 
      padding-top: 110%; /* מעט גבוה מריבוע למראה אלגנטי */
      position: relative; 
      overflow: hidden; 
      background: #f5f5f5;
    }
    .image-wrapper img { 
      position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
      object-fit: cover; transition: 0.5s ease; 
    }
    .image-wrapper img.back { opacity: 0; }
    .product-card:hover .image-wrapper img.back { opacity: 1; }
    .product-card:hover .image-wrapper img.front { opacity: 0; }

    .info { padding: 15px 5px; }
    .product-title { font-size: 1.1rem; font-weight: 600; margin: 0; color: #222; }
    .product-desc { font-size: 0.85rem; color: #777; margin: 4px 0; line-height: 1.4; }
    .product-price { font-size: 1.1rem; font-weight: 700; color: #b1935b; margin-top: 8px; }

    @media (max-width: 768px) {
      .header-container { text-align: center; }
      .style-heading { font-size: 1.8rem; }
    }
  `]
})
export class Showproducts implements OnInit, OnChanges {
  @Input() categoryIds: number[] = [];
  @Input() position = 0;
  @Input() skip = 40;
  @Input() desc = '';
  @Input() minPrice = 0;
  @Input() maxPrice = 999999;
  @Input() styleIds: number[] = [];

  isLoaded = false;
  rooms: any[] = [];
  private http = inject(HttpClient);

  ngOnInit() { this.fetchProducts(); }
  ngOnChanges() { this.fetchProducts(); }

  fetchProducts() {
    const baseUrl = environment.apiUrl.replace('/api', '');
    let params = new HttpParams()
      .set('position', this.position.toString())
      .set('skip', this.skip.toString())
      .set('desc', this.desc)
      .set('minPrice', this.minPrice.toString())
      .set('maxPrice', this.maxPrice.toString());

    if (this.categoryIds?.length) params = params.set('categoryIds', this.categoryIds.join(','));
    if (this.styleIds?.length) params = params.set('styleIds', this.styleIds.join(','));

    this.http.get<any>(`${environment.apiUrl}/Product`, { params }).subscribe({
      next: (data) => {
        const products = data?.products ?? data ?? [];
        this.rooms = products.map((s: Product) => ({
          id: s.productId,
          title: (s.name || '').replace(/_/g, ' '),
          description: s.description || 'פריט מעוצב מבית פרימיום',
          price: s.price || 0,
          frontImageUrl: s.frontImageUrl?.startsWith('http') ? s.frontImageUrl : `${baseUrl}/${s.frontImageUrl || ''}`,
          backImageUrl: s.backImageUrl?.startsWith('http') ? s.backImageUrl : `${baseUrl}/${s.backImageUrl || ''}`
        }));
        this.isLoaded = false;
        setTimeout(() => this.isLoaded = true, 50);
      }
    });
  }

  handleImageError(e: any) {
    e.target.src = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000';
  }
}