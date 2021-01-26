import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShomagService {

  constructor(private http: HttpClient) { }

  cartProducts$ = new BehaviorSubject<any>([]);
  products$ = new BehaviorSubject<any>([]);

  getProducts(searchQuery: string) {
    this.http.post<any>('/api/products', {searchQuery})
      .subscribe(products => this.products$.next(products));
  }

  getCartProducts() {
    this.http.get('/api/cart')
      .subscribe(products => this.cartProducts$.next(products));
  }

  addToCart(cartProduct: any) {
    this.http.post<any>('/api/cart', cartProduct)
      .subscribe(() => this.getCartProducts());
  }

  delete(id: string) {
    this.http.delete(`/api/cart/${id}`)
      .subscribe(() => this.getCartProducts());
  }
}
