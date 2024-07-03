import { Component } from '@angular/core';
import { CarouselComponent } from './carousel/carousel.component';
import { CategoriesComponent } from './categories/categories.component';
import { BestSellerComponent } from './best-seller/best-seller.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, CategoriesComponent, BestSellerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
}
