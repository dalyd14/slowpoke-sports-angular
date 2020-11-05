import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ScoreInfo } from '../NCAAF/NCAAFmodels/scoresClass.model';
import { Owner } from '../owner/owner.model';
import { LeagueTypeInfo } from '../league/leagueModels/leagueTypes.model';
import { LeagueInfo, LeagueDraftRoomInfo } from '../league/leagueModels/leagueInfo.model';

@Injectable({providedIn: 'root'})
export class CallAPI {

    constructor(private http: HttpClient) {}

    resultsArr = {} as ScoreInfo;
    ownersArr = {} as Owner;
    draftRoom = {} as LeagueDraftRoomInfo;
    leagueArr: [LeagueInfo] = null;
    leagueTypesArr: [LeagueTypeInfo] = null;

    APIstring = 'http://127.0.0.1:5000/';

    postMessage = null

    public addNewOwnerAPI(JSONinfo: Owner) {
        return this.http.post( this.APIstring + 'owners/add', JSONinfo)
            .pipe(
                map(res => {
                    return res
                })
            );
    }

    public updateOwnerAPI(JSONinfo) {
        return this.http.put( this.APIstring + 'owners/update', JSONinfo)
            .pipe(
                map(res => {
                    return res
                })
            );
    }

    public updateOwnerLeagueAPI(JSONinfo) {
        return this.http.put( this.APIstring + 'owners/update/league', JSONinfo)
            .pipe(
                map(res => {
                    return res
                })
            );
    }

    public getOwnerInfoAPI(uid: string): Observable<any>{
        return this.http
            .get( this.APIstring + 'owners/' + uid)
            .pipe(
                map( (res: Owner) => {
                    this.ownersArr.currentSession = res.currentSession;
                    this.ownersArr.ownerID = res.ownerID;
                    this.ownersArr.ownerEmail = res.ownerEmail;
                    this.ownersArr.ownerFirstName = res.ownerFirstName;
                    this.ownersArr.ownerLastName = res.ownerLastName;
                    this.ownersArr.leagues = res.leagues;
                    this.ownersArr.dateSignedUp = res.dateSignedUp;
                    this.ownersArr.favoriteNFLTeam = res.favoriteNFLTeam;
                    this.ownersArr.favoriteCollegeTeam = res.favoriteCollegeTeam;
                    return this.ownersArr
                })
            ) 
    }
    
    public getLeagueTypeAPI(): Observable<any>{
        return this.http
            .get( this.APIstring + 'league/types')
            .pipe(
                map( (res: [LeagueTypeInfo]) => {
                    this.leagueTypesArr = res
                    return this.leagueTypesArr
                })
            ) 
    }

    public getLeaguesAPI(uid: string): Observable<any>{
        return this.http
            .get( this.APIstring + 'league/' + uid)
            .pipe(
                map( (res: [LeagueInfo]) => {
                    this.leagueArr = res
                    return this.leagueArr
                })
            ) 
    }

    public addNewLeagueAPI(JSONinfo: LeagueInfo) {
        return this.http.post( this.APIstring + 'league/add', JSONinfo)
            .pipe(
                map(res => {
                    return res
                })
            );
    }

    public updateLeagueNewOwnerAPI(JSONinfo) {
        return this.http.put( this.APIstring + 'league/update/newOwner', JSONinfo)
            .pipe(
                map(res => {
                    return res
                })
            );
    }

    public addNewLeagueDraftRoomAPI(JSONinfo) {
        return this.http.post( this.APIstring + '/draftRoom/add', JSONinfo)
            .pipe(
                map(res => {
                    return res
                })
            );
    }

    public updateNewLeagueDraftRoomAPI(JSONinfo) {
        return this.http.put( this.APIstring + '/draftRoom/update', JSONinfo)
            .pipe(
                map(res => {
                    return res
                })
            );
    }

    public getDraftRoomInfoAPI(uid: string): Observable<any>{
        return this.http
            .get( this.APIstring + 'draftRoom/' + uid)
            .pipe(
                map( (res: LeagueDraftRoomInfo) => {
                    this.draftRoom.draftID = res.draftID;
                    this.draftRoom.draftTime = res.draftTime;
                    this.draftRoom.leagueID = res.leagueID;
                    this.draftRoom.leagueName = res.leagueName;
                    this.draftRoom.leagueTypeValue = res.leagueTypeValue;
                    this.draftRoom.owners = res.owners;
                    this.draftRoom.rounds = res.rounds;
                    this.draftRoom.leagueRules = res.leagueRules;
                    this.draftRoom.availableTeams = res.availableTeams;
                    this.draftRoom.selectedTeams = res.selectedTeams;
                    return this.draftRoom
                })
            ) 
    }

    public callNCAAFscheduleAPI(year: number): Observable<any>{
        return this.http
            .get( this.APIstring + 'NCAAF/scores/' + year)
            .pipe(
                map( (res: ScoreInfo) => {
                    this.resultsArr.year = res.year;
                    this.resultsArr.schedule = res.schedule;
                    return this.resultsArr
                })
            ) 
    }

    public callNFLscheduleAPI(year: number): Observable<any>{
        return this.http
            .get( this.APIstring + 'NFL/scores/' + year)
            .pipe(
                map( (res: ScoreInfo) => {
                    this.resultsArr.year = res.year;
                    this.resultsArr.schedule = res.schedule;
                    return this.resultsArr
                })
            ) 
    }
}