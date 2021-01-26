import { Component, OnInit } from '@angular/core';
import {ShomagService} from '../../../services/shomag.service';

@Component({
  selector: 'app-shomag-search',
  templateUrl: './shomag-search.component.html',
  styleUrls: ['./shomag-search.component.scss']
})
export class ShomagSearchComponent implements OnInit {
  products: any;
  searchQuery: any;

  constructor(private service: ShomagService) { }

  ngOnInit() {
    this.service.products$.subscribe(products => this.products = products);
  }

  typeQuery(event) { 
    this.searchQuery = event.target.value;
  }

  addToCart(cartProduct: any) {
    this.service.addToCart(cartProduct);
  }

  getProducts() {
    this.service.getProducts(this.searchQuery);
  }
}
