import { CommonModule } from "@angular/common";
import { Component, OnInit, signal, WritableSignal } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { StyleClassModule } from "primeng/styleclass";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { FloatLabelModule } from "primeng/floatlabel";
import { AnimateOnScrollModule } from "primeng/animateonscroll";
import {
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from "@angular/forms";

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
    ReactiveFormsModule,
    AnimateOnScrollModule,
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


  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
