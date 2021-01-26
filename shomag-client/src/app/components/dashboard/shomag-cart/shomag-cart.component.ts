import { Component, OnInit } from '@angular/core';
import {ShomagService} from '../../../services/shomag.service';
import {faCartPlus} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-shomag-cart',
  templateUrl: './shomag-cart.component.html',
  styleUrls: ['./shomag-cart.component.scss']
})
export class ShomagCartComponent implements OnInit {
  products: any;
  faCartPlus = faCartPlus;
  constructor(private service: ShomagService) { }

  ngOnInit() {
      this.service.getCartProducts();
      this.service.cartProducts$.subscribe(products => this.products = products);
  }

  delete(product: any) {
    this.service.delete(product._id);
  }
}