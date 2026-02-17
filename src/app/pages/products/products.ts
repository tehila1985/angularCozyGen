import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Showproducts } from "../../components/showproducts/showproducts";
import { TopMenu } from "../../components/top-menu/top-menu";
import { Choose } from "../../components/choose/choose";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [Showproducts, TopMenu, Choose],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {

  categoryId = 0;
  styleId = 0;

  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {

      this.categoryId =
        Number(params.get('categoryId')) || 0;

      this.styleId =
        Number(params.get('styleId')) || 0;
    });
  }
}
