import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent implements OnInit, OnDestroy {

  private subscription: Subscription | null = null;
  message : {
    type: string, 
    text: string
  } | null = {
    type: '', 
    text: ''
  } ;
  alertContainer : HTMLElement | null = null
  document = inject(DOCUMENT)
  constructor(private alertService: AlertService) { }

  ngOnInit() {
    if (typeof this.document !== undefined) {
      this.alertContainer = this.document.getElementById('alert-container')
    }

    this.subscription = this.alertService.getAlert()
      .subscribe(message => {
        console.log(message)
        switch (message && message.type) {
          case 'success':
            this.showAlert('success')
            break;
          case 'error':
            this.showAlert('error')
            break;
        }
        this.message = message;
        this.hideAlert();
      });
  }

  showAlert(type: string) {
    this.alertContainer?.classList.add(type)
    this.alertContainer?.classList.add('alert-container')
  }


  hideAlert() {
    this.alertContainer?.addEventListener('animationend', () => {
      this.alertContainer?.classList.remove('alert-container')
      this.alertContainer?.classList.remove('success')
      this.alertContainer?.classList.remove('error')
      this.message = null;
    })
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}