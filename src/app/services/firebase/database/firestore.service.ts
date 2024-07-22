import { Injectable, OnInit, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  getCountFromServer,
  query,
  orderBy,
  startAfter,
  endBefore,
  limit,
} from '@angular/fire/firestore';
import { AddDessertRequest } from '../../../domains/add-dessert-request';
import * as uuid from 'uuid';
import {
  BehaviorSubject,
  Observable,
  catchError,
  from,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { Dessert } from '../../../domains/dessert';
import { endAt, getDoc, limitToLast, where } from 'firebase/firestore';
import { ContactRequest } from '../../../domains/contact-request';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService implements OnInit {
  private bsDesserts = new BehaviorSubject<Dessert[] | undefined>(undefined);
  desserts$: Observable<Dessert[] | undefined> = this.bsDesserts.asObservable();

  ngOnInit(): void {}

  constructor() {}

  firestore = inject(Firestore);
  DESSERT_COLLECTION = 'dessert';
  CONTACT_COLLECTION = 'contact';

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

  saveContactRequest(addContactRequest: ContactRequest): Observable<void> {
    return from(
      setDoc(doc(this.firestore, this.CONTACT_COLLECTION, uuid.v4()), {
        id: uuid.v4(),
        email: addContactRequest.email,
        phoneNumber: addContactRequest.phoneNumber,
        details: addContactRequest.details,
        isHandled: addContactRequest.isHandled
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

    setDoc(
      docRef,
      {
        id: updatedDessert.id,
        label: updatedDessert.label,
        recipe: updatedDessert.recipe,
        price: `${updatedDessert.price}`,
        imageUri: updatedDessert.imageUri,
        category: updatedDessert.category,
      },
      { merge: true }
    );
    return from(
      updateDoc(docRef, {
        label: updatedDessert.label,
        recipe: updatedDessert.recipe,
        price: `${updatedDessert.price}`,
        imageUri: updatedDessert.imageUri,
        category: updatedDessert.category,
      })
    ).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  getAll(): Observable<Dessert[]> {
    return from(
      getDocs(collection(this.firestore, this.DESSERT_COLLECTION))
    ).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => {
          let data = doc.data() as Dessert;
          return data;
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

  async countDesserts(filter:string[]): Promise<number> {
    const dessertsCollection = collection(this.firestore, this.DESSERT_COLLECTION);
    const q = query(dessertsCollection, where('category', 'in', filter))
    const dessertsSnapshots = await getCountFromServer(q);
    return dessertsSnapshots.data().count;
  }

  fetchNextPage(
    pageSize: number,
    lastDocumentOfCurrentPage: Dessert | undefined,
    filter: string[]
  ): Observable<Dessert[] | undefined> {
    const collectionRef = collection(this.firestore, this.DESSERT_COLLECTION);

    if (lastDocumentOfCurrentPage) {
      const docRef = doc(
        this.firestore,
        this.DESSERT_COLLECTION,
        lastDocumentOfCurrentPage.id
      );

      return from(getDoc(docRef)).pipe(
        switchMap((docSnapshot) => {
          const queryRef = query(
            collectionRef,
            orderBy('id'),
            where('category', 'in', filter),
            startAfter(docSnapshot),
            limit(pageSize)
          );
          return from(getDocs(queryRef)).pipe(
            map((querySnapshot) =>
              querySnapshot.docs.map((doc) => {
                const data = doc.data() as Dessert;
                data.id = doc.id;
                return data;
              })
            )
          );
        })
      );
    } else {
      return this.fetchFirstPage(pageSize, filter).pipe(
        tap((result) => {
          this.bsDesserts.next(result);
        })
      );
    }
  }

  fetchFirstPage(
    pageSize: number = 10,
    filter: string[]
  ): Observable<Dessert[] | undefined> {
    console.log(filter)
    const collectionRef = collection(this.firestore, this.DESSERT_COLLECTION);
    const queryRef = query(
      collectionRef,
      orderBy('id'),
      where('category', 'in', filter),
      limit(pageSize)
    );
    return from(getDocs(queryRef)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as Dessert;
          data.id = doc.id;
          return data;
        })
      )
    );
  }

  fetchPreviousPage(
    pageSize: number,
    firstDocumentOfCurrentPage: Dessert,
    filter: string[]
  ): Observable<Dessert[] | undefined> {
    const collectionRef = collection(this.firestore, this.DESSERT_COLLECTION);

    const docRef = doc(
      this.firestore,
      this.DESSERT_COLLECTION,
      firstDocumentOfCurrentPage.id
    );

    return from(getDoc(docRef)).pipe(
      switchMap((docSnapshot) => {
        const queryRef = query(
          collectionRef,
          orderBy('id'),
          where('category', 'in', filter),
          endBefore(docSnapshot),
          limitToLast(pageSize)
        );
        return from(getDocs(queryRef)).pipe(
          map((querySnapshot) =>
            querySnapshot.docs.map((doc) => {
              const data = doc.data() as Dessert;
              data.id = doc.id;
              return data;
            })
          )
        );
      })
    );
  }
}
