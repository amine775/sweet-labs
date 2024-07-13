import { Injectable, inject } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytes, deleteObject } from '@angular/fire/storage';
import { error } from 'console';
import { Observable, catchError, from,  switchMap,  } from 'rxjs';
import * as uuid from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  STORAGE_REPO = 'desserts/'

  firebaseStorage = inject(Storage)
  
  constructor() {
  }
  

  storeFile(file: File):Observable<string> {

    const extension = file.name.substring(file.name.lastIndexOf('.'));


    const filePath = this.STORAGE_REPO + uuid.v4() + extension
    const fileRef = ref(this.firebaseStorage, filePath);
    const task = uploadBytes(fileRef, file);

    return from(task).pipe(
      switchMap((result) => getDownloadURL(result.ref)),
      catchError((error) => {
        throw error;
      })
    );
  }

  removeFile(uri: string):Observable<any> {
    const fileRef = ref(this.firebaseStorage, uri);
    const task = deleteObject(fileRef)

    return from(task).pipe(
      catchError((error) => {
        throw error;
      })
    )
  }

}
