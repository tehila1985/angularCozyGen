import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-price-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-sidebar">
      <h3 class="sidebar-title">סינון מוצרים</h3>
      
      <div class="filter-section">
        <label class="section-label">חיפוש לפי שם</label>
        <input 
          type="text" 
          [(ngModel)]="searchName" 
          (input)="onFilterChange()" 
          placeholder="הקלד שם מוצר..." 
          class="ikea-input"
        >
      </div>

      <div class="filter-section">
        <details open>
          <summary>טווח מחיר</summary>
          <div class="price-flex">
            <input type="number" [(ngModel)]="minPrice" (input)="onFilterChange()" placeholder="מ-" class="ikea-input small">
            <input type="number" [(ngModel)]="maxPrice" (input)="onFilterChange()" placeholder="עד-" class="ikea-input small">
          </div>
        </details>
      </div>

      <button (click)="resetFilter()" class="reset-btn">נקה הכל</button>
    </div>
  `,
  styles: [`
    .filter-sidebar { direction: rtl; padding: 20px; font-family: sans-serif; color: #111; border-left: 1px solid #e5e5e5; }
    .sidebar-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 25px; }
    .filter-section { border-top: 1px solid #e5e5e5; padding: 20px 0; }
    .section-label { display: block; font-weight: 700; margin-bottom: 10px; font-size: 0.9rem; }
    summary { font-weight: 700; cursor: pointer; display: flex; justify-content: space-between; }
    .ikea-input { width: 100%; padding: 12px; border: 1px solid #929292; border-radius: 4px; box-sizing: border-box; }
    .price-flex { display: flex; gap: 10px; padding-top: 15px; }
    .small { width: 50%; }
    .reset-btn { width: 100%; background: transparent; border: none; text-decoration: underline; color: #484848; margin-top: 15px; cursor: pointer; }
  `]
})
export class PriceFilterComponent {
  @Output() filterChange = new EventEmitter<{ minPrice: number, maxPrice: number, searchName: string }>();
  
  searchName: string = '';
  minPrice: number = 0;
  maxPrice: number = 999999;

  onFilterChange() {
    this.filterChange.emit({ minPrice: this.minPrice, maxPrice: this.maxPrice, searchName: this.searchName });
  }

  resetFilter() {
    this.searchName = '';
    this.minPrice = 0;
    this.maxPrice = 999999;
    this.onFilterChange();
  }
}
