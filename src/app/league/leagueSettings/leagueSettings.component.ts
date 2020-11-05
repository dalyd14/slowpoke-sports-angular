import { Component, OnInit } from '@angular/core';

import { ThisLeagueService } from '../leagueModels/thisLeague.service';
import { LeagueInfo, LeagueDraftRoomInfo } from '../leagueModels/leagueInfo.model';
import { CallAPI } from 'src/app/callAPI/callAPI';

@Component({
  selector: 'app-leagueSettings',
  templateUrl: './leagueSettings.component.html',
  styleUrls: ['./leagueSettings.component.css']
})
export class LeagueSettingsComponent implements OnInit {

  constructor(private thisLeagueService: ThisLeagueService, private callAPI: CallAPI) { }

  draftOrderInput = {}

  settingPages = [
    "League Admin",
    "Owner Information",
    "Draft Information",
    "League Settings"
  ]

  inProgress = false;

  ownerByID = {};

  thisLeagueInfo: LeagueInfo;
  thisLeagueDraftInfo: LeagueDraftRoomInfo;

  ngOnInit() {
    this.inProgress = true;
    this.thisLeagueService.thisLeagueSubject.subscribe( league => {
      league.owners.forEach( owner => {
        this.ownerByID[owner.ownerID] = {teamName : owner.thisLeagueTeamName, ownerName : owner.ownerFirstName + " " + owner.ownerLastName}
      })
      this.thisLeagueInfo = league;
      this.callAPI.getDraftRoomInfoAPI(league.leagueID).subscribe( res => {
        this.thisLeagueDraftInfo = res;
        this.draftOrderInput["leagueInfo"] = this.thisLeagueDraftInfo
        this.thisLeagueService.thisLeagueDraftSettings.next(res)
        this.inProgress = false
      })
      this.draftOrderInput["ownerIndex"] = this.ownerByID
    })
  }

  addLeagueDraftRoom() {
    this.callAPI.addNewLeagueDraftRoomAPI(
      {
        leagueID : this.thisLeagueInfo.leagueID,
        draftTime : new Date('2015-03-25')
      }
      ).subscribe( (res : {response_message : string}) => {
        if(res.response_message != "Draft Room Added") {
          console.log(res)
        }
        this.callAPI.getDraftRoomInfoAPI(this.thisLeagueInfo.leagueID).subscribe( leagueDraftInfo => {
          this.thisLeagueService.thisLeagueDraftSettings.next(leagueDraftInfo)
        })
      })
  }
}
