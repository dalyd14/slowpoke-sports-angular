import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auntentication/authentication.service';
import { ThisLeagueService } from '../league/leagueModels/thisLeague.service';
import { LeagueInfo } from '../league/leagueModels/leagueInfo.model';

@Component({
  selector: 'app-websiteHeader',
  templateUrl: './websiteHeader.component.html',
  styleUrls: ['./websiteHeader.component.css']
})
export class WebsiteHeaderComponent implements OnInit, OnDestroy{
  private ownerSub: Subscription;
  isAuthenticated = false;

  constructor (private authService: AuthService){}

  ngOnInit(){
    this.ownerSub = this.authService.ownerFirebase.subscribe(user => {
      this.isAuthenticated = !user ? false:true;
    });
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.ownerSub.unsubscribe();
  }
}