import { CommonModule } from "@angular/common";
import {
  Component,
  OnInit,
  signal,
  WritableSignal,
} from "@angular/core";
import { BehaviorSubject, tap, timer } from "rxjs";
import { StyleClassModule } from "primeng/styleclass";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { FloatLabelModule } from "primeng/floatlabel";
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-events",
  standalone: true,
  imports: [
    CommonModule,
    StyleClassModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    InputTextareaModule,
    FloatLabelModule, 
    ReactiveFormsModule
  ],
  templateUrl: "./events.component.html",
  styleUrl: "./events.component.scss",
})
export class EventsComponent implements OnInit {
  bsImages = new BehaviorSubject([
    "/image/brownie.webp",
    "/image/cheesecake.webp",
    "/image/cookie.webp",
  ]);
  images: string[] | undefined;
  currentImage: WritableSignal<string> = signal("");
  value: any | undefined
  quoteForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]), 
    phoneNumber: new FormControl('', Validators.required),
    details: new FormControl('')
  })
  quote : any | undefined = {
    name: '',
    email: '', 
    phoneNumber: '', 
    details: ''
  }

  ngOnInit(): void {}

  constructor() {
    this.images = this.bsImages.getValue();
    if (this.images) {
      this.currentImage.set(this.images.at(0)!);
    }
  }

  next() {
    if (!this.images) {
      return;
    }
    const currentPosition = this.images?.indexOf(this.currentImage());
    if (currentPosition === this.images.length - 1) {
      this.currentImage.set(this.images.at(0)!);
    } else {
      this.currentImage.set(this.images.at(currentPosition + 1)!);
    }
    console.log(this.currentImage());
  }

  submit() {
    if (this.quoteForm.invalid) {
      return;
    }
    this.quote.name = this.quoteForm.get('name')?.value
    this.quote.email = this.quoteForm.get('email')?.value
    this.quote.phoneNumber = this.quoteForm.get('phoneNumber')?.value
    this.quote.details = this.quoteForm.get('details')?.value
    
    this.quoteForm.reset()
  }


}
