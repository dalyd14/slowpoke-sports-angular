import { Component, OnInit } from '@angular/core';

import { LeagueInfo } from '../leagueModels/leagueInfo.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ThisLeagueService } from '../leagueModels/thisLeague.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-leagueTeams',
  templateUrl: './leagueTeams.component.html',
  styleUrls: ['./leagueTeams.component.css']
})
export class LeagueTeamsComponent implements OnInit {
  
  constructor(
    private thisLeagueService: ThisLeagueService,
    private router: Router,
    private route: ActivatedRoute) { }

  thisLeagueInfo: LeagueInfo;

  ngOnInit() {
    this.thisLeagueService.thisLeagueSubject.pipe(take(1)).subscribe( (league:LeagueInfo) => {
      this.thisLeagueInfo = league
    })
  }

}
