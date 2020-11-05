import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { take } from 'rxjs/operators';

import { LeagueInfoBrief } from 'src/app/league/leagueModels/leagueInfo.model';
import { CallAPI } from 'src/app/callAPI/callAPI';
import { AuthService } from 'src/app/auntentication/authentication.service';
import { Owner } from 'src/app/owner/owner.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-joinleagueform',
  templateUrl: './joinleagueform.component.html',
  styleUrls: ['./joinleagueform.component.css']
})
export class JoinLeagueFormComponent implements OnInit {
  @Input() currentLeagueOpened : LeagueInfoBrief;
  
  constructor(
    private router: Router, 
    private callAPI: CallAPI, 
    private authService: AuthService) { }

  myOwner = {} as Owner;
  errorMessage: string = null;
  thisLeagueCommissioner: string;

  ngOnInit() {
    this.authService.ownerDB.pipe(take(1)).subscribe( (res:Owner) => {
      this.myOwner = res
    })
    const comish = this.currentLeagueOpened.owners.find( x => x.commissioner == true)
    this.thisLeagueCommissioner = comish.ownerFirstName + " " + comish.ownerLastName.charAt(0) + "."
  }

  onSubmit(form:NgForm) {
    this.errorMessage = null
    const privateLeaguePassword = form.value.leaguePassword;
    const thisOwnerTeamName = form.value.ownerTeamName
    if ((!this.currentLeagueOpened.leaguePrivate) || (this.currentLeagueOpened.leaguePassword == privateLeaguePassword)) {
      this.joinLeague(new Date(), thisOwnerTeamName, this.currentLeagueOpened)
      form.resetForm()
    } else {
      this.errorMessage = "This password does not match with the league."
    }        
  }

  joinLeague(dateJoined: Date, ownerTeamName: string, joinedLeague: LeagueInfoBrief) {
    this.callAPI.updateLeagueNewOwnerAPI({
      leagueID : joinedLeague.leagueID,
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
              leagueID: joinedLeague.leagueID,
              ownerTeamName: ownerTeamName,
              ownerCommissioner: false,
              dateJoined: new Date(),
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
            this.router.navigate(['leagues',this.currentLeagueOpened.leagueID])
          })
      })
  }
}
