import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category';   
import { ProductService } from '../../services/product';   
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="products-section" class="selection-section">
      <div class="header-container">
        <span class="category-label">OUR COLLECTIONS</span>
        <h3 class="style-heading">קטגוריות מוצרים</h3>
        <p class="style-subtext">מגוון פריטים מעוצבים לכל חלל בבית</p>
      </div>

      <div class="rooms-grid">
        <div
          *ngFor="let c of categories; let i = index"
          class="room-card"
          [class.appear]="isLoaded"
          [style.transition-delay]="(i * 100) + 'ms'"
          (click)="choose(c.categoryId)"
        >
          <div class="card-inner">
            <div class="image-zoom-wrapper">
              <img
                [src]="getImage(c.name)"
                [alt]="c.name"
                (error)="handleImageError($event)"
              />
            </div>

            <div class="card-overlay">
              <div>
                <span class="count-pill">
                  {{ counts[c.categoryId] || 0 }} פריטים
                </span>
              </div>

              <div class="bottom-content">
                <h4 class="room-title">{{ c.name }}</h4>
                <div class="explore-link">
                  <span>צפו בקולקציה</span>
                  <i class="pi pi-arrow-left"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .selection-section { padding: 80px 40px; background: #fff; direction: rtl; font-family: 'Noto Sans Hebrew', sans-serif; }
    .header-container { text-align: center; margin-bottom: 48px; }
    .category-label { font-size: 12px; letter-spacing: 2px; color: #929292; font-weight: 700; display: block; margin-bottom: 16px; text-transform: uppercase; }
    .style-heading { font-size: 48px; font-weight: 700; margin: 0; color: #111; }
    .style-subtext { color: #484848; font-size: 18px; margin-top: 16px; }
    .rooms-grid { display: flex; gap: 16px; overflow-x: auto; scroll-behavior: smooth; padding-bottom: 16px; scroll-snap-type: x mandatory; max-width: 1920px; margin: 0 auto; }
    .rooms-grid::-webkit-scrollbar { height: 8px; }
    .rooms-grid::-webkit-scrollbar-track { background: #f5f5f5; }
    .rooms-grid::-webkit-scrollbar-thumb { background: #dfdfdf; border-radius: 4px; }
    .room-card { flex: 0 0 320px; height: 320px; scroll-snap-align: start; opacity: 0; transform: translateY(20px); transition: all 0.5s ease; cursor: pointer; }
    .room-card.appear { opacity: 1; transform: translateY(0); }
    .card-inner { width: 100%; height: 100%; border-radius: 0; overflow: hidden; position: relative; }
    .image-zoom-wrapper, img { width: 100%; height: 100%; }
    img { object-fit: cover; transition: transform 0.4s ease; }
    .room-card:hover img { transform: scale(1.08); }
    .card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%); display: flex; flex-direction: column; justify-content: space-between; padding: 20px; }
    .count-pill { background: white; color: #111; padding: 6px 12px; font-size: 12px; font-weight: 700; border-radius: 50px; display: inline-block; }
    .bottom-content { color: white; }
    .room-title { margin: 0 0 12px; font-size: 24px; font-weight: 700; color: white; }
    .explore-link { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; }
    @media (max-width: 600px) { .room-card { flex: 0 0 280px; height: 280px; } .style-heading { font-size: 32px; } }
  `]
})
export class ProductSelection implements OnInit {
  // הזרקת שירותים חדשה
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  
  isLoaded = false;
  categories: Category[] = [];
  counts: Record<number, number> = {};
  categoryChosen = output<number>();

  ngOnInit() {
    this.fetchCategories();
  }

  choose(id: number) {
    this.categoryChosen.emit(id);
  }

  fetchCategories() {
    this.categoryService.getCategories().subscribe({
      next: async (data) => {
        this.categories = data;

        // שימוש ב-ProductService כדי להביא ספירה לכל קטגוריה
        const promises = data.map(async (c) => {
          try {
            const res = await firstValueFrom(
              this.productService.getProducts({
                position: 0,
                skip: 1, // אנחנו צריכים רק את ה-totalCount, אז נדלג על השאר
                categoryIds: [c.categoryId]
              })
            );
            // חילוץ ה-Count לפי המבנה שהגדרת בסרוויס
            this.counts[c.categoryId] = res.totalCount ?? res.TotalCount ?? res.item2 ?? 0;
          } catch (err) {
            console.error(`Error fetching count for category ${c.categoryId}:`, err);
            this.counts[c.categoryId] = 0;
          }
        });

        await Promise.all(promises);
        setTimeout(() => (this.isLoaded = true), 100);
      },
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  getImage(name: string) {
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/images/${name.toLowerCase()}.webp`;
  }

  handleImageError(e: any) {
    e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000';
  }
}