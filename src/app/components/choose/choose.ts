import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    <div class="sidebar-card">
      <h3 class="sidebar-title">סינון פריטים</h3>
      
      <div class="filter-stack">
        <div class="input-group">
          <label>חיפוש חופשי</label>
          <input type="text" [(ngModel)]="desc" placeholder="חפש מוצר..." class="form-control">
        </div>

        <hr class="divider">

        <div class="input-group">
          <label>קטגוריות</label>
          <select multiple [(ngModel)]="categoryIds" class="form-control select-multi">
            <option *ngFor="let cat of availableCategories" [ngValue]="cat.categoryId">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <hr class="divider">

        <div class="input-group">
          <label>סגנונות</label>
          <select multiple [(ngModel)]="styleIds" class="form-control select-multi">
            <option *ngFor="let style of availableStyles" [ngValue]="style.styleId">
              {{ style.name }}
            </option>
          </select>
        </div>

        <hr class="divider">

        <div class="input-group">
          <label>טווח מחירים</label>
          <div class="price-inputs">
            <input type="number" [(ngModel)]="minPrice" placeholder="מ-" class="form-control price-input">
            <input type="number" [(ngModel)]="maxPrice" placeholder="עד-" class="form-control price-input">
          </div>
        </div>
      </div>

      <button (click)="search()" class="btn-apply">
        <span>🔍</span> החל מסננים
      </button>
    </div>
  `,
  styles: [`
    :host { display: block; direction: rtl; }
    .sidebar-card {
      background: #fff;
      padding: 24px;
      border: 1px solid #eee;
      border-radius: 4px; /* התאמה לסגנון הריבועי של המוצרים */
    }
    .sidebar-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 20px;
      border-right: 4px solid #b1935b;
      padding-right: 12px;
      color: #111;
    }
    .filter-stack { display: flex; flex-direction: column; gap: 15px; }
    .input-group { display: flex; flex-direction: column; gap: 6px; }
    .input-group label { font-weight: 600; font-size: 0.85rem; color: #666; }
    .form-control {
      padding: 10px;
      border: 1px solid #e2e2e2;
      border-radius: 2px;
      font-size: 0.9rem;
      background: #fcfcfc;
    }
    .form-control:focus { outline: none; border-color: #b1935b; background: #fff; }
    .select-multi { height: 110px; }
    .price-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .divider { border: 0; border-top: 1px solid #f0f0f0; margin: 10px 0; }
    .btn-apply {
      width: 100%;
      margin-top: 25px;
      padding: 12px;
      background: #b1935b;
      color: #fff;
      border: none;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.3s;
    }
    .btn-apply:hover { background: #967d4d; }
  `]
})
export class ChooseComponent implements OnInit {
  @Output() onSearch = new EventEmitter<search>();
  private http = inject(HttpClient);
  desc = ''; categoryIds: number[] = []; styleIds: number[] = [];
  minPrice = 0; maxPrice = 999999;
  availableCategories: Category[] = []; availableStyles: Style[] = [];

  ngOnInit() { this.fetchCategories(); this.fetchStyles(); }
  search() {
    this.onSearch.emit({ desc: this.desc, categoryIds: this.categoryIds, styleIds: this.styleIds, minPrice: this.minPrice, maxPrice: this.maxPrice });
  }
  fetchCategories() { this.http.get<Category[]>(`${environment.apiUrl}/Category`).subscribe(data => this.availableCategories = data); }
  fetchStyles() { this.http.get<Style[]>(`${environment.apiUrl}/Style`).subscribe(data => this.availableStyles = data); }
}