import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { search } from '../../models/search.model';
import { StyleService } from '../../services/style';
import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-choose',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="filter-sidebar">
      <h3 class="sidebar-title">סינון תוצאות</h3>
      
      <div class="filter-section">
        <label class="section-label">חיפוש חופשי בעמוד</label>
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          (input)="search()" 
          placeholder="חפשו שם מוצר או תיאור..." 
          class="ikea-input"
        >
      </div>

      <div class="filter-section">
        <details open>
          <summary>קטגוריה</summary>
          <div class="checkbox-group">
            <div *ngFor="let cat of availableCategories" class="checkbox-row">
              <input type="checkbox" [id]="'cat-'+cat.categoryId" 
                     [checked]="categoryIds.includes(cat.categoryId)"
                     (change)="toggleCategory(cat.categoryId)">
              <label [for]="'cat-'+cat.categoryId">{{ cat.name }}</label>
            </div>
          </div>
        </details>
      </div>

      <div class="filter-section">
        <details open>
          <summary>סגנון עיצובי</summary>
          <div class="checkbox-group">
            <div *ngFor="let stl of availableStyles" class="checkbox-row">
              <input type="checkbox" [id]="'stl-'+stl.styleId" 
                     [checked]="styleIds.includes(stl.styleId)"
                     (change)="toggleStyle(stl.styleId)">
              <label [for]="'stl-'+stl.styleId">{{ stl.name.replace('_', ' ') }}</label>
            </div>
          </div>
        </details>
      </div>

      <div class="filter-section">
        <details>
          <summary>טווח מחיר</summary>
          <div class="price-flex">
            <input type="number" [(ngModel)]="minPrice" (input)="search()" placeholder="מ-" class="ikea-input small">
            <input type="number" [(ngModel)]="maxPrice" (input)="search()" placeholder="עד-" class="ikea-input small">
          </div>
        </details>
      </div>

      <button (click)="reset()" class="reset-btn">נקה הכל</button>
    </div>
  `,
  styles: [`
    .filter-sidebar { direction: rtl; padding: 20px; font-family: sans-serif; color: #111; border-left: 1px solid #e5e5e5; }
    .sidebar-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 25px; }
    .filter-section { border-top: 1px solid #e5e5e5; padding: 20px 0; }
    .section-label { display: block; font-weight: 700; margin-bottom: 10px; font-size: 0.9rem; }
    summary { font-weight: 700; cursor: pointer; display: flex; justify-content: space-between; }
    .checkbox-group { padding-top: 15px; display: flex; flex-direction: column; gap: 12px; }
    .checkbox-row { display: flex; align-items: center; gap: 12px; }
    .checkbox-row input { width: 18px; height: 18px; accent-color: #0058a3; }
    .ikea-input { width: 100%; padding: 12px; border: 1px solid #929292; border-radius: 4px; box-sizing: border-box; }
    .price-flex { display: flex; gap: 10px; padding-top: 15px; }
    .small { width: 50%; }
    .reset-btn { width: 100%; background: transparent; border: none; text-decoration: underline; color: #484848; margin-top: 15px; cursor: pointer; }
  `]
})
export class ChooseComponent implements OnInit {
  @Output() onSearch = new EventEmitter<search>();
  
  private categoryService = inject(CategoryService);
  private styleService = inject(StyleService);
  
  searchTerm = '';
  categoryIds: number[] = []; 
  styleIds: number[] = [];
  minPrice = 0; 
  maxPrice = 999999;
  
  availableCategories: any[] = []; 
  availableStyles: any[] = [];

  ngOnInit() { 
    this.fetchCategories(); 
    this.fetchStyles(); 
  }

  toggleCategory(id: number) {
    const index = this.categoryIds.indexOf(id);
    if (index > -1) this.categoryIds.splice(index, 1);
    else this.categoryIds.push(id);
    this.search();
  }

  toggleStyle(id: number) {
    const index = this.styleIds.indexOf(id);
    if (index > -1) this.styleIds.splice(index, 1);
    else this.styleIds.push(id);
    this.search();
  }

  search() {
    this.onSearch.emit({ 
      desc: this.searchTerm, 
      categoryIds: [...this.categoryIds], 
      styleIds: [...this.styleIds], 
      minPrice: this.minPrice, 
      maxPrice: this.maxPrice 
    });
  }

  reset() {
    this.searchTerm = '';
    this.categoryIds = [];
    this.styleIds = [];
    this.minPrice = 0;
    this.maxPrice = 999999;
    this.search();
  }

  fetchCategories() { 
    this.categoryService.getCategories().subscribe(data => this.availableCategories = data);
  }

  fetchStyles() { 
    this.styleService.getStyles().subscribe(data => this.availableStyles = data);
  }
}