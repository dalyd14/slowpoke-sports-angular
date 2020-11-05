import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  constructor(private authService: AuthService, private router: Router) {}

  error: string = null;
  
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authService.signin(email, password).subscribe( 
      resData => {
        this.router.navigate([''])
      },
      errorMessage => {
        this.error = errorMessage
      }
    );
    form.resetForm()
  }

  onResetForm(form: NgForm) {
    form.resetForm()
  }
}