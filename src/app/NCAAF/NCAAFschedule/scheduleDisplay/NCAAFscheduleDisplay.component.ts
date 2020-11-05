import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router'
import {  switchMap } from 'rxjs/operators';
import { Subscription, timer } from 'rxjs';

import { CallAPI } from '../../../callAPI/callAPI';
import { GameInfo } from '../../NCAAFmodels/gameClass.model';
import { ScoreInfo } from '../../NCAAFmodels/scoresClass.model';
import { TeamInfo } from '../../NCAAFmodels/teamClass.model';


interface gameWeek {
  week_date : string,
  week_games : [GameInfo]
}

@Component({
  selector: 'app-NCAAFscheduleDisplay',
  templateUrl: './NCAAFscheduleDisplay.component.html',
  styleUrls: ['./NCAAFscheduleDisplay.component.css']
})
export class NCAAFscheduleDisplayComponent implements OnInit, OnDestroy {

  constructor(
    private callAPI: CallAPI,
    private route: ActivatedRoute) {}


  inProgress: boolean = false;
  errorMessage: string = null;

  todaysDate = new Date();
  selectedYear: number;
  results = {} as ScoreInfo;
  organized_results: gameWeek[];
  displayedColumns: string[] = [
    'week',
    'WLT',
    'teamName',
    'score',
    'opponentName'  
  ];
  selectedTeam = null;
  dataSource: TeamInfo[] = null;

  subscription: Subscription;
  statusText: string;


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          //this.selectedTeam = null;
          if (this.subscription) {
            this.subscription.unsubscribe();
          }
          this.inProgress = true;
          this.errorMessage = null;
          this.selectedYear = +params['id'];

          this.subscription = timer(0, 5000).pipe(
            switchMap(() => this.callAPI.callNCAAFscheduleAPI(this.selectedYear)))
            .subscribe( (result: ScoreInfo) => {
              console.log("Hi " + this.selectedYear)
              this.results=result
              if (this.results) {
                this.organized_results = this.organize_schedule(result)
                this.inProgress = false
              } else {
                this.errorMessage = "Could not load this year's schedule";
                this.inProgress = false;
              }
            })
        }
      );
  }

  organize_schedule(result: ScoreInfo){
    var organized = []  
    var found = true
    var week_num = 1
    var week_date_str = ""
    while (found) {
      const week_of_games = result.schedule.find(game => game.week == week_num)
      if (week_of_games) {
        week_date_str = "Week of " + week_of_games.game_date.split(" ").slice(0,3).join(" ") + " : Week " + week_num
        const week_games = result.schedule.filter(week => week.week == week_num)
        const week = {
          week_date : week_date_str,
          week_games : week_games
        }
        organized.push(week)
        week_num += 1
        found = true        
      } else {
        found = false
      }
      if (week_num > 30) {
        console.log("week num got to 30!")
        found = false
      }
    }
    return organized
  }

  // showGames(id:number) {
  //   this.selectedTeam = id;
  //   const resConf = this.results.schedule.filter(conf => conf.teams.some(
  //     team => team.id == id)
  //   )
  //   const resTeam = resConf[0].teams.filter(team => team.id == id);
  //   this.dataSource = resTeam;
  // }

}