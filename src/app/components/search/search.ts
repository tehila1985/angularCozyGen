import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { search } from '../../models/search.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search.html',
  styleUrls: ['./search.css'],
})
export class SearchComponent {
  @Output() onSearch = new EventEmitter<search>();

  searchTerm = '';

  search() {
    this.onSearch.emit({
      desc: this.searchTerm,
      categoryIds: [],
      styleIds: [],
      minPrice: 0,
      maxPrice: 999999
    });
  }

  resetSearch() {
    this.searchTerm = '';
  }
}
