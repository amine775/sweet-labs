import { Component, inject, OnDestroy, OnInit} from '@angular/core';
import { FirestoreService } from '../services/firebase/database/firestore.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product/product.service';
import { Dessert } from '../domains/dessert';
import { Observable, Subscription } from 'rxjs';
import { CatalogListComponent } from './catalog-list/catalog-list.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    CatalogListComponent
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit, OnDestroy {
  firestoreService = inject(FirestoreService);
  productService = inject(ProductService);
  desserts$ : Observable<Dessert[]>;
  margin: any;
  isLoading = false
  subscriptions: Subscription[] = []

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  constructor() {
    this.desserts$ = this.firestoreService.fetchAllDessert();
  }

  addToCart(cartDessert: Dessert) {
    this.productService.addToCart(cartDessert);
  }

  removeFromCart(dessert: Dessert) {
    this.productService.removeFromCarts(dessert);
  }

  isInCart(dessert: Dessert): boolean {
    return this.productService.isInCart(dessert.id);
  }

}
