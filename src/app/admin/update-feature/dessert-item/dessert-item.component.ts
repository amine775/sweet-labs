import { Component, Input, OnInit } from '@angular/core';
import { Dessert } from '../../../domains/dessert';
import { CurrencyPipe, ImageLoader, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-dessert-item',
  standalone: true,
  imports: [NgOptimizedImage, CurrencyPipe],
  templateUrl: './dessert-item.component.html',
  styleUrl: './dessert-item.component.scss'
})
export class DessertItemComponent implements OnInit {
  
  @Input() dessert: Dessert = {
    id: '',
    label: '',
    recipe: '',
    price: 0.0,
    imageUri: '',
    category: ''
  }


  ngOnInit(): void {
    
  }

}
