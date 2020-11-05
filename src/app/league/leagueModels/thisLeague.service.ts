import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { LeagueInfo, LeagueDraftRoomInfo } from './leagueInfo.model';

@Injectable({providedIn: 'root'})
export class ThisLeagueService {
    thisLeagueSubject = new BehaviorSubject<LeagueInfo>(null);
    thisLeagueDraftSettings = new BehaviorSubject<LeagueDraftRoomInfo>(null)
}