import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../services/product/product.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-list-favorites',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './list-favorites.component.html',
  styleUrl: './list-favorites.component.scss'
})
export class ListFavoritesComponent {

  productService = inject(ProductService)
  $favorites = toSignal(this.productService.favorites$)

}
