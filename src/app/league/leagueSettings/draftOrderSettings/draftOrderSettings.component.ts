import { Component, OnInit, Input } from '@angular/core';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

import { CallAPI } from 'src/app/callAPI/callAPI';
import { ThisLeagueService } from '../../leagueModels/thisLeague.service';
import { take } from 'rxjs/operators';
import { Owner } from 'src/app/owner/owner.model';
import { AuthService } from 'src/app/auntentication/authentication.service';
import { LeagueInfo } from '../../leagueModels/leagueInfo.model';

@Component({
  selector: 'app-draftOrderSettings',
  templateUrl: './draftOrderSettings.component.html',
  styleUrls: ['./draftOrderSettings.component.css']
})
export class DraftOrderSettingsComponent implements OnInit {
  @Input() draftOrderInput;

  isCommish: boolean = false
  roundOrders = []
  ownerByID = []
  resetRoundOrders = []

  constructor(private callAPI: CallAPI, private authService: AuthService, private thisLeagueService: ThisLeagueService) { }

  ngOnInit() {
    this.resetRoundOrders = JSON.parse(JSON.stringify(this.draftOrderInput.leagueInfo.rounds));
    this.roundOrders = this.draftOrderInput.leagueInfo.rounds;
    this.ownerByID = this.draftOrderInput.ownerIndex;
    this.authService.ownerDB.pipe(take(1)).subscribe( (resOwner:Owner) => {
      this.thisLeagueService.thisLeagueSubject.pipe(take(1)).subscribe( (resLeague: LeagueInfo) => {
        let thisLeagueThisOwner = resLeague.owners.filter(leagueOwn => leagueOwn.ownerID == resOwner.ownerID)
        this.isCommish = thisLeagueThisOwner[0].commissioner
      })
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.roundOrders.filter(roundNum => +roundNum.round == +event.container.id)[0].roundOrder, event.previousIndex, event.currentIndex);
  }

  resetDraftOrder(){
    this.roundOrders = JSON.parse(JSON.stringify(this.resetRoundOrders))
  }

  onSnakeOrder(){
    let firstRoundOrder = [];
    for (let x of this.roundOrders[0].roundOrder) {
      firstRoundOrder.push(x);
    };
    for (let y of this.roundOrders) {
      y.roundOrder = firstRoundOrder;
      firstRoundOrder = firstRoundOrder.slice().reverse();
    }
  }

  onMirrorOrder(){
    let firstRoundOrder = this.roundOrders[0].roundOrder
    for (let y of this.roundOrders) {
      y.roundOrder = firstRoundOrder;
    }
  }

  submitDraftOrder() {
    const jsonInfo = {
      draftID : this.draftOrderInput.leagueInfo.draftID,
      addOwner : false,
      data : { rounds : this.roundOrders }
    }
    this.callAPI.updateNewLeagueDraftRoomAPI(jsonInfo).pipe(take(1)).subscribe((res:{response_message:string}) => {
      if(res.response_message != "Draft Room Updated") {
        console.log(res)
      } else {
        this.resetRoundOrders = JSON.parse(JSON.stringify(this.roundOrders))
      }
    })
  }

}
