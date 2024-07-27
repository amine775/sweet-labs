import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../services/firebase/authentication/authentication.service';
import { BadgeModule } from 'primeng/badge';
import { ProductService } from '../services/product/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  authService = inject(AuthenticationService)
  productService = inject(ProductService)

  isDisplayMenu = false;

  toggleDisplayMenu(toggle: boolean | undefined = undefined) {
    if (toggle !== undefined) {
      this.isDisplayMenu = toggle
      return;
    }
    this.isDisplayMenu = !this.isDisplayMenu;
  }

  logout() {
    this.authService.logout();
  }

}
