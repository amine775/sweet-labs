import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { BehaviorSubject, Observable, catchError, from, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private fireAuth = inject(Auth);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  private hasToken(): boolean {
    if (typeof window !== 'undefined' && localStorage.getItem('auth_token')) {
      return !!localStorage.getItem('auth_token');
    }
    return false;
  }

  signIn(username: string, password: string): Observable<boolean> {
    signInWithEmailAndPassword(this.fireAuth, username, password)
    return from(signInWithEmailAndPassword(this.fireAuth, username, password)).pipe(
      tap(result => {
        localStorage.setItem('auth_token', result.user?.uid || '');
        this.isAuthenticatedSubject.next(true);
      }),
      map(() => true),
      catchError(() => {
        this.isAuthenticatedSubject.next(false);
        return of(false);
      })
    );
  }

  logout() {
    this.fireAuth.signOut();
    localStorage.removeItem('auth_token');
    this.isAuthenticatedSubject.next(false);
  }
}