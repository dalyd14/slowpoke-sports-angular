export class LeagueInfo {
    leagueID: string;
	leagueName: string;
	leaguePassword: string;
	leaguePrivate: boolean;
	leagueTypeValue: number;
	leagueTypeName: string;
	owners: [
		{
            ownerID: string;
            ownerFirstName: string;
            ownerLastName: string;
			thisLeagueTeamName: string;
			commissioner: boolean
		}
	];
	dateLeagueCreated: Date;
    leagueHistory: any;
	leagueRules: any;
	draftTime: Date
}

export class LeagueInfoBrief {
	leagueID: string;
	leagueName: string;
	leaguePassword: string;
	leaguePrivate: boolean;
	leagueTypeValue: number;
	leagueTypeName: string;
	owners: [
		{
            ownerID: string;
            ownerFirstName: string;
            ownerLastName: string;
			thisLeagueTeamName: string;
			commissioner: boolean
		}
	];
}

export class LeagueDraftRoomInfo {
	draftID: string;
	draftTime: Date;
	leagueID: string;
	leagueTypeValue: string;
	leagueName: string;
	leagueRules: []
	owners: [
		{
			ownerID: string
			ownerFirstName: string;
			ownerLastName: string;
			thisLeagueTeamName: string;
			commissioner: boolean
		}
	]
	rounds: [
		{
			roundNumber: number;
			roundOrder: [string]
		}
	]
	availableTeams: []
	selectedTeams: []
}