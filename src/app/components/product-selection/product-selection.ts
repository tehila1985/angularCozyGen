import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';

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
    .selection-section {
      padding: 80px 6%;
      background: #fafafa;
      direction: rtl;
      font-family: 'Inter', system-ui, sans-serif;
      overflow: hidden;
    }

    .header-container {
      text-align: center;
      margin-bottom: 50px;
    }

    .category-label {
      font-size: .85rem;
      letter-spacing: 4px;
      color: #b1935b;
      font-weight: 600;
      display: block;
      margin-bottom: 12px;
    }

    .style-heading {
      font-size: 3.8rem;
      font-weight: 300;
      margin: 0;
      color: #1a1a1a;
    }

    .style-subtext {
      color: #888;
      font-size: 1.05rem;
      margin-top: 12px;
    }

    .rooms-grid {
      display: flex;
      gap: 20px;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-behavior: smooth;
      padding-bottom: 8px;
      scroll-snap-type: x mandatory;
    }

    .rooms-grid::-webkit-scrollbar {
      height: 0;
    }

    .room-card {
      flex: 0 0 300px;
      height: 280px;
      scroll-snap-align: start;
      opacity: 0;
      transform: translateY(12px);
      transition: all .6s ease;
      cursor: pointer;
    }

    .room-card.appear {
      opacity: 1;
      transform: translateY(0);
    }

    .card-inner {
      width: 100%;
      height: 100%;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
    }

    .image-zoom-wrapper,
    img {
      width: 100%;
      height: 100%;
    }

    img {
      object-fit: cover;
      transition: transform .8s ease;
    }

    .room-card:hover img {
      transform: scale(1.05);
    }

    .card-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,.28);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 18px;
      transition: background .3s ease;
    }

    .room-card:hover .card-overlay {
      background: rgba(0,0,0,.45);
    }

    .count-pill {
      background: white;
      color: black;
      padding: 5px 10px;
      font-size: .75rem;
      font-weight: 600;
      border-radius: 4px;
    }

    .bottom-content {
      color: white;
      transition: transform .3s ease;
    }

    .room-card:hover .bottom-content {
      transform: translateY(-2px);
    }

    .room-title {
      margin: 0 0 8px;
      font-size: 1.4rem;
      font-weight: 600;
    }

    .explore-link {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: .9rem;
      opacity: .9;
    }

    /* ===== מובייל ===== */
    @media (max-width: 600px) {
      .room-card {
        flex: 0 0 240px;
        height: 220px;
      }

      .style-heading {
        font-size: 2.2rem;
      }
    }
  `]
})
export class ProductSelection implements OnInit {

  isLoaded = false;
  categories: Category[] = [];
  counts: Record<number, number> = {};
  private http = inject(HttpClient);
  categoryChosen = output<number>();

  choose(id: number) {
    this.categoryChosen.emit(id); }
  ngOnInit() {
    this.fetchCategories();
  }
  
 
  async getProductCountForCategory(categoryId: number): Promise<number> {
    const params = new HttpParams()
      .set('position', '1')
      .set('skip', '1')
      .set('categoryIds', categoryId.toString());

    try {
      const res = await firstValueFrom(
        this.http.get<any>(`${environment.apiUrl}/Product`, { params })
      );
      return res.totalCount ?? res.TotalCount ?? res.item2 ?? 0;
    } catch {
      return 0;
    }
  }

  fetchCategories() {
    this.http.get<Category[]>(`${environment.apiUrl}/Category`)
      .subscribe({
        next: async (data) => {
          this.categories = data;

          const promises = data.map(async c => {
            const count = await this.getProductCountForCategory(c.categoryId);
            this.counts[c.categoryId] = count;
          });

          await Promise.all(promises);
          setTimeout(() => this.isLoaded = true, 100);
        },
        error: err => console.error('Error fetching categories:', err)
      });
  }

  getImage(name: string) {
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/images/${name.toLowerCase()}.webp`;
  }

  handleImageError(e: any) {
    e.target.src =
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000';
  }
}
