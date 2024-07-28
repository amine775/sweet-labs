import { Component, inject } from '@angular/core';
import { Route, Router, RouterModule, RouterOutlet, provideRouter } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  
  private router = inject(Router)

  SELECTED_FEATURE_CLASS = 'feature-active';

  selectFeature(featureId: string) {
    this.removeSelectedFeature();
    document.getElementById(featureId)?.classList.add(this.SELECTED_FEATURE_CLASS);

    if(featureId === 'admin-features') {
      this.router.navigate(['admin/admin-features'])
      return;
    }
    if(featureId === 'contact-requests') {
      this.router.navigate(['admin/contact-requests'])
      return;
    }
    if(featureId === 'quote-requests') {
      this.router.navigate(['admin/quote-requests'])
      return;
    }
  }

  private removeSelectedFeature() {
    let actualSelectedFeature = document.getElementsByClassName(this.SELECTED_FEATURE_CLASS);
    if (actualSelectedFeature !== undefined && actualSelectedFeature.length > 0) {
      actualSelectedFeature[0].classList.remove(this.SELECTED_FEATURE_CLASS);
    }
  }

}