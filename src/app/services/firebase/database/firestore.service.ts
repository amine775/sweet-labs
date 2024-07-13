import { Injectable, OnInit, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { AddDessertRequest } from '../../../domains/add-dessert-request';
import * as uuid from 'uuid';
import { Observable, catchError, from, map, tap } from 'rxjs';
import { Dessert } from '../../../domains/dessert';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService implements OnInit {

  ngOnInit(): void {
  }

  firestore = inject(Firestore);
  DESSERT_COLLECTION = 'dessert';

  saveDessert(addDessertRequest: AddDessertRequest): Observable<void> {
    return from(
      setDoc(doc(this.firestore, this.DESSERT_COLLECTION, uuid.v4()), {
        id: uuid.v4(),
        label: addDessertRequest.label,
        recipe: addDessertRequest.recipe,
        price: addDessertRequest.price,
        imageUri: addDessertRequest.imageUri,
        category: addDessertRequest.category,
      })
    ).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  updateDessert(updatedDessert: Dessert): Observable<void> {
    let docRef = doc(
      this.firestore,
      this.DESSERT_COLLECTION,
      updatedDessert.id
    );

    console.log(docRef)
    setDoc(docRef, {
      id: updatedDessert.id,
      label: updatedDessert.label,
      recipe: updatedDessert.recipe,
      price: `${updatedDessert.price}`,
      imageUri: updatedDessert.imageUri, 
      category: updatedDessert.category
    }, {merge: true})
    return from(
      updateDoc(docRef, {
        label: updatedDessert.label,
        recipe: updatedDessert.recipe,
        price: `${updatedDessert.price}`,
        imageUri: updatedDessert.imageUri, 
        category: updatedDessert.category
      })
    ).pipe(
      tap((success) => {
        console.log(success)
      }),
      catchError(error => {
        throw error
      })
    )
  }

  getAll(): Observable<Dessert[]> {
    return from(
      getDocs(collection(this.firestore, this.DESSERT_COLLECTION))
    ).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => {
          return doc.data() as Dessert;
        });
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  deleteDessert(dessert: Dessert): Observable<any> {
    const docRef = doc(this.firestore, this.DESSERT_COLLECTION, dessert.id);

    return from(deleteDoc(docRef)).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }
}
