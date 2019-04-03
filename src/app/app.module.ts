import { BrowserModule }                      from '@angular/platform-browser';
import { NgModule }                           from '@angular/core';
import { FormsModule }                        from '@angular/forms';
import { HttpClientModule }                   from '@angular/common/http';
import { ReactiveFormsModule }                from '@angular/forms';
import { BrowserAnimationsModule }            from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';

import { HTTP_INTERCEPTORS }                  from '@angular/common/http';
import { AuthInterceptor }                    from './auth/auth.interceptor';
import { AppRoutingModule }                   from './app-routing.module';

import { AppComponent }                       from './app.component';
import { DashboardComponent }                 from './dashboard/dashboard.component';
import { ProfileDetailComponent }             from './profile-detail/profile-detail.component';
import { CreateProfileComponent }             from './create-profile/create-profile.component';
import { EditProfileComponent }               from './edit-profile/edit-profile.component';
import { ProfilesComponent }                  from './profiles/profiles.component';
import { ProfileService }                     from './services/profile.service';

import { AuthService }                        from './auth/auth.service';
import { CallbackComponent }                  from './callback/callback.component';
import { ProfileListviewComponent }           from './profile-listview/profile-listview.component';
import { ProfileTileviewComponent }           from './profile-tileview/profile-tileview.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CreateProfileComponent,
    ProfileDetailComponent,
    EditProfileComponent,
    ProfilesComponent,
    CallbackComponent,
    ProfileListviewComponent,
    ProfileTileviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule, 
    MatCheckboxModule
  ],
  providers: [
    ProfileService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
