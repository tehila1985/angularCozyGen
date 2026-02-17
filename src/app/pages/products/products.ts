import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Showproducts } from '../../components/showproducts/showproducts';
import { TopMenu } from '../../components/top-menu/top-menu';
import { ChooseComponent } from '../../components/choose/choose';
import { search } from '../../models/search.model';
import { SearchComponent } from "../../components/search/search";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [Showproducts, TopMenu, ChooseComponent, SearchComponent],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products {
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
    });
  }

  updateFilters(filters: search) {
    this.categoryIds = filters.categoryIds;
    this.styleIds = filters.styleIds;
    this.desc = filters.desc;
    this.minPrice = filters.minPrice;
    this.maxPrice = filters.maxPrice;
  }
}
