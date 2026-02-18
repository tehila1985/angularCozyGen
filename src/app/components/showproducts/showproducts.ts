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
  <section class="ikea-products">
    <div class="products-grid" *ngIf="rooms.length > 0; else noProducts">
      <div *ngFor="let product of rooms" class="product-card">
        <div class="image-container">
          <img class="img-front" [src]="product.frontImageUrl" (error)="handleImageError($event)" alt="{{ product.title }}">
          <img class="img-back" [src]="product.backImageUrl" (error)="handleImageError($event)" alt="{{ product.title }}">
        </div>
        <div class="product-details">
          <h3 class="product-title">{{ product.title }}</h3>
          <p class="product-description">{{ product.description }}</p>
          <div class="price-section">
            <span class="price">₪{{ product.price }}</span>
          </div>
        </div>
      </div>
    </div>

    <ng-template #noProducts>
      <div class="no-results">
        <i class="pi pi-inbox" style="font-size: 48px; color: #929292;"></i>
        <p>לא נמצאו מוצרים</p>
      </div>
    </ng-template>

    <div class="pagination" *ngIf="totalPages > 1">
      <button [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)" class="page-btn prev">
        <i class="pi pi-chevron-right"></i>
      </button>
      
      <div class="page-numbers">
        <button *ngFor="let p of pagesArray" 
                [class.active]="currentPage === p"
                (click)="changePage(p)"
                class="page-number">
          {{ p }}
        </button>
      </div>

      <button [disabled]="currentPage === totalPages" (click)="changePage(currentPage + 1)" class="page-btn next">
        <i class="pi pi-chevron-left"></i>
      </button>
    </div>
  </section>
  `,
  styles: [`
    .ikea-products { direction: rtl; font-family: 'Noto Sans Hebrew', sans-serif; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 32px; }
    .product-card { cursor: pointer; transition: transform 0.2s; }
    .product-card:hover { transform: translateY(-4px); }
    .image-container { position: relative; aspect-ratio: 1/1; overflow: hidden; background: #f5f5f5; margin-bottom: 12px; }
    .image-container img { position: absolute; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s; }
    .img-back { opacity: 0; }
    .product-card:hover .img-back { opacity: 1; }
    .product-card:hover .img-front { opacity: 0; }
    .product-title { font-size: 16px; font-weight: 700; margin: 0 0 8px 0; color: #111; }
    .product-description { font-size: 14px; color: #484848; margin: 0 0 12px 0; line-height: 1.4; }
    .price { font-size: 20px; font-weight: 700; color: #111; }
    .no-results { text-align: center; padding: 80px 20px; color: #929292; }
    .no-results p { margin-top: 16px; font-size: 18px; }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 60px; }
    .page-btn { background: #fff; border: 2px solid #111; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .page-btn:hover:not(:disabled) { background: #111; color: #fff; }
    .page-btn:disabled { border-color: #dfdfdf; color: #dfdfdf; cursor: not-allowed; }
    .page-numbers { display: flex; gap: 8px; }
    .page-number { background: #fff; border: 1px solid #dfdfdf; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-weight: 700; transition: all 0.2s; }
    .page-number:hover { border-color: #111; }
    .page-number.active { background: #008B8B; color: #fff; border-color: #008B8B; }
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
    const keys = Object.keys(changes);
    if (keys.some(k => k !== 'position' && !changes[k].firstChange)) {
      this.currentPage = 1;
    }
    this.fetchProducts();
  }

  fetchProducts() {
    const hasSearch = this.desc && this.desc.trim() !== '';
    const filters = {
      categoryIds: this.categoryIds,
      styleIds: this.styleIds,
      desc: '', 
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      position: hasSearch ? 1 : this.currentPage,
      skip: hasSearch ? 999999 : this.pageSize
    };

    this.productService.getProducts(filters).subscribe({
      next: (res) => {
        const productsFromServer = res.products || [];

        const baseUrl = environment.apiUrl.replace('/api', '');
        const mapped = productsFromServer.map((s: any) => ({
          id: s.productId,
          title: (s.name || '').replace(/_/g, ' '),
          description: s.description,
          price: s.price,
          frontImageUrl: s.frontImageUrl?.startsWith('http') ? s.frontImageUrl : `${baseUrl}/${s.frontImageUrl}`,
          backImageUrl: s.backImageUrl?.startsWith('http') ? s.backImageUrl : `${baseUrl}/${s.backImageUrl}`
        }));

        if (hasSearch) {
          const searchTerm = this.desc.trim().toLowerCase();
          this.rooms = mapped.filter((p: any) => 
            p.title.toLowerCase().includes(searchTerm)
          );
          this.totalItems = this.rooms.length;
          this.totalPages = this.rooms.length > 0 ? 1 : 0;
          this.pagesArray = this.rooms.length > 0 ? [1] : [];
        } else {
          this.rooms = mapped;
          this.totalItems = res.totalCount || 0;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.generatePagesArray();
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