import { Component, Output, EventEmitter } from '@angular/core';

import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-choose',
  standalone: true,
  imports: [FormsModule],
  template: `
  <div class="search-container">
    <input type="text" [(ngModel)]="desc" placeholder="חפש מוצר..." class="search-input">

    <div class="filters">
      <label>
        קטגוריות:
        <select multiple [(ngModel)]="categoryIds">
          <option *ngFor="let cat of availableCategories" [value]="cat.id">{{ cat.name }}</option>
        </select>
      </label>

      <label>
        סגנונות:
        <select multiple [(ngModel)]="styleIds">
          <option *ngFor="let style of availableStyles" [value]="style.id">{{ style.name }}</option>
        </select>
      </label>

      <label>
        מחיר מינימלי:
        <input type="number" [(ngModel)]="minPrice">
      </label>

      <label>
        מחיר מקסימלי:
        <input type="number" [(ngModel)]="maxPrice">
      </label>
    </div>

    <button (click)="search()" class="search-btn">חפש</button>
  </div>
  `,
  styles: [`
    .search-container { display: flex; flex-direction: column; gap: 16px; background: #fff; padding: 16px; border-radius: 4px; }
    .search-input { padding: 8px; font-size: 1rem; border: 1px solid #ccc; border-radius: 2px; width: 100%; }
    .filters { display: flex; gap: 16px; flex-wrap: wrap; }
    select, input[type=number] { padding: 6px; font-size: 0.95rem; border: 1px solid #ccc; border-radius: 2px; }
    .search-btn { padding: 10px 16px; background: #b1935b; color: #fff; border: none; cursor: pointer; font-weight: 600; border-radius: 2px; }
    .search-btn:hover { background: #9c7e48; }
  `]
})
export class Choose {
  @Output() onSearch = new EventEmitter<{
    desc: string,
    categoryIds: number[],
    styleIds: number[],
    minPrice: number,
    maxPrice: number
  }>();

  desc: string = '';
  categoryIds: number[] = [];
  styleIds: number[] = [];
  minPrice: number = 0;
  maxPrice: number = 999999;

  // דוגמה לקטגוריות וסגנונות - אפשר להחליף בנתונים מהשרת
  availableCategories = [
    { id: 1, name: 'סלון' },
    { id: 2, name: 'חדר שינה' },
    { id: 3, name: 'מטבח' }
  ];
  availableStyles = [
    { id: 1, name: 'מודרני' },
    { id: 2, name: 'קלאסי' },
    { id: 3, name: 'תעשייתי' }
  ];

  search() {
    this.onSearch.emit({
      desc: this.desc,
      categoryIds: this.categoryIds,
      styleIds: this.styleIds,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    });
  }
}
