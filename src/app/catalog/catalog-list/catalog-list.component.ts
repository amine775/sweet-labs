import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dessert } from '../../domains/dessert';

@Component({
  selector: 'app-catalog-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog-list.component.html',
  styleUrl: './catalog-list.component.scss'
})
export class CatalogListComponent {
  categories = [
    {
      label: 'Tiramisu', 
      title: 'Les tiramisus'
    },{
      label: 'Cheesecake', 
      title: 'Les cheesecakes'
    },{
      label: 'Cookie', 
      title: 'Les cookies'
    },
  ]

  @Input() desserts: Dessert[] = [];
  @Output() dessertToAdd: EventEmitter<Dessert> = new EventEmitter();


  onAddDessert(dessertToAdd: Dessert) {
    this.dessertToAdd.emit(dessertToAdd);
  }

}
