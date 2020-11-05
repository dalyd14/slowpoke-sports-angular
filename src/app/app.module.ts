import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NCAAFscheduleDisplayComponent } from './NCAAF/NCAAFschedule/scheduleDisplay/NCAAFscheduleDisplay.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialModule } from './bootstrap/material.module';
import { NCAAFscheduleHeaderComponent } from './NCAAF/NCAAFschedule/scheduleHeader/NCAAFscheduleHeader.component';
import { WebsiteHeaderComponent } from './websiteHeader/websiteHeader.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationComponent } from './auntentication/authentication.component';
import { LoginComponent } from './auntentication/login/login.component';
import { RegisterComponent } from './auntentication/register/register.component';
import { NCAAFComponent } from './NCAAF/NCAAF.component';
import { AuthInterceptorService } from './auntentication/authentication-interceptor.service';
import { MyTeam } from './owner/myteam.component';
import { NFLComponent } from './NFL/NFL.component';
import { JoinLeagueComponent } from './owner/newLeague/joinLeague/joinLeague.component';
import { JoinLeagueFormComponent } from './owner/newLeague/joinLeague/joinLeagueForm/joinLeagueForm.component';
import { CreateLeagueComponent } from './owner/newLeague/createLeague/createLeague.component';
import { NewLeagueComponent } from './owner/newLeague/newLeague.component';
import { DisplayLeaguesComponent } from './owner/displayLeagues/displayLeagues.component';
import { LeagueTeamsComponent } from './league/leagueTeams/leagueTeams.component';
import { SettingsComponent } from './settings/settings.component';
import { NCAAFfantasyDraftComponent } from './draftRoom/NCAAFfantasyDraft/NCAAFfantasyDraft.component';
import { LeagueComponent } from './league/league.component';
import { LeagueSettingsComponent } from './league/leagueSettings/leagueSettings.component';
import { DraftOrderSettingsComponent } from './league/leagueSettings/draftOrderSettings/draftOrderSettings.component';
import { NFLscheduleDisplayComponent } from './NFL/NFLschedule/scheduleDisplay/scheduleDisplay.component';
import { NFLscheduleHeaderComponent } from './NFL/NFLschedule/scheduleHeader/scheduleHeader.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebsiteHeaderComponent,
    NCAAFComponent,
    NCAAFscheduleDisplayComponent,
    NCAAFscheduleHeaderComponent,
    AuthenticationComponent,
    LoginComponent,
    RegisterComponent,
    MyTeam,
    NFLComponent,
    JoinLeagueComponent,
    NewLeagueComponent,
    CreateLeagueComponent,
    DisplayLeaguesComponent,
    JoinLeagueFormComponent,
    LeagueTeamsComponent,
    SettingsComponent,
    NCAAFfantasyDraftComponent,
    LeagueComponent,
    LeagueSettingsComponent,
    DraftOrderSettingsComponent,
    NFLscheduleDisplayComponent,
    NFLscheduleHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptorService, 
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }