export class NCAAFfantasyDraft {
    constructor (
        public draftID : string,
        public draftTime : Date,
        public leagueID : string,
        public leagueName : string,
        public leagueRules : {
            pickTimeLimit : number,
            numberOfOwners : number,
        },
        public owners : leagueDraftOwner[],
        public rounds : rounds[],
        public availableTeams : [{
            teamID : number
        }],
        public selectedTeams : {
            teamID : number
        }[]
    ) {}
}

interface rounds {
    roundNumber : number,
    status : string,
    orderOfRound : {
        pickNumber : number,
        ownerID : string,
    }[],
    roundSelections : {
        pickNumber : number,
        ownerID : number,
        pickTeamID : number
    }[]
}

interface leagueDraftOwner {
    ownerID : string,
    ownerFirstName : string,
    ownerLastName : string,
    thisLeagueTeamName : string,
    commissioner : boolean      
}

export class FBSdraftTeam {
    constructor(
        public teamID: number,
        public teamName : string,
        public teamConferenceID: number,
        public teamConference : string,
        public teamConferenceGroup : string,
        public teamAbbreviation : string,
        public teamLogos : string[],
        public teamSchedule : {
            gameNumber : number,
            gameDate : Date,
            homeOrAway : string,
            opponentID : number,
            opponentName : string,
            opponentLogos : string[]
        }[]
    ){}
}