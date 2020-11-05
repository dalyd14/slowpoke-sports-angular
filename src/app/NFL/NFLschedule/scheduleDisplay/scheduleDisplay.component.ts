import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router'
import { switchMap } from 'rxjs/operators';
import { Subscription, timer } from 'rxjs';

import { CallAPI } from '../../../callAPI/callAPI';
import { GameInfo } from '../../NFLmodels/NFLscoresClass.model';
import { ScoreInfo } from '../../NFLmodels/NFLscoresClass.model';


interface gameWeek {
  week_date : string,
  week_games : [GameInfo]
}

@Component({
  selector: 'app-scheduleDisplay',
  templateUrl: './scheduleDisplay.component.html',
  styleUrls: ['./scheduleDisplay.component.css']
})
export class NFLscheduleDisplayComponent implements OnInit {

  constructor(
    private callAPI: CallAPI,
    private route: ActivatedRoute) {}


  inProgress: boolean = false;
  errorMessage: string = null;

  counter = 0

  todaysDate = new Date();
  selectedYear: number;
  selectedWeek: GameInfo[];
  results = {} as ScoreInfo;
  organized_results: gameWeek[];
  displayedColumns: string[] = [
    'week',
    'WLT',
    'teamName',
    'score',
    'opponentName'  
  ];

  subscription: Subscription;
  statusText: string;
  selectedWeekIndex: number;


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
            switchMap(() => this.callAPI.callNFLscheduleAPI(this.selectedYear)))
            .subscribe( (result: ScoreInfo) => {
              this.results=result
              if (this.results) {
                this.organized_results = this.organize_schedule(result)
                if (this.selectedWeekIndex) {
                  this.onSelectWeek(this.selectedWeekIndex)
                }
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
      const week_of_games = result.schedule.find(game => game.week_num == week_num)
      if (week_of_games) {
        week_date_str = "Week of " + week_of_games.game_date.split(" ").slice(0,3).join(" ") + " : Week " + week_num
        const week_games = result.schedule.filter(week => week.week_num == week_num)
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

  onSelectWeek(a) {
    this.counter += 1
    console.log("update Num: " + this.counter)
    this.selectedWeekIndex = a
    this.selectedWeek = this.organized_results[a].week_games
  }
}
