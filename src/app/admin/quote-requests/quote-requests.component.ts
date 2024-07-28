import { Component, inject } from '@angular/core';
import { FirestoreService } from '../../services/firebase/database/firestore.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { QuoteRequest } from '../../domains/quote-request';
import { DialogModule } from 'primeng/dialog';
import { TimestampToDatePipe } from '../../pipes/timestamp-to-date.pipe';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-quote-requests',
  standalone: true,
  imports: [CommonModule, TableModule, DialogModule, TimestampToDatePipe, ButtonModule],
  templateUrl: './quote-requests.component.html',
  styleUrl: './quote-requests.component.scss',
})
export class QuoteRequestsComponent {
  firebaseService = inject(FirestoreService);
  quoteRequests$ = this.firebaseService.getAllQuoteRequest();
  dialogVisible: boolean = false;
  quoteToShow?: QuoteRequest;

  showDialog(targetQuote: QuoteRequest, visible: boolean) {
    this.dialogVisible = visible;
    this.quoteToShow = targetQuote;
  }

  archive(quote: QuoteRequest) {
    this.firebaseService.archiveRequest(quote, 'quote')
  }
}
