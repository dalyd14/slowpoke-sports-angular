import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, take, filter } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { FirebaseOwner } from '../owner/owner.model';
import { Owner } from '../owner/owner.model';
import { CallAPI } from '../callAPI/callAPI';


interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

@Injectable({providedIn: 'root'})
export class AuthService {

    ownerFirebase = new BehaviorSubject<FirebaseOwner>(null)
    ownerDB = new BehaviorSubject<Owner>(null)

    private tokenExpirationnTimer: any;

    constructor(private http: HttpClient, private router: Router, private callAPI: CallAPI){}
    
    apiKey: string = 'AIzaSyDjR9cYATE1aibWVhK2bP4f0x0-_weFDvA'

    signup(email: string, password: string) {
        
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+this.apiKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(
                resData.email, 
                resData.localId, 
                resData.idToken, 
                +resData.expiresIn, 
            )
        })).toPromise();
    }

    signin(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+this.apiKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(
                resData.email, 
                resData.localId, 
                resData.idToken, 
                +resData.expiresIn);
            this.callAPI.updateOwnerAPI(
                {
                    ownerID : resData.localId,
                    data : {
                        currentSession : resData.idToken
                    }
                }
                ).pipe(take(1)).subscribe( (res: {response_message : string} ) => {
                    if(res.response_message != "Owner Updated"){
                        console.log(res.response_message)
                    }
                })
            this.callAPI.getOwnerInfoAPI(resData.localId).pipe(take(1)).subscribe((res: Owner) => {
                const updateOwnerSubject: Owner = {
                    'currentSession' : resData.idToken,
                    'ownerID' : res.ownerID,
                    'ownerEmail' : res.ownerEmail,
                    'ownerFirstName' : res.ownerFirstName,
                    'ownerLastName' : res.ownerLastName,
                    'leagues' : res.leagues,
                    'dateSignedUp' : res.dateSignedUp,
                    'favoriteNFLTeam' : res.favoriteNFLTeam,
                    'favoriteCollegeTeam' : res.favoriteCollegeTeam
                };
                this.ownerDB.next(updateOwnerSubject);
            })
        }));
    }

    async autoSignin() {
        const ownerData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: Date;
        } = await JSON.parse(localStorage.getItem('ownerData'));
        if(!ownerData) {
            return
        }

        const loadedOwner = new FirebaseOwner(
            ownerData.email,
            ownerData.id,
            ownerData._token,
            ownerData._tokenExpirationDate 
        );

        if(loadedOwner.token){
            this.ownerFirebase.next(loadedOwner)
        }

        if (ownerData){
            this.ownerFirebase.pipe(filter(val => val != null), take(1)).subscribe( (resFB : FirebaseOwner) => {
                this.callAPI.getOwnerInfoAPI(resFB.id).pipe(take(1)).subscribe((resDB: Owner) => {
                    const updateOwnerSubject: Owner = {
                        'currentSession' : resFB.token,
                        'ownerID' : resDB.ownerID,
                        'ownerEmail' : resDB.ownerEmail,
                        'ownerFirstName' : resDB.ownerFirstName,
                        'ownerLastName' : resDB.ownerLastName,
                        'leagues' : resDB.leagues,
                        'dateSignedUp' : resDB.dateSignedUp,
                        'favoriteNFLTeam' : resDB.favoriteNFLTeam,
                        'favoriteCollegeTeam' : resDB.favoriteCollegeTeam
                    };
                    this.ownerDB.next(updateOwnerSubject);
                })
                this.callAPI.updateOwnerAPI(
                    {
                        ownerID : resFB.id,
                        data : {
                            currentSession : resFB.token
                        }
                    }
                    ).pipe(take(1)).subscribe( (resStr: {response_message : string} ) => {
                        if(resStr.response_message != "Owner Updated"){
                            console.log(resStr.response_message)
                        }
                    })
            })            
        }


        const expirationDuration = 
            new Date(ownerData._tokenExpirationDate).getTime() - 
            new Date().getTime()
        this.autoLogout(expirationDuration);

    }

    logout() {
        this.ownerFirebase.pipe(take(1)).subscribe( ownerInfo => {
            this.callAPI.updateOwnerAPI(
                {
                    ownerID : ownerInfo.id,
                    data : {
                        currentSession : null
                    }
                }
                ).pipe(take(1)).subscribe( (res: {response_message : string} ) => {
                    if(res.response_message != "Owner Updated"){
                        console.log(res.response_message)
                    }
                })
        })
        this.ownerFirebase.next(null);
        this.ownerDB.next(null);
        this.router.navigate(['']);
        localStorage.removeItem('ownerData');
        if(this.tokenExpirationnTimer){
            clearTimeout(this.tokenExpirationnTimer);
        }
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationnTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration)
    }

    private handleAuthentication(email: string, ownerID: string, token: string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime() + expiresIn*1000);
        const ownerFB = new FirebaseOwner(
            email, 
            ownerID,
            token, 
            expirationDate,
            );
        this.ownerFirebase.next(ownerFB);

        this.autoLogout(expiresIn*1000);
        
        localStorage.setItem('ownerData',JSON.stringify(ownerFB))
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An Unexpected error occured.';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage)
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This Email is already taken';
                break;
            case 'EMAIL_NOT_FOUND' || 'INVALID_PASSWORD':
                errorMessage = 'This email and password combination is incorrect';
                break;
        }
        return throwError(errorMessage)
    }
}