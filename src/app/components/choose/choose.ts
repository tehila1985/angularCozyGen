import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // הוספת CommonModule עבור ngFor ו-ngIf
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { search } from '../../models/search.model';

interface Category { categoryId: number; name: string; }
interface Style { styleId: number; name: string; }

@Component({
  selector: 'app-choose',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="search-card">
      <h3 class="search-title">סינון מוצרים</h3>
      
      <div class="search-grid">
        <div class="input-group full-width">
          <label>חיפוש חופשי</label>
          <input type="text" [(ngModel)]="desc" placeholder="מה תרצו למצוא היום?" class="form-control">
        </div>

        <div class="input-group">
          <label>קטגוריות</label>
          <select multiple [(ngModel)]="categoryIds" class="form-control select-multi">
            <option *ngFor="let cat of availableCategories" [ngValue]="cat.categoryId">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="input-group">
          <label>סגנונות</label>
          <select multiple [(ngModel)]="styleIds" class="form-control select-multi">
            <option *ngFor="let style of availableStyles" [ngValue]="style.styleId">
              {{ style.name }}
            </option>
          </select>
        </div>

        <div class="input-group">
          <label>מחיר מינימלי</label>
          <input type="number" [(ngModel)]="minPrice" class="form-control">
        </div>

        <div class="input-group">
          <label>מחיר מקסימלי</label>
          <input type="number" [(ngModel)]="maxPrice" class="form-control">
        </div>
      </div>

      <div class="actions">
        <button (click)="search()" class="btn-primary">
          <span class="icon">🔍</span> חפש עכשיו
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; direction: rtl; }

    .search-card {
      background: #ffffff;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      max-width: 900px;
      margin: 20px auto;
      border: 1px solid #f0f0f0;
    }

    .search-title {
      margin-top: 0;
      margin-bottom: 20px;
      color: #333;
      font-size: 1.25rem;
      border-bottom: 2px solid #b1935b;
      display: inline-block;
      padding-bottom: 4px;
    }

    .search-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .full-width { grid-column: 1 / -1; }

    .input-group { display: flex; flex-direction: column; gap: 8px; }

    .input-group label {
      font-weight: 600;
      font-size: 0.85rem;
      color: #666;
    }

    .form-control {
      padding: 10px 12px;
      border: 1.5px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      background: #fafafa;
    }

    .form-control:focus {
      outline: none;
      border-color: #b1935b;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(177, 147, 91, 0.1);
    }

    .select-multi { height: 100px; }

    .actions { display: flex; justify-content: flex-end; }

    .btn-primary {
      padding: 12px 30px;
      background: #b1935b;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, background 0.3s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-primary:hover {
      background: #9c7e48;
      transform: translateY(-2px);
    }

    .btn-primary:active { transform: translateY(0); }

    /* התאמה לנייד */
    @media (max-width: 600px) {
      .search-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ChooseComponent implements OnInit {
  // הלוגיקה נשארת זהה...
  @Output() onSearch = new EventEmitter<search>();
  private http = inject(HttpClient);

  desc: string = '';
  categoryIds: number[] = [];
  styleIds: number[] = [];
  minPrice: number = 0;
  maxPrice: number = 999999;

  availableCategories: Category[] = [];
  availableStyles: Style[] = [];

  ngOnInit() {
    this.fetchCategories();
    this.fetchStyles();
  }

  search() {
    this.onSearch.emit({
      desc: this.desc,
      categoryIds: this.categoryIds,
      styleIds: this.styleIds,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    });
  }

  fetchCategories() {
    this.http.get<Category[]>(`${environment.apiUrl}/Category`).subscribe({
      next: data => this.availableCategories = data,
      error: err => console.error('Error fetching categories:', err)
    });
  }

  fetchStyles() {
    this.http.get<Style[]>(`${environment.apiUrl}/Style`).subscribe({
      next: data => this.availableStyles = data,
      error: err => console.error('Error fetching styles:', err)
    });
  }
}