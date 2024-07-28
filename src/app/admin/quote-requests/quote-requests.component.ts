import { Component, inject } from '@angular/core';
import { FirestoreService } from '../../services/firebase/database/firestore.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { QuoteRequest } from '../../domains/quote-request';
import { DialogModule } from 'primeng/dialog';
import { TimestampToDatePipe } from '../../pipes/timestamp-to-date.pipe';
import { ButtonModule } from 'primeng/button';
import { filter, map } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-quote-requests',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    TimestampToDatePipe,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './quote-requests.component.html',
  styleUrl: './quote-requests.component.scss',
  providers: [MessageService]
})
export class QuoteRequestsComponent {
  firebaseService = inject(FirestoreService);
  messageService = inject(MessageService)

  quoteRequests$ = this.firebaseService.getAllQuoteRequest();
  dialogVisible: boolean = false;
  quoteToShow: QuoteRequest | null = null;

  showDialog(targetQuote: QuoteRequest, visible: boolean) {
    this.dialogVisible = visible;
    this.quoteToShow = targetQuote;
  }

  archive(quote: QuoteRequest) {
    this.firebaseService.archiveRequest(quote, 'quote');
    this.quoteRequests$ = this.quoteRequests$.pipe(
      map((data) => {
        return data.filter((quoteItem) => quoteItem.id !== quote.id);
      })
    );
    this.dialogVisible = false;
    this.quoteToShow = null;
    this.successMessage('Message archivé')
  }

  successMessage(message: string) {
    this.messageService.add({
      severity: "info",
      summary: "Confirmation",
      detail: message,
    });
  }
}
