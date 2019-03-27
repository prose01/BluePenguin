import { BrowserModule }                          from '@angular/platform-browser';
import { NgModule }                               from '@angular/core';
import { FormsModule }                            from '@angular/forms';
import { HttpClientModule }                       from '@angular/common/http';
import { ReactiveFormsModule }                    from '@angular/forms';
import { OktaAuthModule, OktaCallbackComponent }  from '@okta/okta-angular';

import { AppRoutingModule }       from './app-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app.auth.interceptor';

import { AppComponent }           from './app.component';
import { DashboardComponent }     from './dashboard/dashboard.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { EditProfileComponent }   from './edit-profile/edit-profile.component';
import { ProfilesComponent }      from './profiles/profiles.component';
import { ProfileService }         from './services/profile.service';

const config = {
  issuer: 'https://dev-473869.oktapreview.com/oauth2/default',
  redirectUri: 'http://localhost:4200/implicit/callback',
  clientId: '0oagbo2stzMlAcTK90h7',
  scope: 'openid profile email'
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CreateProfileComponent,
    ProfileDetailComponent,
    EditProfileComponent,
    ProfilesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    OktaAuthModule.initAuth(config),
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [ProfileService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})

export class AppModule { }
