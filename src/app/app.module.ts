import { BrowserModule }    from '@angular/platform-browser';
import { NgModule }         from '@angular/core';
import { FormsModule }      from '@angular/forms';
import { HttpModule }       from '@angular/http';

import { AppRoutingModule }       from './app-routing.module';

import { AppComponent }           from './app.component';
import { DashboardComponent }     from './dashboard/dashboard.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { ProfilesComponent }      from './profiles/profiles.component';
import { ProfileService }         from './services/profile.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProfileDetailComponent,
    ProfilesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [ProfileService],
  bootstrap: [AppComponent]
})

export class AppModule { }
