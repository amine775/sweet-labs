import { Component } from '@angular/core';
import { CarouselComponent } from './carousel/carousel.component';
import { CategoriesComponent } from './categories/categories.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { CommitmentComponent } from './commitment/commitment.component';
import { CatalogComponent } from '../catalog/catalog.component';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CarouselComponent,
    CategoriesComponent,
    AboutusComponent,
    CommitmentComponent,
    CatalogComponent,
    AnimateOnScrollModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
