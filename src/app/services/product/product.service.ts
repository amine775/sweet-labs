import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { Dessert } from "../../domains/dessert";
import { LocalProduct } from "../../domains/local-product";

@Injectable({
  providedIn: "root",
})
export class ProductService implements OnInit {
  private subjectCarts = new BehaviorSubject<LocalProduct[]>([]);
  carts$: Observable<LocalProduct[]> = this.subjectCarts.asObservable();
  cartsCount$: Observable<number> = this.carts$.pipe(
    map((carts) => {
      let itemCount = 0;
      carts.forEach(item => {
        itemCount += item.quantity;
      })
      return itemCount
    })
  );

  constructor() {}

  ngOnInit(): void {}

  init() {
    let localcarts = localStorage.getItem("carts");
    if (localcarts) {
      this.subjectCarts.next(JSON.parse(localcarts) as LocalProduct[]);
    }
  }

  addToCart(newCartDessert: any) {
    let localCarts = localStorage.getItem("carts");
    let currentCarts: LocalProduct[] = [];
    if (localCarts) {
      currentCarts = JSON.parse(localCarts) as LocalProduct[];
    }
    let newCart : LocalProduct[] = []
    let dessertToAdd = newCartDessert as LocalProduct;
    const isAlreadyInCart = currentCarts.some(product => product.id === dessertToAdd.id)
    if (isAlreadyInCart) {
      let dessertInCart = currentCarts.filter(product => product.id === newCartDessert.id).at(0)!;
      dessertInCart.quantity = dessertInCart.quantity + 1;
      let cartReloaded = currentCarts.filter(product => product.id !== newCartDessert.id);
      cartReloaded.push(dessertInCart);
      newCart = cartReloaded;
    } else {
      dessertToAdd.quantity = 1;
      currentCarts.push(dessertToAdd);
      newCart = currentCarts;
    }
    this.subjectCarts.next([...newCart]);
    localStorage.setItem('carts', JSON.stringify(this.subjectCarts.value));
  }

  removeFromCarts(dessertToRemove: any) {
    let localCarts = localStorage.getItem('carts');
    if (localCarts) {
      let currentLocalCarts = JSON.parse(localCarts) as LocalProduct[];
      let newcarts = currentLocalCarts.filter(
        (cart) => cart.id !== dessertToRemove.id
      );
      this.subjectCarts.next([...newcarts]);
      localStorage.setItem("carts", JSON.stringify(this.subjectCarts.value));
    }
  }

  emptyCart() {
    localStorage.removeItem('carts')
    this.subjectCarts.next([])
  }

  updateCart(newCart: LocalProduct[]) {
    localStorage.setItem("carts", JSON.stringify(newCart));
    this.subjectCarts.next(newCart);
  }

  isInCart(dessertId: string): boolean {
    let localcarts = localStorage.getItem("carts");
    if (localcarts) {
      let currentLocalCarts = JSON.parse(localcarts) as LocalProduct[];
      let newCarts = currentLocalCarts.filter((cart) => cart.id === dessertId);
      return newCarts.some((dessert) => dessert.id === dessertId);
    } else {
      return false;
    }
  }
}
