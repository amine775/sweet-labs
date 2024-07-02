import { Component, inject } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthenticationService } from '../services/firebase/authentication/authentication.service';
import { Login } from '../domains/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  authenticationService = inject(AuthenticationService)
  router = inject(Router)

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  login : Login = {
    username: '', 
    password: ''
  }

  error: string | null = null

  signIn() {
    this.authenticationService.signIn(
      this.login.username,
      this.login.password
    ).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/home'])
      } else {
        this.error = 'Nom de compte ou mot de passe invalide'
      }
    })
  }
  

  submit() {
    this.error = null;
    if (this.loginForm.value.username !== undefined &&
      this.loginForm.value.username!.length > 0
    ) {
      this.login.username = this.loginForm.value.username!
    } else {
      this.error = "Merci de fournir un nom d'utilisateur"
      return;
    }
    if (this.loginForm.value.password !== undefined) {
      this.login.password = this.loginForm.value.password!
    } else {
      this.error = "Merci de fournir un mot de passe "
      return;
    }
    if (this.error !== undefined) {
      this.signIn()
    }
  }
}
