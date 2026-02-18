import { Component, inject, OnInit } from '@angular/core';
import { ItemDetail } from "../../components/item-detail/item-detail";
import { Product } from '../../models/product.model';
import { ActivatedRoute } from '@angular/router';
import { TopMenu } from "../../components/top-menu/top-menu";

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [ItemDetail, TopMenu],
  templateUrl: './item.html',
  styleUrl: './item.css',
})
export class Item implements OnInit {
  private route = inject(ActivatedRoute);
  selectedProduct: Product | undefined;

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const productData = params.get('product');
      
      if (productData) {
        try {
          this.selectedProduct = JSON.parse(productData);
        } catch (e) {
          console.error("שגיאה בפענוח נתוני המוצר", e);
        }
      }
    });
  }
}
