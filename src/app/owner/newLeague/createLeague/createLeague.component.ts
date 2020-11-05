import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/auntentication/authentication.service';
import { LeagueTypeInfo } from 'src/app/league/leagueModels/leagueTypes.model';
import { CallAPI } from 'src/app/callAPI/callAPI';
import { Owner } from '../../owner.model';

@Component({
  selector: 'app-createLeague',
  templateUrl: './createLeague.component.html',
  styleUrls: ['./createLeague.component.css']
})
export class CreateLeagueComponent implements OnInit {

  constructor(private router: Router, private callAPI: CallAPI, private authService: AuthService) { }

  leagueTypes = new Array();
  myOwner = {} as Owner;
  leaguePrivate = true;

  createLeagueInProgress = false;

  ngOnInit() {
    this.createLeagueInProgress = true;
    this.callAPI.getLeagueTypeAPI().pipe(take(1)).subscribe( (res:[LeagueTypeInfo]) => {
      this.leagueTypes = res.sort((a, b) => (a.id > b.id) ? 1 : -1)
      if (this.leagueTypes) {
        this.createLeagueInProgress = false;
      }
    })
    this.authService.ownerDB.pipe(take(1)).subscribe( (res:Owner) => {
      this.myOwner = res
    })
  }

  async onSubmit(form: NgForm) {
    const dateJoined = new Date()
    const leagueID = Date.now().toString()
    this.submitToAPI(form.value, leagueID, dateJoined)
    await this.router.navigate(['leagues',leagueID])
    this.onResetForm(form)
  }

  submitToAPI(form: {
    leagueName : string,
    leaguePassword : string,
    leaguePrivate : boolean,
    newLeagueType : number,
    ownerTeamName : string
  }, leagueID: string, dateJoined: Date) {
    this.callAPI.addNewLeagueAPI({
      leagueID: leagueID,
      leagueName: form.leagueName.trim(),
      leaguePassword: form.leaguePassword ? form.leaguePassword : null,
      leaguePrivate: form.leaguePrivate,
      leagueTypeValue: form.newLeagueType,
      leagueTypeName: this.leagueTypes.find( x => x.id == form.newLeagueType).name,
      owners: [{
        ownerID: this.myOwner.ownerID,
        ownerFirstName: this.myOwner.ownerFirstName,
        ownerLastName: this.myOwner.ownerLastName,
        thisLeagueTeamName: form.ownerTeamName,
        commissioner: true  
      }],
      dateLeagueCreated: dateJoined,
      leagueHistory: null,
      leagueRules: {
        maxNumberOfTeams : form.newLeagueType == 1 ? 12 : null,
      },
      draftTime: null
      }).pipe(take(1)).subscribe((res:{response_message:string}) => {
        if(res.response_message != "League Added"){
          console.log(res)
        }
        this.callAPI.updateOwnerLeagueAPI(
          {
            ownerID : this.myOwner.ownerID,
            data : {
              leagues : {
                leagueTypeValue: form.newLeagueType,
                leagueTypeName: this.leagueTypes.find( x => x.id == form.newLeagueType).name,
                leagueName: form.leagueName.trim(),
                leagueID: leagueID,
                ownerTeamName: form.ownerTeamName,
                ownerCommissioner: true,
                dateJoined: dateJoined,
                ownerHistoryWithLeague: null                
              }
            }
          }).pipe(take(1)).subscribe((res:{response_message:string}) => {
            if(res.response_message != "Owner Updated") {
              console.log(res)
            }
            const newOwnerLeague = {
              leagueTypeValue: form.newLeagueType,
              leagueTypeName: this.leagueTypes.find( x => x.id == form.newLeagueType).name,
              leagueName: form.leagueName.trim(),
              leagueID: leagueID,
              ownerTeamName: form.ownerTeamName,
              ownerCommissioner: true,
              dateJoined: dateJoined,
              ownerHistoryWithLeague: null            
            }
            let newOwner = this.myOwner;
            newOwner.leagues.push(newOwnerLeague);
            this.authService.ownerDB.next(newOwner)
          })
      })
  }

  onResetForm(form: NgForm) {
    form.resetForm()
    this.leaguePrivate = true
  }
}
