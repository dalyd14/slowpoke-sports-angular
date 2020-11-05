import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { CallAPI } from 'src/app/callAPI/callAPI';
import { AuthService } from 'src/app/auntentication/authentication.service';
import { LeagueInfoBrief, LeagueInfo } from 'src/app/league/leagueModels/leagueInfo.model';
import { Owner } from '../../owner.model';

@Component({
  selector: 'app-joinLeague',
  templateUrl: './joinLeague.component.html',
  styleUrls: ['./joinLeague.component.css']
})
export class JoinLeagueComponent implements OnInit {

  constructor(
    private router: Router,
    private callAPI: CallAPI, 
    private authService: AuthService) { }

  allMyLeagues = [];
  allNotMyLeagues = [];
  myOwner = {} as Owner;
  errorMessage: string = null;

  currentLeagueOpened = {} as LeagueInfoBrief;

  ngOnInit() {
    this.authService.ownerDB.pipe(take(1)).subscribe( (res:Owner) => {
      this.myOwner = res
      this.callAPI.getLeaguesAPI("all").pipe(take(1)).subscribe( (res: [LeagueInfo]) => {
        res.forEach(league => {
          const thisLeague = {
            leagueID : league.leagueID,
            leagueName : league.leagueName,
            leaguePassword : league.leaguePassword,
            leaguePrivate : league.leaguePrivate,
            leagueTypeName : league.leagueTypeName,
            leagueTypeValue : league.leagueTypeValue,
            owners : league.owners          
          }
          if (thisLeague.owners.find(x => x.ownerID == this.myOwner.ownerID)) {
            this.allMyLeagues.push(thisLeague)
          } else {
            this.allNotMyLeagues.push(thisLeague)
          }
        })
        })  
    })      
  }

  onSubmit(form: NgForm) {
    const privateLeagueID = form.value.leagueID;
    const privateLeaguePassword = form.value.leaguePassword;
    const thisOwnerTeamName = form.value.ownerTeamName
    const y = this.allNotMyLeagues.find( x => x.leagueID == privateLeagueID )
    const w = this.allMyLeagues.find( x => x.leagueID == privateLeagueID )
    if (w) {
      this.errorMessage = "You are already a member of this league."
    } else {
      if (y) {
        if (y.leaguePassword == privateLeaguePassword) {
          this.joinLeague(new Date(), privateLeagueID, thisOwnerTeamName, y);
          this.onReset(form);
        } else {
          this.errorMessage = "This password does not match with the league."
        }        
      } else {
        this.errorMessage = "This league does not exist."
      }
    }
  }

  joinLeague(dateJoined: Date, leagueID: string, ownerTeamName: string, joinedLeague: LeagueInfoBrief) {
    this.callAPI.updateLeagueNewOwnerAPI({
      leagueID : leagueID,
      data : {
        owners : {
          ownerID: this.myOwner.ownerID,
          ownerFirstName: this.myOwner.ownerFirstName,
          ownerLastName: this.myOwner.ownerLastName,
          thisLeagueTeamName: ownerTeamName,
          commissioner: false          
        }
      }
      }).pipe(take(1)).subscribe((res:{response_message:string}) => {
        if (res.response_message != "League Updated") {
          console.log(res.response_message)
        }
        this.callAPI.updateOwnerLeagueAPI({
          ownerID : this.myOwner.ownerID,
          data : {
            leagues : {
              leagueTypeValue: joinedLeague.leagueTypeValue,
              leagueTypeName: joinedLeague.leagueTypeName,
              leagueName: joinedLeague.leagueName,
              leagueID: leagueID,
              ownerTeamName: ownerTeamName,
              ownerCommissioner: false,
              dateJoined: dateJoined,
              ownerHistoryWithLeague: null
            }
          }
          }).pipe(take(1)).subscribe((res:{response_message:string}) => {
            if (res.response_message != "Owner Updated") {
              console.log(res.response_message)
            }
            const newOwnerLeague = {
              leagueTypeValue: joinedLeague.leagueTypeValue,
              leagueTypeName: joinedLeague.leagueTypeName,
              leagueName: joinedLeague.leagueName,
              leagueID: joinedLeague.leagueID,
              ownerTeamName: ownerTeamName,
              ownerCommissioner: false,
              dateJoined: dateJoined,
              ownerHistoryWithLeague: null             
            }
            let newOwner = this.myOwner;
            newOwner.leagues.push(newOwnerLeague);
            this.authService.ownerDB.next(newOwner)
            this.router.navigate(['leagues', joinedLeague.leagueID])
          })
      })
  }

  onReset(form:NgForm) {
    form.resetForm();
  }

  onSwitchLeague(selectedLeagueID: string) {
    this.currentLeagueOpened = this.allNotMyLeagues.find( x => x.leagueID == selectedLeagueID )
  }
}
