import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FirestoreService } from '../../services/firebase/database/firestore.service';
import { Dessert } from '../../domains/dessert';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { InputNumberModule } from 'primeng/inputnumber';
import { StorageService } from '../../services/firebase/storage/storage.service';

@Component({
  selector: 'app-update-feature',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    RippleModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    InputTextModule,
    InputTextareaModule,
    CommonModule,
    FileUploadModule,
    DropdownModule,
    TagModule,
    RadioButtonModule,
    RatingModule,
    InputTextModule,
    FormsModule,
    InputNumberModule,
    NgOptimizedImage,
  ],
  templateUrl: './admin-feature.component.html',
  styleUrl: 'admin-feature.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class AdminFeatureComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  firestore = inject(FirestoreService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  primengConfig = inject(PrimeNGConfig);
  storage = inject(StorageService);

  desserts: Dessert[] = [
    {
      id: '',
      label: '',
      recipe: '',
      price: 0.0,
      imageUri: '',
      category: '',
    },
  ];

  categories: string[] = ['Tiramisu', 'Cheesecake', 'Brownie', 'Cookie'];

  dessert: Dessert = {
    id: '',
    label: '',
    recipe: '',
    price: 0.0,
    imageUri: '',
    category: '',
  };

  submitted: boolean = false;
  dessertDialog = false;
  selectedDesserts: Dessert[] | null = [];
  newFile: File | null = null;

  ngOnInit(): void {
    this.firestore.getAllDessert().subscribe((desserts) => {
      this.desserts = desserts;
    });
  }

  openNew() {
    this.dessert = {
      id: '',
      label: '',
      recipe: '',
      price: 0.0,
      imageUri: '',
      category: '',
    };
    this.submitted = false;
    this.dessertDialog = true;
  }

  deleteSelectedDesserts() {
    this.confirmationService.confirm({
      message: 'Voulez vous vraiment supprimer ces éléments?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedDesserts?.forEach((dessert) => {
          if (!this.deleteDessertFromDatabase(dessert)) return;
        });
        this.desserts = this.desserts.filter(
          (val) => !this.selectedDesserts?.includes(val)
        );
        this.selectedDesserts = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Produit(s) supprimé(s)',
          life: 3000,
        });
      },
    });
  }

  showEditDialog(dessert: Dessert) {
    this.dessert = { ...dessert };
    this.dessertDialog = true;
  }

  deleteDessert(dessert: Dessert) {
    this.confirmationService.confirm({
      message: 'Êtes vous sure de supprimer ' + dessert.label + '?',
      header: 'Suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteDessertFromDatabase(dessert)
          .then(() => {
            this.desserts = this.desserts.filter(
              (val) => val.id !== dessert.id
            );
            this.dessert = {
              id: '',
              label: '',
              recipe: '',
              price: 0.0,
              imageUri: '',
              category: '',
            };
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Produit supprimé',
              life: 3000,
            });
          })
          .catch((error) => {});
      },
    });
  }

  deleteDessertFromDatabase(dessert: Dessert): Promise<void> {
    return new Promise((resolve, reject) => {
      this.firestore.deleteDessert(dessert).subscribe({
        next: () => {
          this.deleteImageFromDatabase(dessert.imageUri).then(() => {
            console.log('imageUri not deleted : ' + dessert.imageUri);
          });
          resolve();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail:
              'Impossible de supprimer le produit, veuillez réessayer ultérieurement',
            life: 3000,
          });
          reject();
        },
      });
    });
  }

  deleteImageFromDatabase(imageUri: string): Promise<void> {
    if (
      imageUri === undefined ||
      typeof imageUri !== 'string' ||
      imageUri.length < 1
    ) {
      return new Promise((resolve, reject) => {
        resolve();
      });
    }

    return new Promise((resolve, reject) => {
      this.storage.removeFile(imageUri).subscribe({
        next: () => {
          resolve();
        },
        error: (err) => {
          console.error('Error deleting file:', err);
          reject(err);
        },
      });
    });
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  onFileChange(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.newFile = file;
    }
  }

  saveDessert() {
    this.submitted = true;

    if (this.dessert.label?.trim()) {
      if (this.dessert.id) {
        this.storeImageThenDessert(this.newFile as File, Actions.UPDATE).then(() => {
          this.desserts[this.findIndexById(this.dessert.id)] = this.dessert;
        });
      } else {
        this.storeImageThenDessert(this.newFile as File, Actions.ADD);
      }

      this.desserts = [...this.desserts];
      this.dessertDialog = false;
    }
  }

  storeImageThenDessert(image: File, action: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (Actions.ADD === action) {
        if (image === undefined || !(image instanceof File)) {
          this.newFile === null;
          reject();
          return;
        }
      } else if (Actions.UPDATE === action ) {
        if (image === undefined || !(image instanceof File)) {
          this.editDessert()
            .then(() => {
              resolve()
            })
            .catch((error => {
              reject()
            }))
            return;
        }
      }
      this.storage.storeFile(image).subscribe({
        next: (uri) => {
          this.dessert.imageUri = uri;

          if (Actions.ADD === action) {
            this.storeDessert();
          } else if (Actions.UPDATE === action) {
            this.editDessert();
          }
        },
      });
    });
  }

  editDessert(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.firestore.updateDessert(this.dessert).subscribe({
        next: () => {
          this.desserts = this.desserts.map(dessert => {
            if (dessert.id === this.dessert.id) {
              return this.dessert
            }
            return dessert
          })
          resolve();
        },
        error: (error) => {
          this.onErrorCreateOrUpdateDessert();
          reject();
        },
        complete: () => {
          this.onDessertCreatedOrUpdated();
          resolve();
        }
      });
    })
  }

  storeDessert(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.firestore.saveDessert(this.dessert).subscribe({
        next: (success) => {
          this.desserts.push(this.dessert)
          this.onDessertCreatedOrUpdated();
          resolve();
        },
        error: (error) => {
          this.onErrorCreateOrUpdateDessert();
          reject();
        },
      });
    })
  }

  onDessertCreatedOrUpdated() {
    this.dessert = {
      id: '',
      label: '',
      recipe: '',
      price: 0.0,
      imageUri: '',
      category: '',
    };
    this.messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Dessert créé',
      life: 3000,
    });
  }

  onErrorCreateOrUpdateDessert() {
    this.messageService.add({
      severity: 'error',
      summary: 'Echec',
      detail: 'Echec lors de la création/modification du dessert',
      life: 3000,
    });
  }

  findIndexById(id: string) {
    let index = -1;
    for (let i = 0; i < this.desserts.length; i++) {
      if (this.desserts[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }
  hideDialog() {
    this.dessertDialog = false;
    this.submitted = false;
  }
}

enum Actions {
  ADD = 'Ajouter',
  UPDATE = 'Modifier',
}
