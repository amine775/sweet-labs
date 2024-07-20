import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Dessert } from '../../domains/dessert';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  subjectFavorites = new BehaviorSubject<Dessert[]>([]);
  favorites$: Observable<Dessert[]> = this.subjectFavorites.asObservable();
  favoritesCount$: Observable<number> = this.favorites$.pipe(map(favorites => favorites.length));

  constructor() {}

  addToFavorites(newFavoriteDessert: Dessert) {
    const currentFavorites = this.subjectFavorites.value;
    this.subjectFavorites.next([...currentFavorites, newFavoriteDessert]);
  }

  removeFromFavorites(dessertToRemove: Dessert) {
    const currentFavorites = this.subjectFavorites.value;
    const newFavoritesList = currentFavorites.filter((dessert) => dessert.id !== dessertToRemove.id )
    this.subjectFavorites.next([...newFavoritesList]);
  }

  isFavorite(dessertId: string): boolean {
    return this.subjectFavorites.value.some(dessert => dessert.id === dessertId);
  }
}
