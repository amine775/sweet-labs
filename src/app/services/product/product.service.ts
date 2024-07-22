import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Dessert } from '../../domains/dessert';

@Injectable({
  providedIn: 'root',
})
export class ProductService implements OnInit {
  private subjectFavorites = new BehaviorSubject<Dessert[]>([]);
  favorites$: Observable<Dessert[]> = this.subjectFavorites.asObservable();
  favoritesCount$: Observable<number> = this.favorites$.pipe(map(favorites => favorites.length));

  constructor() {
  }

  ngOnInit(): void {
    console.log('test2')
    let localFavorites = localStorage.getItem('favorites')
    if (localFavorites) {
      this.subjectFavorites.next(JSON.parse(localFavorites) as Dessert[])
      localStorage.setItem('favorites', JSON.stringify(this.subjectFavorites.value))
    }
  }

  addToFavorites(newFavoriteDessert: Dessert) {
    let localFavorites = localStorage.getItem('favorites')
    if (localFavorites) {
      let currentLocalFavorites = JSON.parse(localFavorites) as Dessert[]
      currentLocalFavorites.push(newFavoriteDessert)
      this.subjectFavorites.next([...currentLocalFavorites])
      localStorage.setItem('favorites', JSON.stringify(this.subjectFavorites.value))
    }
  }

  removeFromFavorites(dessertToRemove: Dessert) {
    let localFavorites = localStorage.getItem('favorites')
    if (localFavorites) {
      let currentLocalFavorites = JSON.parse(localFavorites) as Dessert[]
      let newFavorites = currentLocalFavorites.filter((favorite) => favorite.id !== dessertToRemove.id)
      this.subjectFavorites.next([...newFavorites]);
      localStorage.setItem('favorites', JSON.stringify(this.subjectFavorites.value))
    }
  }

  isFavorite(dessertId: string): boolean {

    let localFavorites = localStorage.getItem('favorites')
    if (localFavorites) {
      let currentLocalFavorites = JSON.parse(localFavorites) as Dessert[]
      let newFavorites = currentLocalFavorites.filter((favorite) => favorite.id === dessertId)
      return newFavorites.some(dessert => dessert.id === dessertId);
    } else {
      return false
    }
  }
}
