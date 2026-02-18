import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Showproducts } from '../../components/showproducts/showproducts';
import { TopMenu } from '../../components/top-menu/top-menu';
import { ChooseComponent } from '../../components/choose/choose';
import { search } from '../../models/search.model';
import { SearchComponent } from "../../components/search/search";
import { PriceFilterComponent } from '../../components/price-filter/price-filter';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [Showproducts, TopMenu, ChooseComponent, SearchComponent, PriceFilterComponent],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products {
  @ViewChild(PriceFilterComponent) priceFilter!: PriceFilterComponent;
  @ViewChild(SearchComponent) searchComponent!: SearchComponent;
  
  categoryIds: number[] = [];
  styleIds: number[] = [];
  desc: string = '';
  minPrice: number = 0;
  maxPrice: number = 999999;

  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const categoryId = Number(params.get('categoryId'));
      const styleId = Number(params.get('styleId'));
      this.categoryIds = categoryId ? [categoryId] : [];
      this.styleIds = styleId ? [styleId] : [];
      
      // Reset filters on navigation
      this.desc = '';
      this.minPrice = 0;
      this.maxPrice = 999999;
      
      setTimeout(() => {
        if (this.priceFilter) this.priceFilter.resetFilter();
        if (this.searchComponent) this.searchComponent.resetSearch();
      });
    });
  }

  updateFilters(filters: search) {
    this.categoryIds = filters.categoryIds;
    this.styleIds = filters.styleIds;
    this.desc = filters.desc;
    this.minPrice = filters.minPrice;
    this.maxPrice = filters.maxPrice;
  }

  updatePriceFilter(filters: { minPrice: number, maxPrice: number, searchName: string }) {
    this.minPrice = filters.minPrice;
    this.maxPrice = filters.maxPrice;
    this.desc = filters.searchName;
  }
}
