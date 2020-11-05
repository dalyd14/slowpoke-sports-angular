export interface GameInfo {
    gameID : number,
    week : number,
    startDate : Date,
    teamRank : number,
    opponentRank : number,
    teamID : number,
    teamName : string,
    opponentID : number,
    opponentName : string,
    opponentLogo : [string]
    teamScore : number,
    opponentScore : number,
    homeOrAway : string,
    WLT : string,
    NCAAFfantasyPointsGame : number
}