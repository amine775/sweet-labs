import { Injectable, OnInit, inject } from '@angular/core';
import {  Firestore, doc, setDoc, collection, getDocs  } from '@angular/fire/firestore'
import { AddDessertRequest } from '../../../domains/add-dessert-request';
import * as uuid from 'uuid';
import { Observable, catchError, from } from 'rxjs';
import { Dessert } from '../../../domains/dessert';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService  implements OnInit {

  ngOnInit(): void {
    console.log('test')
    this.getAll();
  }

  firestore = inject(Firestore)
  DESSERT_COLLECTION = 'dessert';

  saveDessert(addDessertRequest: AddDessertRequest): Observable<void> {
    return from(setDoc(doc(this.firestore, this.DESSERT_COLLECTION, uuid.v4()), {
      id: uuid.v4(),
      label: addDessertRequest.label,
      recipe: addDessertRequest.recipe,
      price: addDessertRequest.price,
      imageUri: addDessertRequest.imageUri, 
      category: addDessertRequest.category
    })).pipe(
      catchError(err =>  {
        throw err
      })
    )
  }


  getAll() {
    getDocs(collection(this.firestore, this.DESSERT_COLLECTION)).then(
      (response) => {
        console.log(response)
      }
    )

  }


}
