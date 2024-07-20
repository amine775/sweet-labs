import { Component, computed, effect, inject, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { outputFromObservable, toSignal } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FirestoreService } from '../services/firebase/database/firestore.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductService } from '../services/product/product.service';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import { Dessert } from '../domains/dessert';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    CommonModule,
    NgOptimizedImage,
    DividerModule,
    FormsModule,
    InputTextModule,
    FloatLabelModule,
    CheckboxModule,
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit, OnDestroy {
  firestoreService = inject(FirestoreService);
  productService = inject(ProductService);

  first = 0
  last = 0;
  rows: number = 10;  
  totalRecords: number = 0;
  desserts$ : Observable<Dessert[] | undefined>;
  lastDoc : Dessert | undefined;
  firstDoc : Dessert | undefined;
  margin: any;
  filterValue: string = '';
  $categoriesFilter: WritableSignal<string[]> = signal(['Tiramisu', 'Brownie', 'Cheesecake', 'Cookie'])
  currentPage: number = 1
  isLoading = false
  $askedPaged : WritableSignal<number> =  signal(0);
  subscriptions: Subscription[] = []

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  constructor() {
    this.desserts$ = this.getFirstPage()

    this.subscriptions.push(
      this.updateValues()
    )
    this.firestoreService.countDesserts(this.$categoriesFilter()).then((value) => {
      this.totalRecords = value;
    });
  }

  

  addToFavorite(favoriteDessert: Dessert) {
    this.productService.addToFavorites(favoriteDessert);
  }

  removeFromFavorite(dessert: Dessert) {
    this.productService.removeFromFavorites(dessert);
  }

  isFavorite(dessert: Dessert): boolean {
    return this.productService.isFavorite(dessert.id);
  }

  nextPage() {
    if (this.last === this.totalRecords) {
      return;
    } 
    
    if (this.lastDoc) {
      this.desserts$ = this.firestoreService.fetchNextPage(this.rows, this.lastDoc, this.$categoriesFilter())
      this.subscriptions.push(
        this.updateValues()
      )
      this.$askedPaged.set(this.$askedPaged() + 1)
      
      return;
    }
  }
  
  previousPage() {
    if (this.first === 1) {
      return;
    }
    if (this.firstDoc) {
      this.desserts$ = this.firestoreService.fetchPreviousPage(this.rows, this.firstDoc, this.$categoriesFilter())
      this.subscriptions.push(
        this.updateValues()
      )
      this.$askedPaged.set(this.$askedPaged() - 1)
      return;
    }
  }

  getFirstPage():Observable<Dessert[] | undefined> {
    this.firestoreService.countDesserts(this.$categoriesFilter()).then((value) => {
      this.totalRecords = value;
    });

    this.desserts$ = this.firestoreService.fetchNextPage(this.rows, undefined, this.$categoriesFilter())
    return this.desserts$;
  }

  getNumberOfPage() {
    return Math.abs(this.totalRecords / this.rows);
  }

  shouldPreviousBeDisable():boolean {
    if (this.first === 0) {
      return true
    }
    return false
  }

  shouldNextBeDisable():boolean {
    if (this.last === this.totalRecords) {
      return true
    }
    return false
  }

  updateValues():Subscription {
    return this.desserts$.subscribe((newDesserts) => {
      
      this.lastDoc = newDesserts?.pop()
      this.firstDoc = newDesserts?.at(0)

      this.first = this.$askedPaged() * this.rows + 1
      this.last = this.first + newDesserts!.length 
    })
    
  }
}
