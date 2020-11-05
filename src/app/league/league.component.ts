import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd, NavigationStart, ActivatedRouteSnapshot } from '@angular/router';
import { take } from 'rxjs/operators';

import { CallAPI } from '../callAPI/callAPI';
import { LeagueTypeInfo } from './leagueModels/leagueTypes.model';
import { LeagueInfo } from './leagueModels/leagueInfo.model';
import { ThisLeagueService } from './leagueModels/thisLeague.service';

@Component({
  selector: 'app-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.css']
})
export class LeagueComponent implements OnInit {

  constructor(
    private thisLeagueService: ThisLeagueService, 
    private callAPI: CallAPI,
    private router: Router, 
    private route: ActivatedRoute) { 
  }

  inProgress: boolean = false;
  errorMessage: string = null;
  
  leagueTypes: LeagueTypeInfo[] = new Array();
  selectedLeagueID: string;
  selectedLeague: LeagueInfo;

  activeRoutes = {
    home : false,
    settings : false,
    draftRoom : false
  }

  ngOnInit() {
    this.inProgress = true;
    this.route.params
    .subscribe(
      (params: Params) => {
        this.inProgress = true
        this.selectedLeagueID = null
        this.selectedLeagueID = params['id'];
        if (this.selectedLeagueID != null) {
          this.callAPI.getLeaguesAPI(this.selectedLeagueID)
            .pipe(take(1)).subscribe( (league:LeagueInfo) => {
              this.selectedLeague = league;
              this.thisLeagueService.thisLeagueSubject.next(this.selectedLeague)
              if(this.selectedLeague) {
                this.inProgress=false
              } else {
                this.inProgress=false;
                this.errorMessage="Could not load league"
              }
            })
        };
      }
    );
  }

  toLeagueSettings() {
    this.router.navigate(['settings'], {relativeTo: this.route})
  }

  toDraftRoom() {
    switch(+this.selectedLeague.leagueTypeValue) {
      case 1:
        this.router.navigate(['draftroom', 'NCAAF'], {relativeTo: this.route});
        break;
      case 2:
        console.log("Football Pool");
        break;
      case 3:
        console.log("Fantasy Pick'em");
        break;
    }
  }

}
