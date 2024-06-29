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
  showMoreFeature = false;


toggleShowMoreFeature() {
  let extraHeight = 160;
  this.showMoreFeature = !this.showMoreFeature;
  if (this.showMoreFeature) {
    let containers = [document.getElementsByClassName('features-container')[0] as HTMLElement,
      document.getElementsByClassName('features-info')[0] as HTMLElement,
      document.getElementsByClassName('features-info-text')[0] as HTMLElement
    ]
    for (let container of containers) {
      let actualContainerHeight = container.clientHeight;
      let newContainerHeight = actualContainerHeight + extraHeight;
      container.style.height = `${newContainerHeight}px`;
    }

  } else {
    let containers = [document.getElementsByClassName('features-container')[0] as HTMLElement,
      document.getElementsByClassName('features-info')[0] as HTMLElement,
      document.getElementsByClassName('features-info-text')[0] as HTMLElement
    ]
    for (let container of containers) {
      let actualContainerHeight = container.clientHeight;
      let newContainerHeight = actualContainerHeight - extraHeight;
      container.style.height = `${newContainerHeight}px`;
    }
  }
}

}
