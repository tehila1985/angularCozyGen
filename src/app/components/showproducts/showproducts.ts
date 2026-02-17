import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-showproducts',
  standalone: true,
  imports: [CommonModule],
  template: `
  <section class="selection-section">
    <div class="header-container">
      <span class="category-label">PREMIUM CURATION</span>
      <h3 class="style-heading">מבחר מוצרים</h3>
      <p class="style-subtext">גלו את השפה העיצובית שמתאימה לבית שלכם</p>
    </div>

    <div class="products-grid">
      <div *ngFor="let product of rooms; let i = index" 
           class="product-card" 
           [class.appear]="isLoaded" 
           [style.transition-delay]="(i*100)+'ms'">
        <div class="image-wrapper">
          <img class="front" [src]="product.frontImageUrl" [alt]="product.title" (error)="handleImageError($event)">
          <img class="back" [src]="product.backImageUrl" [alt]="product.title" (error)="handleImageError($event)">
        </div>
        <div class="info">
          <h4 class="product-title">{{ product.title }}</h4>
          <p class="product-desc">{{ product.description }}</p>
          <p class="product-price">{{ product.price | currency:'ILS':'symbol' }}</p>
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [`
    /* רקע נקי ומרווח */
    .selection-section { 
      padding: 100px 6%; 
      background: #f9f9f9; 
      direction: rtl; 
      font-family: 'Inter', system-ui, sans-serif; 
    }

    .header-container { 
      text-align: center; 
      margin-bottom: 80px; 
    }

    .category-label { 
      font-size: 0.9rem; 
      letter-spacing: 4px; 
      color: #888; 
      font-weight: 500; 
      display: block; 
      margin-bottom: 10px; 
    }

    .style-heading { 
      font-size: 2.8rem; 
      font-weight: 500; 
      color: #111; 
      margin: 0; 
    }

    .style-subtext { 
      font-size: 1.1rem; 
      color: #555; 
      margin-top: 6px; 
      font-weight: 300; 
    }

    /* גריד רחב ורספונסיבי */
    .products-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
      gap: 36px; 
      max-width: 1800px; 
      margin: 0 auto; 
    }

    /* כרטיס מוצר ריבועי, ללא עיגולים וללא צל */
    .product-card { 
      background: #fff; 
      border-radius: 0; 
      overflow: hidden; 
      cursor: pointer; 
      opacity: 0; 
      transform: translateY(30px); 
      transition: all 0.6s cubic-bezier(0.2,1,0.3,1); 
      display: flex; 
      flex-direction: column; 
    }

    .product-card.appear { opacity: 1; transform: translateY(0); }

    .image-wrapper { 
      width: 100%; 
      padding-top: 100%; /* ריבוע מדויק */ 
      position: relative; 
      overflow: hidden; 
    }

    .image-wrapper img { 
      position: absolute; 
      top: 0; 
      left: 0; 
      width: 100%; 
      height: 100%; 
      object-fit: cover; 
      transition: opacity 0.7s ease, transform 0.7s ease; 
    }

    .image-wrapper img.back { opacity: 0; }
    .product-card:hover .image-wrapper img.front { opacity: 0; }
    .product-card:hover .image-wrapper img.back { opacity: 1; }

    .info { 
      padding: 14px; 
      display: flex; 
      flex-direction: column; 
      gap: 6px; 
    }

    .product-title { 
      font-size: 1.2rem; 
      font-weight: 600; 
      color: #111; 
      margin: 0; 
    }

    .product-desc { 
      font-size: 0.95rem; 
      color: #555; 
      margin: 0; 
      min-height: 2.4em; 
    }

    .product-price { 
      font-size: 1.1rem; 
      font-weight: 700; 
      color: #f0c000; /* צהוב מינימליסטי */ 
      margin-top: 4px; 
      direction: ltr; 
    }

    @media (max-width: 1024px) { 
      .products-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
      .style-heading { font-size: 2.5rem; }
    }

    @media (max-width: 768px) { 
      .style-heading { font-size: 2rem; } 
      .product-title { font-size: 1.05rem; } 
      .product-desc { font-size: 0.85rem; } 
      .product-price { font-size: 1rem; } 
      .products-grid { grid-template-columns: 1fr; gap: 24px; }
    }
  `]
})
export class Showproducts implements OnInit {
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

  fetchProducts() {
    const baseUrl = environment.apiUrl.replace('/api', '');
    let params = new HttpParams()
      .set('position', this.position)
      .set('skip', this.skip)
      .set('desc', this.desc)
      .set('minPrice', this.minPrice)
      .set('maxPrice', this.maxPrice);

    if (this.categoryIds.length) params = params.set('categoryIds', this.categoryIds.join(','));
    if (this.styleIds.length) params = params.set('styleIds', this.styleIds.join(','));

    this.http.get<any>(`${environment.apiUrl}/Product`, { params }).subscribe({
      next: (data) => {
        const products = data?.products ?? [];
        this.rooms = products.map((s: Product) => ({
          id: s.productId,
          title: (s.name || '').replace(/_/g, ' '),
          description: s.description || 'פריט מעוצב',
          price: s.price || 0,
          frontImageUrl: s.frontImageUrl?.startsWith('http') ? s.frontImageUrl : `${baseUrl}/${s.frontImageUrl || ''}`,
          backImageUrl: s.backImageUrl?.startsWith('http') ? s.backImageUrl : `${baseUrl}/${s.backImageUrl || ''}`
        }));
        setTimeout(() => this.isLoaded = true, 120);
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  handleImageError(e: any) {
    e.target.src = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000';
  }
}
