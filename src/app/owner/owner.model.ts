export class Owner {
    constructor(
        public currentSession: string,
        public ownerID: string,
        public ownerEmail: string,
        public ownerFirstName: string,
        public ownerLastName: string,
        public leagues:OwnerLeageInfo[],			
        public dateSignedUp: Date,
        public favoriteNFLTeam: string,
        public favoriteCollegeTeam: string           
    ){}
}

interface OwnerLeageInfo {
    leagueTypeValue: number,
    leagueTypeName: string,
    leagueName: string,
    leagueID: string,
    ownerTeamName: string,
    ownerCommissioner: boolean,
    dateJoined: Date,
    ownerHistoryWithLeague: any
}

export class FirebaseOwner {
    constructor(
        public email: string, 
        public id: string, 
        private _token: string,
        private _tokenExpirationDate: Date
    ){}

    get token() {
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {           
            return null;
        }
        return this._token 
    }
}