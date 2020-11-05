import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/auntentication/authentication.service';
import { Owner } from '../owner.model';

@Component({
  selector: 'app-displayLeagues',
  templateUrl: './displayLeagues.component.html',
  styleUrls: ['./displayLeagues.component.css']
})
export class DisplayLeaguesComponent implements OnInit {

  isAuthenticated = false;

  myOwner = {} as Owner;

  isNull = true;
  
  constructor(private authService: AuthService, private router:Router) {
  }

  ngOnInit() {
    this.authService.ownerDB.subscribe((res:Owner) => {
      if (res) {
        this.isNull = res.leagues[0] == null;
        this.isAuthenticated = true;
        this.myOwner = res;        
      }
    })
  }

  onClick(leagueID:string) {
    this.router.navigate(['leagues/'+leagueID])
  }

}
