import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ContactRequest } from "../domains/contact-request";
import { FirestoreService } from "../services/firebase/database/firestore.service";
import { AlertService } from "../services/alert.service";

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [
    InputTextModule,
    InputTextareaModule,
    FloatLabelModule,
    ReactiveFormsModule,
    ButtonModule
  ],
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.scss",
})
export class ContactComponent {

  firebaseService = inject(FirestoreService)
  alertService = inject(AlertService)

  contactForm = new FormGroup({
    name: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    phoneNumber: new FormControl("", Validators.required),
    details: new FormControl(""),
  });
  contact: ContactRequest = {
    id: undefined,
    name: "",
    email: "",
    phoneNumber: "",
    details: "",
    creationDate: new Date(),
    isHandled: false
  };

  submit() {
    if (this.contactForm.invalid) {
      return;
    }
    this.contact.name = this.contactForm.get("name")!.value!;
    this.contact.email = this.contactForm.get("email")!.value!;
    this.contact.phoneNumber = this.contactForm.get("phoneNumber")!.value!;
    this.contact.details = this.contactForm.get("details")!.value!;

    this.firebaseService.saveContactRequest(this.contact)
    this.alertService.success('Votre formulaire de contact à bien été envoyé')

    this.contactForm.reset();
  }

}
