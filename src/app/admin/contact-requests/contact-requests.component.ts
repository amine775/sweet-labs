import { Component, inject, OnDestroy } from "@angular/core";
import { FirestoreService } from "../../services/firebase/database/firestore.service";
import { CommonModule } from "@angular/common";
import { SortByDatePipe } from "../../pipes/sort-by-date.pipe";
import { TableModule } from "primeng/table";
import { ConfirmationService, MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { ContactRequest } from "../../domains/contact-request";
import { TimestampToDatePipe } from "../../pipes/timestamp-to-date.pipe";
import { catchError, Subscriber, Subscription, tap } from "rxjs";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-users-requests",
  standalone: true,
  imports: [
    CommonModule,
    SortByDatePipe,
    TimestampToDatePipe,
    TableModule,
    ConfirmPopupModule,
    ToastModule,
    ButtonModule
  ],
  templateUrl: "./contact-requests.component.html",
  styleUrl: "./contact-requests.component.scss",
  providers: [MessageService, ConfirmationService],
})
export class ContactRequestsComponent implements OnDestroy {
  firebaseService = inject(FirestoreService);

  requests$ = this.firebaseService.getAllContactRequest();

  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  contactRequests: ContactRequest[] = [];
  subscriptions: Subscription[] = [];

  constructor() {
    this.subscriptions.push(
      this.requests$.subscribe((datas) => {
        this.contactRequests = [...datas];
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe);
  }

  confirmArchive(event: Event, request: ContactRequest) {
    this.confirmationService.confirm({
      message: "Voulez vous archivez ce message?",
      header: "Archiver",
      icon: "pi pi-exclamation-triangle",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: "Oui",
      rejectLabel: "Non",

      accept: () => {
        this.archive(request);

        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      },
    });
  }

  archive(request: ContactRequest) {
    this.firebaseService.archiveRequest(request, 'contact').pipe(
      tap(() => {
        this.contactRequests.filter(requestInArray => requestInArray.id !== request.id)
        this.onSuccess()
      }),
      catchError((error) => {
        this.onError();
        return error;
      })
    );
  }

  onSuccess() {
    this.messageService.add({
      severity: "info",
      summary: "Confirmation",
      detail: "Message archivé",
    });
  }

  onError() {
    this.messageService.add({
      severity: "error",
      summary: "Erreur",
      detail: "Une erreur est survenue",
    });
  }
}
