import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faCircle, faCartPlus} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-shomag-list',
  templateUrl: './shomag-list.component.html',
  styleUrls: ['./shomag-list.component.scss']
})
export class ShomagListComponent implements OnInit {
  @Input('cards')
  cards = true;

  @Input('products')
  products: any;

  @Output('deleteEmitter')
  deleteEmitter = new EventEmitter<string>();

  @Output('addToCartEmitter')
  addToCartEmitter = new EventEmitter<any>();

  faCartPlus = faCartPlus;
  faCircle = faCircle;

  constructor() { }

  ngOnInit() {}

  goToImage(url: string) {
    window.open(url, "_blank");
  };
}
