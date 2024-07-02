import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StorageService } from '../../services/firebase/storage/storage.service';
import { AddDessertRequest } from '../../domains/add-dessert-request';
import { FirestoreService } from '../../services/firebase/database/firestore.service';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-feature',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-feature.component.html',
  styleUrl: './add-feature.component.scss'
})
export class AddFeatureComponent {

  categories: string [] = [
    'Tiramisu', 'Cheesecake', 'Brownie', 'Cookie'
  ]

  storage = inject(StorageService)
  firestore = inject(FirestoreService)
  alertService = inject(AlertService)
  isLoading = false

  addForm = new FormGroup ({
    label: new FormControl('', [Validators.required]),
    recipe: new FormControl('', [Validators.required]),
    price: new FormControl(0.0, [Validators.min(0.0)]),
    image: new FormControl<File | null>(null, [Validators.required]),
    category: new FormControl('', [Validators.required])
  })

  error: string | null = null

  submit() {
    this.error = null;

    if (this.addForm.invalid) {
      this.error = 'Form is not valid. Please fill out all required fields correctly.';
      return;
    }

    const file = this.addForm.value.image;

    if (file instanceof File) {
      this.isLoading = true
      this.storage.storeFile(file).subscribe({
        next: (uri) => {
          console.log(uri)
          const object = this.constructRequest(uri)
          this.firestore.saveDessert(object).subscribe(
            () => {
              this.alertService.success('Dessert bien ajouté')
              this.isLoading = false
              this.emptyForm();
            },
            (error) => {
              this.error = 'Une erreur est survenue'
            }
          )
        }
      });
    } else {
      this.error = 'Invalid file type. Please select a valid file.';
    }
  }

  onFileChange(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.addForm.patchValue({
        image: file
      });
    }
  }

  constructRequest(imageUri: string): AddDessertRequest {
    return  {
      label: this.addForm.value.label!,
      recipe: this.addForm.value.recipe!,
      price: this.addForm.value.price as number,
      category: this.addForm.value.category,
      imageUri: imageUri
    } as AddDessertRequest
  }

  emptyForm() {
   this.addForm.reset();
   (<HTMLInputElement>document.getElementById('image')).value = "";
  }

}
