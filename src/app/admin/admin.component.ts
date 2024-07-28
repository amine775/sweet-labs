import { Component, inject, OnInit } from '@angular/core';
import { Route, Router, RouterModule, RouterOutlet, provideRouter } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
 
  
  private router = inject(Router)

  title: string = 'Administration'

  SELECTED_FEATURE_CLASS = 'feature-active';

  ADMIN_FEATURES = 'admin-features'
  CONTACT_REQUEST = 'contact-requests'
  QUOTE_REQUEST = 'quote-requests'

  ngOnInit(): void {
    const features = document.getElementsByClassName('feature')
    for(let index = 0; index < features.length; index++) {
      features[index].classList.remove(this.SELECTED_FEATURE_CLASS)
    }
    if (this.router.url.indexOf(this.ADMIN_FEATURES) !== -1) {
      document.getElementById(this.ADMIN_FEATURES)?.classList.add(this.SELECTED_FEATURE_CLASS)
      this.title = 'Gestion des desserts'
      return;
    }
    if (this.router.url.indexOf(this.CONTACT_REQUEST) !== -1) {
      document.getElementById(this.CONTACT_REQUEST)?.classList.add(this.SELECTED_FEATURE_CLASS)
      this.title = 'Demande de contact'
      return;
    }
    if (this.router.url.indexOf(this.QUOTE_REQUEST) !== -1) {
      document.getElementById(this.QUOTE_REQUEST)?.classList.add(this.SELECTED_FEATURE_CLASS)
      this.title = 'Demande de devis'
      return;
    }
  }

  selectFeature(featureId: string) {
    this.removeSelectedFeature();
    document.getElementById(featureId)?.classList.add(this.SELECTED_FEATURE_CLASS);

    if(featureId === this.ADMIN_FEATURES) {
      this.router.navigate([`admin/${this.ADMIN_FEATURES}`])
      this.title = 'Gestion des desserts'
      return;
    }
    if(featureId === 'contact-requests') {
      this.router.navigate([`admin/${this.CONTACT_REQUEST}`])
      this.title = 'Demande de contact'
      return;
    }
    if(featureId === 'quote-requests') {
      this.router.navigate([`admin/${this.QUOTE_REQUEST}`])
      this.title = 'Demande de devis'
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