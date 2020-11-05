import { GameInfo } from './gameClass.model';

export interface TeamInfo {
    id : number,
    school : string,
    mascot : string,
    teamAbbreviation : string,
    conference : string,
    conferenceAbbreviation : string,
    division : string,
    logos : string[],
    record : string,
    games : [GameInfo],
    NCAAFfantasyPointsTeam : number
}