import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../authentication.service';
import { Router } from '@angular/router';
import { Owner } from '../../owner/owner.model'
import { CallAPI } from 'src/app/callAPI/callAPI';
import { take, filter } from 'rxjs/operators';

interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private authService: AuthService, private callAPI: CallAPI, private router: Router) {}

  error: string = null;
  
  onSubmit(form: NgForm) {
    
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    const firstName = form.value.firstName;
    const lastName = form.value.lastName;

    this.authService.signup(email, password).then( 
      (resData : AuthResponseData) => {
        const newOwner: Owner = {
          'currentSession' : resData.idToken,
          'ownerID' : resData.localId,
          'ownerEmail' : resData.email,
          'ownerFirstName' : firstName,
          'ownerLastName' : lastName,
          'leagues' : new Array(),
          'dateSignedUp' : new Date(),
          'favoriteNFLTeam' : null,
          'favoriteCollegeTeam' : null,
        }
        this.authService.ownerDB.next(newOwner)
      }).catch(
        x => Promise.reject(x)      
      ).then(
        null,
        err => {
          this.error = err;
          console.log(err)
        }
      );

    this.authService.ownerDB.pipe(filter(val => val != null),take(1)).subscribe((res: Owner) => {
      if (res) {
        this.callAPI.addNewOwnerAPI(res).pipe(take(1)).subscribe( (res: {response_message: string} ) => {
          if(res.response_message != "Owner Added"){
            this.error = res.response_message
          } else {
            this.router.navigate([''])
          }
        })
      }
    })
    form.resetForm()
  }

  onResetForm(form: NgForm) {
    form.resetForm()
  }
}