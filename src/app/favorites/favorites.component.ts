import { Component, inject } from '@angular/core';
import { ProductService } from '../services/product/product.service';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ListFavoritesComponent } from './list-favorites/list-favorites.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, ListFavoritesComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {

}
