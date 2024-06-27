import { Component } from '@angular/core';
import { CarouselComponent } from './carousel/carousel.component';
import { CategoryComponent } from './category/category.component';
import { BestSellerComponent } from './best-seller/best-seller.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, CategoryComponent, BestSellerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
