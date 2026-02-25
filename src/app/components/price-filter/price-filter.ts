import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-price-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './price-filter.html',
  styleUrls: ['./price-filter.css']
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
