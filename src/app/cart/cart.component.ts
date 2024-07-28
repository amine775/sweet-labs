import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product/product.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LocalProduct } from '../domains/local-product';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FirestoreService } from '../services/firebase/database/firestore.service';
import { QuoteRequest } from '../domains/quote-request';
import { Subscription, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    DataViewModule,
    ButtonModule,
    CommonModule,
    SliderModule,
    InputTextModule,
    FormsModule,
    ToastModule,
    ConfirmPopupModule,
    ReactiveFormsModule,
    DialogModule,
    FormsModule,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class CartComponent implements OnInit, OnDestroy {
  firebaseService = inject(FirestoreService);
  productService = inject(ProductService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  router = inject(Router)

  products$ = this.productService.carts$;

  productsCart: LocalProduct[] = [];

  quoteDetailsVisible = false;

  subscriptions: Subscription[] = [];

  quoteForm = new FormGroup({
    email: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.subscriptions.push(
      this.products$.subscribe((products) => {
        this.productsCart = [...products].map((product) => {
          return {
            id: product.id,
            label: product.label,
            recipe: product.recipe,
            price: product.price,
            imageUri: product.imageUri,
            category: product.category,
            quantity: product.quantity,
          };
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  askDelete(event: Event, product: LocalProduct) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Voulez vous vraiment supprimer ce dessert?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        this.productService.removeFromCarts(product);
        this.onSuccessMessage('Dessert supprimé');
      },
    });
  }

  deduct(productId: string) {
    this.productsCart = this.productsCart.map((product) => {
      if (product.id === productId) {
        if (product.quantity > 1) {
          product.quantity = product.quantity - 1;
        }
      }
      return product;
    });
    this.productService.updateCart(this.productsCart);
  }

  add(productId: string) {
    this.productsCart = this.productsCart.map((product) => {
      if (product.id === productId) {
        product.quantity = product.quantity + 1;
      }
      return product;
    });
    this.productService.updateCart(this.productsCart);
  }

  removeProduct(event: Event, product: LocalProduct) {
    this.askDelete(event, product);
  }

  showQuoteModal(isShowModal: boolean) {
    this.quoteDetailsVisible = isShowModal;
  }

  submit() {
    if (!this.quoteForm.valid) {
      this.onErrorMessage('Un élément du formulaire est éronné');
      return;
    }

    if (this.productsCart !== undefined && this.productsCart.length < 1) {
      this.onErrorMessage(`Vous n'avez aucun produit dans votre panier`);
      this.emptyForm();
      this.showQuoteModal(false);
      return;
    }

    const quoteRequest = this.constructQuoteRequest();
    this.subscriptions.push(
      this.firebaseService
        .saveQuoteRequest(quoteRequest)
        .pipe(
          tap(() => {
            this.emptyForm();
            this.productService.emptyCart()
            this.showQuoteModal(false)
            this.onSuccessMessage('Votre requête à été soumise');
            this.router.navigate([''])
          })
        )
        .subscribe()
    );
  }

  constructQuoteRequest(): QuoteRequest {
    return {
      id: '',
      email: this.quoteForm.get('email')!.value!,
      phoneNumber: this.quoteForm.get('phoneNumber')!.value!,
      products: this.productsCart,
      details: '',
      creationDate: undefined,
      isHandled: false,
    };
  }

  emptyForm() {
    this.quoteForm.reset();
    this.productsCart = [];
    this.productService.removeFromCarts;
  }

  onSuccessMessage(message: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Confirmation',
      detail: message,
      life: 3000,
    });
  }

  onErrorMessage(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: message,
      life: 3000,
    });
  }
}
