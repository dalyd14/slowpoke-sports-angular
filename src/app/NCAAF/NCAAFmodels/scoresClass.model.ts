//import { TeamInfo } from './teamClass.model';

export interface ScoreInfo {
    year : number,
    schedule : [GameInfo],
}

export interface GameInfo {
    week : number,
    game_date : string,
    home_team : string,
    home_id : number,
    away_team : string,
    away_id : number,
    quarter : number,
    time_remaining : number,
    home_score : number,
    away_score : number
}