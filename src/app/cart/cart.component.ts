import { Component, inject, OnInit } from "@angular/core";
import { DataViewModule } from "primeng/dataview";
import { ButtonModule } from "primeng/button";
import { SliderModule } from "primeng/slider";
import { InputTextModule } from "primeng/inputtext";
import { CommonModule } from "@angular/common";
import { ProductService } from "../services/product/product.service";
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { LocalProduct } from "../domains/local-product";
import { ToastModule } from "primeng/toast";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  selector: "app-cart",
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
    FormsModule
  ],
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.scss",
  providers: [ConfirmationService, MessageService],
})
export class CartComponent implements OnInit {
  productService = inject(ProductService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  products$ = this.productService.carts$;

  productsCart: LocalProduct[] = [];

  quoteForm = new FormGroup({
    name: new FormGroup('', Validators.required),
    email: new FormGroup('', Validators.required),
    phoneNumber: new FormGroup('', Validators.required),
    details: new FormGroup('')
  })

  ngOnInit(): void {
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
    });
  }

  askDelete(event: Event, product: LocalProduct) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Voulez vous vraiment supprimer ce dessert?",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-sm",
      acceptLabel: 'Oui', 
      rejectLabel: 'Non',
      accept: () => {
        this.productService.removeFromCarts(product);
        this.messageService.add({
          severity: "info",
          summary: "Confirmation",
          detail: "Dessert supprimé",
          life: 3000,
        });
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

  submit() {
    
  }
}
