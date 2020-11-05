import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { CallAPI } from 'src/app/callAPI/callAPI';
import { FBSdraftTeam } from './NCAAFfantasyDraft.model';
import { ScoreInfo } from 'src/app/NCAAF/NCAAFmodels/scoresClass.model';
import { LeagueInfo } from 'src/app/league/leagueModels/leagueInfo.model';
import { ThisLeagueService } from 'src/app/league/leagueModels/thisLeague.service';

@Component({
  selector: 'app-NCAAFfantasyDraft',
  templateUrl: './NCAAFfantasyDraft.component.html',
  styleUrls: ['./NCAAFfantasyDraft.component.css']
})
//export class NCAAFfantasyDraftComponent implements OnInit {
export class NCAAFfantasyDraftComponent {

  thisLeagueInfo = {} as LeagueInfo;

  allTeams: FBSdraftTeam[] = new Array();
  filteredTeams: FBSdraftTeam[] = new Array();
  displayedTeam: FBSdraftTeam = null;
  allConfs: {group : string; name : string}[] = new Array();
  inProgress:boolean = false
  
  power5Filter = {
    mainFilter : "Power 5",
    completed : true,
    subFilters : [
      { name : "ACC", completed: true },
      { name : "Big Ten", completed: true },
      { name : "Big 12", completed: true },
      { name : "Pac-12", completed: true },
      { name : "SEC", completed: true }
    ]
  }
  group5Filter = {
    mainFilter : "Group of 5",
    completed : true,
    subFilters : [
      { name : "American Athletic", completed: true },
      { name : "Conference USA", completed: true },
      { name : "FBS Independents", completed: true },
      { name : "Mid-American", completed: true },
      { name : "Mountain West", completed: true },
      { name : "Sun Belt", completed: true }
    ],
  }

  allPower5Filters : boolean = true;
  allGroup5Filters : boolean = true;

  updateAllPower5() {
    this.allPower5Filters = this.power5Filter.subFilters != null && this.power5Filter.subFilters.every(t => t.completed);
    this.setAllFilters()
  }
  updateAllGroup5() {
    this.allGroup5Filters = this.group5Filter.subFilters != null && this.group5Filter.subFilters.every(t => t.completed);
    this.setAllFilters()
  }

  somePower5Filters() : boolean {
    return this.power5Filter.subFilters.filter( t => t.completed ).length > 0 && !this.allPower5Filters
  }
  someGroup5Filters() : boolean {
    return this.group5Filter.subFilters.filter( t => t.completed ).length > 0 && !this.allGroup5Filters
  }

  setAllPower5(completed: boolean) {
    this.allPower5Filters = completed;
    this.power5Filter.subFilters.forEach(t => t.completed = completed);
    this.setAllFilters()
  }
  setAllGroup5(completed: boolean) {
    this.allGroup5Filters = completed;
    this.group5Filter.subFilters.forEach(t => t.completed = completed);
    this.setAllFilters()
  }

  setAllFilters() {
    const filteredConferences = this.power5Filter.subFilters.filter( x => x.completed ).map( x => x.name).concat(
      this.group5Filter.subFilters.filter( x => x.completed ).map( x => x.name)
    )
    this.filteredTeams = this.allTeams.filter(conf => filteredConferences.includes(conf.teamConference))
  }

  sortTeams(value: string) {
    this.allTeams.sort(function(a, b) {
      var valueA = a[value].toUpperCase(); // ignore upper and lowercase
      var valueB = b[value].toUpperCase(); // ignore upper and lowercase
      if (valueA < valueB) {
        return -1;
      }
      if (valueA > valueB) {
        return 1;
      }
      return 0;
    })    
  }

  selectedTeam = null;

  /* constructor(private thisLeagueService: ThisLeagueService, private callAPI: CallAPI) { 
    this.inProgress = true;
    this.callAPI.callNCAAFscheduleAPI(new Date().getFullYear()).pipe(take(1)).subscribe( (res:ScoreInfo) => {  
      res.data.forEach( conf => {
        const newConf = {group : null, name : conf.conference}
        this.allConfs.push(newConf)
        conf.teams.forEach( team => {
          const schedule = team.games.map( game => {
            const scheduleGame = {
              gameNumber : game.gameID,
              gameDate : game.startDate,
              homeOrAway : game.homeOrAway,
              opponentID : game.opponentID,
              opponentName : game.opponentName,
              opponentLogos : game.opponentLogo
            }
            return scheduleGame
          })
          const addedTeam:FBSdraftTeam = {
            teamID: team.id,
            teamName : team.school,
            teamConferenceID: null,
            teamConference : team.conference,
            teamConferenceGroup : null,
            teamAbbreviation : team.teamAbbreviation,
            teamLogos : team.logos,
            teamSchedule : schedule
          }
          this.allTeams.push(addedTeam)
        })  
      })
      this.sortTeams("teamName");
      this.sortTeams("teamConference");
      this.filteredTeams = this.allTeams;
      this.inProgress=false;
      });
  } */

/*   ngOnInit() {
    this.thisLeagueService.thisLeagueSubject.subscribe(res => {
      this.thisLeagueInfo = res;
    })
  } */

  onSelectTeam(teamID) {
    this.selectedTeam = teamID;
    if (teamID) {
      this.displayedTeam = this.allTeams.find( x => {
        return x.teamID == teamID
      })
    }
  }

  onClearTeam() {
    this.selectedTeam = null;
    this.displayedTeam = null;
  }

}
