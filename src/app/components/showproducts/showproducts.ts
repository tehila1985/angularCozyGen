import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product.model';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-showproducts',
  standalone: true,
  imports: [CommonModule],
  template: `
  <section class="ikea-container">
    <div class="results-header">
      <span class="items-count">{{ totalItems }} מוצרים נמצאו</span>
    </div>

    <div class="products-grid" *ngIf="rooms.length > 0; else noProducts">
      <div *ngFor="let product of rooms" class="product-card">
        <div class="image-wrapper">
          <img class="image-front" [src]="product.frontImageUrl" (error)="handleImageError($event)">
          <img class="image-back" [src]="product.backImageUrl" (error)="handleImageError($event)">
        </div>
        <div class="product-info">
          <h4 class="product-name">{{ product.title }}</h4>
          <p class="product-desc">{{ product.description }}</p>
          <div class="price-container">
            <span class="currency">₪</span>
            <span class="price-value">{{ product.price }}</span>
          </div>
        </div>
      </div>
    </div>

    <ng-template #noProducts>
      <div class="no-results">
        <p>לא נמצאו מוצרים התואמים את החיפוש בעמוד זה.</p>
      </div>
    </ng-template>

    <div class="pagination-container" *ngIf="totalPages > 1">
      <button [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)" class="page-btn">הקודם</button>
      
      <div class="pages-list">
        <button *ngFor="let p of pagesArray" 
                [class.active]="currentPage === p"
                (click)="changePage(p)"
                class="page-num">
          {{ p }}
        </button>
      </div>

      <button [disabled]="currentPage === totalPages" (click)="changePage(currentPage + 1)" class="page-btn">הבא</button>
    </div>
  </section>
  `,
  styles: [`
    .ikea-container { direction: rtl; font-family: sans-serif; padding: 20px; }
    .results-header { margin-bottom: 25px; border-bottom: 1px solid #e5e5e5; padding-bottom: 10px; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 40px 20px; }
    .image-wrapper { position: relative; aspect-ratio: 1/1; overflow: hidden; background: #f5f5f5; }
    .image-wrapper img { position: absolute; width: 100%; height: 100%; object-fit: contain; transition: opacity 0.4s; }
    .image-back { opacity: 0; }
    .product-card:hover .image-back { opacity: 1; }
    .product-card:hover .image-front { opacity: 0; }
    .product-name { font-size: 1rem; font-weight: 700; margin: 10px 0 5px 0; }
    .price-value { font-size: 1.6rem; font-weight: 700; }
    .no-results { text-align: center; padding: 100px; color: #767676; }
    .pagination-container { display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 60px; }
    .pages-list { display: flex; gap: 8px; }
    .page-btn { background: #111; color: #fff; border: none; padding: 10px 20px; border-radius: 50px; cursor: pointer; }
    .page-btn:disabled { background: #eee; color: #999; cursor: not-allowed; }
    .page-num { border: 1px solid #dfdfdf; background: #fff; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; }
    .page-num.active { background: #0058a3; color: #fff; border-color: #0058a3; }
  `]
})
export class Showproducts implements OnInit, OnChanges {
  @Input() categoryIds: number[] = [];
  @Input() styleIds: number[] = [];
  @Input() desc = '';
  @Input() minPrice = 0;
  @Input() maxPrice = 999999;

  rooms: any[] = [];
  totalItems = 0;
  pageSize = 12; // כמות קבועה לכל עמוד
  currentPage = 1;
  totalPages = 0;
  pagesArray: number[] = [];

  private productService = inject(ProductService);

  ngOnInit() { this.fetchProducts(); }

  ngOnChanges(changes: SimpleChanges) {
    // אם אחד הפילטרים השתנה (חוץ מהעמוד), נתחיל מהתחלה
    const keys = Object.keys(changes);
    if (keys.some(k => k !== 'position' && !changes[k].firstChange)) {
       // כאן אנחנו לא מאפסים את currentPage כי ה-Parent מנהל אותו או שאנחנו מנהלים פנימית
    }
    this.fetchProducts();
  }

  fetchProducts() {
    const filters = {
      categoryIds: this.categoryIds,
      styleIds: this.styleIds,
      desc: '', 
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      position: this.currentPage, // שליחת המיקום המדויק (0, 12, 24...)
      skip: this.pageSize      // תמיד להביא 12
    };

    this.productService.getProducts(filters).subscribe({
      next: (res) => {
        const productsFromServer = res.products || [];
        this.totalItems = res.totalCount || 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.generatePagesArray();

        const baseUrl = environment.apiUrl.replace('/api', '');
        const mapped = productsFromServer.map((s: any) => ({
          id: s.productId,
          title: (s.name || '').replace(/_/g, ' '),
          description: s.description,
          price: s.price,
          frontImageUrl: s.frontImageUrl?.startsWith('http') ? s.frontImageUrl : `${baseUrl}/${s.frontImageUrl}`,
          backImageUrl: s.backImageUrl?.startsWith('http') ? s.backImageUrl : `${baseUrl}/${s.backImageUrl}`
        }));

        // סינון מקומי לפי שם (זה עדיין כאן כי אמרת שהשרת לא תומך בטקסט)
        if (this.desc && this.desc.trim() !== '') {
          const s = this.desc.toLowerCase();
          this.rooms = mapped.filter((p: any) => p.title.toLowerCase().includes(s));
        } else {
          this.rooms = mapped;
        }
      },
      error: (err) => console.error(err)
    });
  }

  generatePagesArray() {
    this.pagesArray = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pagesArray.push(i);
    }
  }

  changePage(p: number) {
    this.currentPage = p;
    this.fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleImageError(e: any) {
    e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000';
  }
}