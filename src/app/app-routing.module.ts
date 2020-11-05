import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component'
import { NCAAFComponent } from './NCAAF/NCAAF.component';
import { AuthenticationComponent } from './auntentication/authentication.component';
import { NCAAFscheduleHeaderComponent } from './NCAAF/NCAAFschedule/scheduleHeader/NCAAFscheduleHeader.component';
import { NCAAFscheduleDisplayComponent } from './NCAAF/NCAAFschedule/scheduleDisplay/NCAAFscheduleDisplay.component';
import { MyTeam } from './owner/myteam.component';
import { NFLComponent } from './NFL/NFL.component';
import { NFLscheduleDisplayComponent } from './NFL/NFLschedule/scheduleDisplay/scheduleDisplay.component';
import { NFLscheduleHeaderComponent } from './NFL/NFLschedule/scheduleHeader/scheduleHeader.component';
import { AuthGuard } from './auntentication/authentication.guard';
import { LeagueComponent } from './league/league.component';
import { NCAAFfantasyDraftComponent } from './draftRoom/NCAAFfantasyDraft/NCAAFfantasyDraft.component';
import { LeagueTeamsComponent } from './league/leagueTeams/leagueTeams.component';
import { LeagueSettingsComponent } from './league/leagueSettings/leagueSettings.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: AuthenticationComponent },
  { path: 'myteams', component: MyTeam, canActivate: [AuthGuard] },
  { path: 'leagues/:id', component: LeagueComponent, canActivate: [AuthGuard] , children: [
    { path: '', component: LeagueTeamsComponent, pathMatch: 'full' },
    { path: 'settings', component: LeagueSettingsComponent },
    { path: 'draftroom/NCAAF', component: NCAAFfantasyDraftComponent }
  ] },
  { path: 'NFL', component: NFLComponent, children: [
    { path: 'schedules', component: NFLscheduleHeaderComponent, children: [
      { path: ':id',  component: NFLscheduleDisplayComponent }
    ] }
  ] },
  { path: 'NCAAF', component: NCAAFComponent, children: [
    { path: 'schedules', component: NCAAFscheduleHeaderComponent, children: [
      { path: ':id',  component: NCAAFscheduleDisplayComponent }
    ] }
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
