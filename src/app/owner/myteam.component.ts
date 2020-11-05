import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auntentication/authentication.service';
import { Owner } from '../owner/owner.model'
import { take, filter } from 'rxjs/operators';
import { CallAPI } from '../callAPI/callAPI';

@Component({
  selector: 'app-myteam.component',
  templateUrl: './myteam.component.html',
  styleUrls: ['./myteam.component.css']
})
export class MyTeam implements OnInit {
  
  isAuthenticated = false;
  newTeam = false;
  myTeams = false;
  disableButtons = true;

  myOwner = {} as Owner;

  constructor(private authService: AuthService, private callAPI: CallAPI) { }

  ngOnInit() {
    this.authService.ownerDB.pipe(filter(val => val != null)).subscribe((res:Owner) => {
      this.isAuthenticated = true;
      this.myOwner = res;
      this.disableButtons = false;
    })
  }

  switchToggle(event){
    if(event.currentTarget.id == "newTeam") {
      this.newTeam = !this.newTeam;
      this.myTeams = false
    } else if (event.currentTarget.id == "myTeams") {
      this.myTeams = !this.myTeams;
      this.newTeam = false
    }
  }

}
